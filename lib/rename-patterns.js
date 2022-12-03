/** Rename files that match patterns.
 *
 * Copyright (c) 2022 Zack Weinberg
 *
 * This plugin is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.  See the file GPL-3 at the top
 * level of the source distribution for further details, or refer to
 * <http://www.gnu.org/licenses/#GPL>.
 */

import micromatch from "micromatch";

function ensure_array(val) {
  return Array.isArray(val) ? val : [val];
}

/// Rename files that match patterns.
/// Patterns are specified as an array of objects like this:
/// {
///   files: ['micromatch', 'patterns'],
///   match_opts: { ... micromatch options if desired ... },
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
export default function rename_factory(patterns_raw) {
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
      const matched = micromatch(files, this.files, this.match_opts);
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

  return function rename_patterns(tree, _unused, done) {
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
