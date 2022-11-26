/** Annotate files with creation and last modification dates from git history.
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

import multimatch from "multimatch";
import { DateTime } from "luxon";
import { simpleGit as Git } from "simple-git";

function ensure_array(val) {
  return Array.isArray(val) ? val : [val];
}

/** Metalsmith pipeline plugin: Annotate files with creation and last
 *  modification dates.
 *
 * For each file selected by the 'patterns', scan its Git history.
 * Commits whose hash is in the 'exclude' list are discarded
 * (we use set containment, so this must be the _complete_ hash).
 * The "author date" of all surviving commits is put in a list.
 *
 * Then, we attempt to parse any existing file metadata items named
 * 'date', 'created', 'published', or 'modified'; you can add to this
 * list with the 'date_keys' option.  (Any syntax accepted by the
 * Luxon fromISO, fromSQL, fromRFC2822, or fromHTTP constructors, in
 * that order, may be used.)  Any successfully parsed items are added
 * to the list.  Finally, the oldest entry in the list is stored
 * under the 'creation_date' metadata key as a Luxon DateTime object.
 * If there is more than one entry in the list, then the _newest_
 * entry in the list is stored under the 'last_modification_date'
 * metadata key, also as a Luxon DateTime object.
 *
 * You can supply constructor options for simple-git under the
 * 'git_opts' key, and multimatch options under the 'match_opts' key.
 * You can specify options for Luxon's string timestamp parser under
 * the 'date_parse_opts' key: the default is { zone: 'utc' },
 * i.e. timestamps with no time zone information are to be
 * interpreted as UTC.  (Timestamps extracted from Git history are
 * always interpreted as UTC, since what it gives us is
 * seconds-since-epoch.)  Finally, 'date_opts' specifies time zone,
 * locale, etc that _every_ timestamp will be _converted_ to before
 * adding them to the file metadata.
 */
export default function edit_history_factory(options_raw) {
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
