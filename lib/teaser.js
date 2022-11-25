/** teaser.js: extract the first few paragraphs of an article for use as
 *  a teaser in a listing of articles, RSS feed, etc.
 *
 * Based on metalsmith-more <https://github.com/kfranqueiro/metalsmith-more/>
 * with modifications for my particular needs.
 *
 * Copyright (c) 2014 Kenneth G. Franqueiro.
 * Copyright (c) 2022 Zack Weinberg.
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use, copy,
 * modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
 * ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import multimatch from "multimatch";
import { Buffer } from "node:buffer";

/**
 * Metalsmith pipeline plugin: For each file F whose name matches the
 * PATTERN, scan its contents for REGEX.  If found, set F[TEASER_KEY]
 * to the prefix of the contents, ending just before the first match,
 * and set F[CONTINUED_KEY] to true.  Otherwise, set F[TEASER_KEY] to
 * a _copy_ of the entire contents and set F[CONTINUED_KEY] to false.
 * MATCH_OPTS are passed to multimatch().
 *
 * Note that this is a pure string munging operation.  If the REGEX
 * matches in the middle of some HTML structure, the teaser will end
 * without closing that structure.
 */
export default function teaser_factory(options = {}) {
  const {
    pattern: pattern_raw = "**/*.html",
    match_opts = {},
    regex: regex_raw = /\s*<!--\s*more\s*-->/u,
    teaser_key = "teaser",
    continued_key = "continued",
    ...rest
  } = options;

  if (Object.keys(rest).length > 0) {
    throw new Error(`unrecognized options: ${Object.keys(rest)}`);
  }

  const pattern = Array.isArray(pattern_raw) ? pattern_raw : [pattern_raw];
  const regex =
    Symbol.match in regex_raw ? regex_raw : new RegExp(regex_raw, "u");

  return function teaser(files, _unused, done) {
    for (const fname of multimatch(Object.keys(files), pattern, match_opts)) {
      const file = files[fname];
      if (!file.contents) {
        file[teaser_key] = Buffer.alloc(0);
        file[continued_key] = false;
        continue;
      }

      const contents = file.contents.toString();
      const index = contents.search(regex);
      if (index === -1) {
        file[teaser_key] = Buffer.from(file.contents);
        file[continued_key] = false;
        continue;
      }

      file[teaser_key] = Buffer.from(contents.slice(0, index));
      file[continued_key] = true;
      file.contents = Buffer.from(contents.replace(regex, ""));
    }
    done();
  };
}
