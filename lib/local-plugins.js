// Local plugins for Metalsmith.

import hljs from "highlight.js";
import { DateTime } from "luxon";
import base_layouts from "@metalsmith/layouts";
import markdown_it from "metalsmith-markdownit";
import multimatch from "multimatch";
import { simpleGit as Git } from "simple-git";

import * as util from "node:util";

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

/// Wrap @metalsmith/layouts, adding various useful things to the
/// template environment.  Note that, although Nunjucks is never
/// mentioned by name here, this code does assume that that's the
/// template engine in use.
export function custom_nunjucks() {
  // Some of the layout hooks need access to the 'files' pipeline
  // argument.  The base 'layouts' plugin doesn't give us any convenient
  // way to access that, so we wrap its pipeline function in our own
  // function that captures the arguments for us.
  let files;

  function filter_inspect(obj, ...opts) {
    return util.inspect(obj, ...opts);
  }

  function filter_describe_collections(obj) {
    // obj should be an object whose keys are the category slugs.
    // Weed out the unwanted 'pages' and 'posts' categories,
    // then convert the list of slugs into a list of [slug, title]
    // pairs, sort that list by title, and return it.
    return Object.keys(obj)
      .filter((slug) => slug !== "pages" && slug !== "posts")
      .map((slug) => [slug, files[`${slug}/index.html`].title])
      .sort((a, b) => (a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0));
  }

  const base_layout_fn = base_layouts({
    engineOptions: {
      filters: {
        inspect: filter_inspect,
        describe_collections: filter_describe_collections,
      },
    },
  });
  return function layouts(_files, _metalsmith, _done) {
    files = _files;
    return base_layout_fn(_files, _metalsmith, _done);
  };
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

/// Annotate files with creation and last modification dates.
///
/// For each file selected by the 'patterns', scan its Git history.
/// Commits whose hash is in the 'exclude' list are discarded
/// (we use set containment, so this must be the _complete_ hash).
/// The "author date" of all surviving commits is put in a list.
///
/// Then, we attempt to parse any existing file metadata items named
/// 'date', 'created', 'published', or 'modified'; you can add to this
/// list with the 'date_keys' option.  (Any syntax accepted by the
/// Luxon fromISO, fromSQL, fromRFC2822, or fromHTTP constructors, in
/// that order, may be used.)  Any successfully parsed items are added
/// to the list.  Finally, the oldest entry in the list is stored
/// under the 'creation_date' metadata key as a Luxon DateTime object.
/// If there is more than one entry in the list, then the _newest_
/// entry in the list is stored under the 'last_modification_date'
/// metadata key, also as a Luxon DateTime object.
///
/// You can supply constructor options for simple-git under the
/// 'git_opts' key, and multimatch options under the 'match_opts' key.
/// You can specify options for Luxon's string timestamp parser under
/// the 'date_parse_opts' key: the default is { zone: 'utc' },
/// i.e. timestamps with no time zone information are to be
/// interpreted as UTC.  (Timestamps extracted from Git history are
/// always interpreted as UTC, since what it gives us is
/// seconds-since-epoch.)  Finally, 'date_opts' specifies time zone,
/// locale, etc that _every_ timestamp will be _converted_ to before
/// adding them to the file metadata.
export function dates_from_git_history(options_raw) {
  const {
    patterns: patterns_raw = ["**"],
    exclude: exclude_raw = [],
    date_keys: date_keys_raw = [],
    git_opts = {},
    match_opts = {},
    date_parse_opts = { zone: "utc" },
    date_opts = {},
    ...rest
  } = options_raw;
  if (Object.keys(rest).length > 0) {
    throw new Error(`unrecognized options: ${Object.keys(rest)}`);
  }

  const patterns = ensure_array(patterns_raw);
  const exclude = new Set(ensure_array(exclude_raw));
  const date_keys = new Set(date_keys_raw);
  ["date", "created", "modified", "published"].forEach((k) => {
    date_keys.add(k);
  });

  date_opts.zone ??= "utc";
  date_opts.locale ??= "en";
  date_opts.outputCalendar ??= "iso8601";
  date_opts.numberingSystem ??= null;

  function parse_timestamp(s) {
    return DateTime.fromSeconds(parseInt(s), { zone: "utc" });
  }

  function parse_date_string(s) {
    let d;

    d = DateTime.fromISO(s, date_parse_opts);
    if (d.isValid) return d;
    d = DateTime.fromSQL(s, date_parse_opts);
    if (d.isValid) return d;
    d = DateTime.fromRFC2822(s, date_parse_opts);
    if (d.isValid) return d;
    d = DateTime.fromHTTP(s, date_parse_opts);
    if (d.isValid) return d;

    throw new Error(`cannot parse '${s}' as a date and time`);
  }

  function reconfigure_date(d) {
    // The 'reconfigure' method ignores keys it doesn't handle.
    // In particular, d.reconfigure({ zone: 'utc' }) is a no-op.
    return d.setZone(date_opts.zone).reconfigure(date_opts);
  }

  async function git_date_range(git, fname, file, excludes) {
    const dates = [];
    for (const k of date_keys) {
      if (Object.hasOwn(file, k)) {
        try {
          const d = parse_date_string(file[k]);
          dates.push(d);
        } catch (_unused) {
          // ignore dates that can't be parsed
        }
      }
    }

    let git_history;
    try {
      git_history = await git.log({
        "--follow": null,
        format: { timestamp: "%at", hash: "%H", subject: "%s" },
        file: fname,
      });
    } catch (e) {
      return [];
    }
    git_history.all
      .filter((e) => !excludes.has(e.hash))
      .forEach((e) => {
        dates.push(parse_timestamp(e.timestamp));
      });
    if (dates.length > 0) {
      return dates;
    }

    // If there were no manually specified dates and _all_ of the
    // commits were excluded, find the oldest entry in the git history
    // and return it anyway.
    const oldest = git_history.all.reduce((prev, cur) =>
      cur.timestamp < prev.timestamp ? cur : prev
    );
    return [parse_timestamp(oldest.timestamp)];
  }

  function finish_edit_history(file, dates) {
    // Since we only want the minimum and maximum element, it is
    // asymptotically more efficient to scan the array for them,
    // rather than sorting it.  Also, I'm not sure if Array.sort
    // works on an array of DateTimes, since == for them is object
    // equality rather than timestamp equality.
    const cursor = { min: null, max: null };
    dates.forEach((d) => {
      const instant = d.toMillis();
      if (cursor.min === null || cursor.min.toMillis() > instant) {
        cursor.min = d;
      }
      if (cursor.max === null || cursor.max.toMillis() < instant) {
        cursor.max = d;
      }
    });

    if (cursor.min !== null) {
      file["creation_date"] = reconfigure_date(cursor.min);
      if (cursor.max !== null && cursor.max > cursor.min) {
        file["last_modification_date"] = reconfigure_date(cursor.max);
      }
    }
  }

  return function edit_history(tree, ms, done) {
    git_opts.baseDir = ms.source();
    const git = Git(git_opts);
    Promise.all(
      multimatch(Object.keys(tree), patterns, match_opts).map((fname) =>
        git_date_range(git, fname, tree[fname], exclude).then((dates) => {
          finish_edit_history(tree[fname], dates);
        })
      )
    ).then((..._ignored) => done());
  };
}
