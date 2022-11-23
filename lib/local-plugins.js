// Local plugins for Metalsmith.

import hljs from "highlight.js";
import markdown_it from "metalsmith-markdownit";
import multimatch from "multimatch";

// utilities
function ensure_array(val) {
  return Array.isArray(val) ? val : [val];
}

/// Wrap metalsmith-markdownit, applying all of our desired
/// configuration and loading parser extensions.  Needs to be
/// used via `metalsmith.use(await custom_markdown()` because
/// runtime imports are an async operation.
export async function custom_markdown() {
  const markdown = markdown_it({
    typographer: true,
    html: true,
    highlight: (str, lang) => {
      if (lang) {
        const hlang = hljs.getLanguage(lang);
        if (hlang) {
          const canon_lang = hlang.name.toLowerCase();
          try {
            const highlighted = hljs.highlight(str, {
              language: lang,
            }).value;
            return `<pre class="hljs language-${canon_lang}"><code>${highlighted}</code></pre>`;
          } catch (_unused) {
            // discard exception and take fallback path
          }
        }
      }
      // if we get here, either we don't have a language tag or it wasn't
      // recognized
      const highlighted = markdown.parser.utils.escapeHtml(str);
      return `<pre class="hljs language-none"><code>${highlighted}</code></pre>`;
    },
  });

  const parser_extensions = [
    "anchor",
    "attrs",
    "deflist",
    "footnote",
    "katex",
    "sub",
    "sup",
  ];
  const parser_mods = await Promise.all(
    parser_extensions.map((mdx) => import(`markdown-it-${mdx}`))
  );
  parser_mods.map((mod) => markdown.parser.use(mod.default));

  // As of metalsmith-markdownit 0.5.0, the name of the function
  // object we're about to return is "plugin."  Change that to
  // "markdown", to make the list of pipeline stages in the debug
  // UI less confusing.
  Object.defineProperty(markdown, "name", { value: "markdown" });

  return markdown;
}

/// Rename files that match patterns.
/// Patterns are specified as an array of objects like this:
/// {
///   files: ['multimatch', 'patterns'],
///   match_opts: { ... multimatch options if desired ... },
///   from: /regular expression/ | "string",
///   to:   'replacement',
///  }
///
/// Each object specifies one rename operation; they are applied in the
/// order they appear in the array.  For each file matched by the
/// patterns in 'files', its name is passed through
///   String.replace(from, to).
///
/// The 'match_opts' and 'from' keys are optional.  Omitting 'match_opts'
/// is the same as specifying an empty object.  Omitting 'from' is the same
/// as specifying /^.*$/s, i.e. the entire string will be replaced.
///
/// You can give a key 'file' instead of 'files'; in this case, it is an
/// error if the patterns match more than one file. It is also an error if
/// a rename would clobber an existing file, which means that if you leave
/// 'from' out, it doesn't make sense for 'files' to match more than one file.
///
/// In case the patterns are coming from a data source that doesn't support
/// regular expression literals, you can give a two-element array as 'from';
/// this will be fed through `new RegExp(...from)`.
export function rename_patterns(patterns_raw) {
  class RenamePattern {
    constructor(pat) {
      const { files, file, match_opts = {}, from, to, ...rest } = pat;
      if (Object.keys(rest).length > 0) {
        throw new Error(`unrecognized rename pattern keys: ${rest}`);
      }
      if (!files && !file) {
        throw new Error("rename pattern has no files to work on");
      }
      if (files && file) {
        throw new Error("cannot specify both 'files' and 'file'");
      }
      if (to === undefined || to === null) {
        throw new Error("nothing to rename to");
      }

      this.files = ensure_array(files || file);
      this.match_opts = match_opts;
      this.to = to;
      if (Array.isArray(from) && from.length === 2) {
        let [pat, flags] = from;
        if (!flags.includes("u")) flags += "u";
        this.from = new RegExp(pat, flags);
      } else if (typeof from === "undefined") {
        // leave 'from' undefined in vpat
      } else if (typeof from === "string" || Symbol.replace in from) {
        this.from = from;
      } else {
        throw new Error(`rename pattern has invalid 'from': ${from}`);
      }
    }

    match(files) {
      const matched = multimatch(files, this.files, this.match_opts);
      if (this.single_file && files.length > 1) {
        throw new Error(`${this.files} matched multiple files: ${files}`);
      }
      return matched;
    }

    rename(fname) {
      if (this.from === undefined) return this.to;
      return fname.replace(this.from, this.to);
    }
  }

  const patterns = ensure_array(patterns_raw).map(
    (pat) => new RenamePattern(pat)
  );

  return function rename(tree, _unused, done) {
    for (const pat of patterns) {
      const files = pat.match(Object.keys(tree));
      for (const src of files) {
        const dst = pat.rename(src);
        if (Object.hasOwn(tree, dst)) {
          throw new Error(`renaming ${src} to ${dst}: File exists`);
        }
        tree[dst] = tree[src];
        delete tree[src];

        if (Object.hasOwn(tree[dst], "path")) {
          const psrc = tree[dst].path;
          const pdst = pat.rename(psrc);
          tree[dst].path = pdst;
        }
      }
    }
    done();
  };
}

