/** Generate a sitemap based on the category structure of the site.
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

import { Readable } from "node:stream";
import { SitemapStream, streamToPromise } from "sitemap";
import { DateTime } from "luxon";
import micromatch from "micromatch";

function ensure_array(val) {
  return Array.isArray(val) ? val : [val];
}

function sp_lastmod(data, _unused_ms, lmProps) {
  for (const lmProp of lmProps) {
    if (Object.hasOwn(data, lmProp)) {
      const lmd = data[lmProp];
      let ts;
      if (lmd.toISO) {
        ts = lmd.toISO();
      } else if (lmd.toISOString) {
        ts = lmd.toISOString();
      } else if (typeof lmd === "string") {
        ts = DateTime.fromISO(lmd, { zone: "utc" }).toISO();
      }
      if (!ts) {
        throw new Error(`failed to convert ${lmd} to an ISO timestamp string`);
      }
      return ts;
    }
  }
  return undefined;
}

function ip_lastmod(data, ms, lmProps) {
  const md = ms.metadata();
  const indexed = Object.hasOwn(data, "pagination")
    ? data.pagination.files
    : md.collections[data.collection[0]];

  let lmd = DateTime.fromSeconds(0, { zone: "utc" });
  for (const post of indexed) {
    for (const lmProp of lmProps) {
      if (Object.hasOwn(post, lmProp)) {
        let pmd = post[lmProp];
        if (pmd instanceof DateTime) {
          // usable as is
        } else if (pmd instanceof Date) {
          pmd = DateTime.fromJSDate(pmd, { zone: "utc" });
        } else if (typeof pmd === "string") {
          pmd = DateTime.fromISO(pmd, { zone: "utc" });
        } else {
          throw new Error(`don't understand ${lmProp}=${pmd}`);
        }
        if (!pmd.isValid) {
          throw new Error(`invalid ${lmProp}=${pmd.toString()}`);
        }
        if (pmd > lmd) {
          lmd = pmd;
        }
      }
    }
  }
  return lmd.toUnixInteger() === 0 ? undefined : lmd;
}

/** Metalsmith pipeline plugin: Construct a sitemap with page priorities
 *  and change frequencies derived from the category structure of the site.
 *
 *  Options passed to constructor:
 *    include:    Files to include in the sitemap; a micromatch glob
 *                  or array of globs. Default is ['**.html', '**.pdf']
 *    match_opts: Micromatch match options.  Default is none.
 *    is_index:   Predicate function, called with two arguments
 *                (filename, filedata), returns true if the file is an
 *                index page of some variety.  Index pages get a lower
 *                priority and a higher changefreq.
 *    lastmod:    Name of a file metadata property, or array of
 *                properties to try in order of priority, which
 *                specifies the last modification date of that file.
 *                Default is "lastModified".  The value of this
 *                property should be one of: a string which already
 *                parses as a W3C datetime (see
 *                https://www.w3.org/TR/NOTE-datetime), or a
 *                JavaScript Date object, or any object with a
 *                .toISO() method.  In the latter case this method is
 *                assumed to return a valid W3C datetime.
 *    changefreq: Name of a file metadata property which specifies the
 *                expected change frequency of that file.  Default is
 *                "changeFrequency".  If the property is absent,
 *                absent, the change frequency will be 'yearly' for
 *                posts and 'weekly' for index pages.
 *
 *  Expects to find an 'origin' property in the *site* metadata
 *  which gives a URL prefix for the site, e.g. 'https://.
 */
export default function sitemap_factory(options = {}) {
  const {
    include: include_raw = ["**/*.html", "**/*.pdf"],
    match_opts = {},
    is_index = () => false,
    lastmod: lmProps_raw = ["lastModified"],
    changefreq = "changeFrequency",
    ...rest
  } = options;
  if (Object.keys(rest).length > 0) {
    throw new Error(`unrecognized options: ${Object.keys(rest)}`);
  }
  const include = ensure_array(include_raw);
  const lmProps = ensure_array(lmProps_raw);

  return function sitemap(files, ms, done) {
    const origin = ms.metadata().origin;
    if (
      typeof origin !== "string" ||
      (!origin.startsWith("http://") &&
        !origin.startsWith("https://") &&
        !origin.startsWith("file:///"))
    ) {
      throw new Error(`missing or invalid origin metadata - ${origin}`);
    }
    const entries = micromatch(Object.keys(files), include, match_opts);
    if (entries.length > 10000) {
      throw new Error(
        `Too many entries (${entries.length}) (sitemap pagination not implemented)`
      );
    }

    const ss = new SitemapStream({ hostname: origin, xmlns: {} });
    Readable.from(
      entries.map((fname) => {
        const data = files[fname];
        // Is this an index page of some variety?
        const isIndex = is_index(fname, data);

        // Build up the entry in this object.
        const entry = {
          priority: isIndex ? 0.1 : 0.5,
          lastmod: (isIndex ? ip_lastmod : sp_lastmod)(data, ms, lmProps),
        };

        if (Object.hasOwn(data, changefreq)) {
          entry.changefreq = data[changefreq];
        } else {
          entry.changefreq = isIndex ? "weekly" : "yearly";
        }

        if (Object.hasOwn(data, "path") && data.path !== fname) {
          entry.url = `/${data.path}/`.replace(/\/{2,}/gu, "/");
        } else {
          entry.url = `/${fname}`.replace(/\/{2,}/gu, "/");
        }
        return entry;
      })
    ).pipe(ss);
    streamToPromise(ss).then((buffer) => {
      files["sitemap.xml"] = {
        contents: buffer,
      };
      done();
    });
  };
}
