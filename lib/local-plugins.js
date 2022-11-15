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
          } catch (_unused) {}
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
  const patterns = ensure_array(patterns_raw).map((pat) => {
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

    const vpat = {
      files: ensure_array(files || file),
      match_opts,
      to,
    };
    if (Array.isArray(from) && from.length === 2) {
      vpat.from = new RegExp(...from);
    } else if (typeof from === "undefined") {
      // leave 'from' undefined in vpat
    } else if (typeof from === "string" || Symbol.replace in from) {
      vpat.from = from;
    } else {
      throw new Error(`rename pattern has invalid 'from': ${from}`);
    }
    return vpat;
  });

  return (tree, _unused, done) => {
    for (const pat of patterns) {
      const files = multimatch(Object.keys(tree), pat.files, pat.match_opts);
      if (pat.single_file && files.length > 1) {
        throw new Error(`${pat.files} matched multiple files: ${files}`);
      }
      for (const src of files) {
        const dst = Object.hasOwn(pat, "from")
          ? src.replace(pat.from, pat.to)
          : pat.to;
        if (Object.hasOwn(tree, dst)) {
          throw new Error(`renaming ${src} to ${dst}: File exists`);
        }
        tree[dst] = tree[src];
        delete tree[src];
      }
    }
    done();
  };
}