/// Like @metalsmith/default-values, this plugin adds stuff to file
/// metadata if it isn't already present.  Also like that plugin, you
/// use it like so:
///
/// metalsmith.use(default_values_from_path([
///    {
///      pattern: ["globs", "matching", "files", "to", "manipulate"],
///      defaults: { key1: "value", key2: "value" }
///    },
///    {
///      pattern: ["file", "set", "two"],
///      defaults: (file, path, ms) => {
///        return { key1: "value", key2: "value" }
///      }
///    },
/// ])
///
/// The pattern can be either a single string or an array, as usual.
///
/// The key differences are in how callback functions are used:
///  - You pass *one* callback function as 'defaults' and it returns
///    an entire defaults dictionary.
///  - The callback function has access to the file's path and the
///    Metalsmith object, not just to the file's metadata.
///
/// Note that matching is nonexclusive -- if more than one of the
/// pattern specs matches a file, _all_ of their defaults will be
/// applied.
export function default_values_from_path(specs_raw) {
  class DefaultsSpec {
    constructor(spec) {
      const { defaults, pattern = "**", match_opts = {}, ...rest } = spec;
      if (Object.keys(rest).length > 0) {
        throw new Error(`unrecognized defaults spec keys: ${rest}`);
      }

      this.pattern = ensure_array(pattern);
      this.match_opts = match_opts;

      switch (typeof defaults) {
        case "function":
          this.get_defaults = defaults;
          break;

        case "object":
          if (defaults === null)
            throw new Error(`defaults missing from defaults spec`);
          if (Object.keys(defaults).length === 0)
            throw new Error(`empty defaults spec`);
          this.get_defaults = (..._unused) => {
            return defaults;
          };
          break;

        case "undefined":
          throw new Error(`defaults missing from defaults spec`);
        default:
          throw new Error(`bad defaults spec: '${defaults}'`);
      }
    }

    match(files) {
      return multimatch(files, this.pattern, this.match_opts);
    }

    add_defaults(file, path, ms) {
      for (const [k, v] of Object.entries(this.get_defaults(file, path, ms))) {
        if (!Object.hasOwn(file, k)) file[k] = v;
      }
    }
  }

  const specs = ensure_array(specs_raw).map((spec) => new DefaultsSpec(spec));

  return function apply_defaults(tree, ms, done) {
    const paths = Object.keys(tree);
    for (const spec of specs) {
      for (const path of spec.match(paths)) {
        spec.add_defaults(tree[path], path, ms);
      }
    }
    done();
  };
}
