/** Set default metadata values for files, with pathname information available.
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

/** Metalsmith pipeline plugin: Set default metadata values for files.
 *
 * This plugin takes one argument, which is either a "default value
 * specification" or an array of such specifications.  Each default
 * value specification is an object with up to three keys:
 *
 *     {
 *       pattern: ["globs", "matching", "files", "to", "manipulate"],
 *       match_opts: { ... micromatch options if desired ... },
 *       defaults: { key1: "value", key2: "value" }
 *     },
 *
 * MATCH_OPTS may be omitted, which is the same as specifying an empty
 * object (i.e. use all of micromatch's defaults).
 *
 * PATTERN may be omitted, which is the same as specifying ["**"]
 * (i.e. apply the defaults to every file in metalsmith's tree).
 * PATTERN may also be a single string, which is the same as specifying
 * an array whose sole element is that string.
 *
 * DEFAULTS is mandatory.  If it is an object, it is interpreted as a
 * set of key-value pairs; each pair is added to the file metadata of
 * each file that matches PATTERN, _unless_ that key is already present
 * (the values need not, and usually won't, match -- this is why we say
 * this plugin sets _default_ metadata values).
 *
 * DEFAULTS may also be a function, which will be called for each file
 * that matches PATTERN, and will receive three arguments: the file's
 * metadata dictionary, the file's pathname, and the global Metalsmith
 * object, in that order.  It should return a set of key-value pairs to
 * be added to the file metadata, as described above.  It may also
 * manipulate the file metadata dictionary itself; in this case it should
 * return nothing.
 *
 *  The key differences between this plugin and @metalsmith/default-values
 *  are in how callback functions are used:
 *   - You pass *one* callback function as 'defaults' and it returns
 *     an entire defaults dictionary.
 *   - The callback function has access to the file's path and the
 *     Metalsmith object, not just to the file's metadata.
 *
 *  Note that matching is nonexclusive -- if more than one of an array of
 *  pattern specs matches a file, _all_ of their defaults will be
 *  applied.
 */
export default function defaults_factory(specs_raw) {
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
      return micromatch(files, this.pattern, this.match_opts);
    }

    add_defaults(file, path, ms) {
      const dfs = this.get_defaults(file, path, ms);
      switch (typeof dfs) {
        case "undefined":
          return;
        case "object":
          if (dfs !== null) {
            for (const [k, v] of Object.entries(dfs)) {
              if (!Object.hasOwn(file, k)) file[k] = v;
            }
            return;
          }
        // else fall through
        default:
          throw new Error(`get_defaults returned unusable value: ${dfs}`);
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
