/** Metalsmith build driver.
 *
 * Copyright (c) 2022 Zack Weinberg
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.  See the file GPL-3 at the top
 * level of the source distribution for further details, or refer to
 * <http://www.gnu.org/licenses/#GPL>.
 */

import Metalsmith from "metalsmith";
import collections from "@metalsmith/collections";
import metadata from "@metalsmith/metadata";
import pagination from "metalsmith-pagination";
import permalinks from "@metalsmith/permalinks";

import * as url from "url";

import { custom_markdown, custom_nunjucks } from "./lib/rendering.js";
import defaults_from_path from "./lib/defaults-from-path.js";
import edit_history from "./lib/edit-history.js";
import rename_patterns from "./lib/rename-patterns.js";
import teasers from "./lib/teaser.js";

// Several plugins, late in the pipeline, are only wanted in either
// development mode or production mode, not both.
async function use_postprocess_plugins(ms, development) {
  if (development) {
    ms.use(
      (await import("metalsmith-beautify")).default({
        indent_size: 2,
        indent_char: " ",
      })
    );
  } else {
    // TODO sitemap, RSS, minification
  }
}

async function main() {
  const source_root = url.fileURLToPath(new URL(".", import.meta.url));
  const mode = process.env.NODE_ENV || "development";
  const ms = Metalsmith(source_root);

  let is_development;
  switch (mode) {
    case "development":
      is_development = true;
      (await import("metalsmith-debug-ui")).patch(ms);
      break;

    case "production":
      is_development = false;
      break;

    default:
      throw new Error(`invalid setting for NODE_ENV: ${mode}`);
  }

  // The collections plugin doesn't let you specify settings for _all_
  // collections defined by file metadata in its constructor arguments;
  // you have to name them each individually (and repeat yourself) or
  // else tinker with its defaults, thus.  Furthermore, you cannot specify
  // a property to sort by; you have to write your own comparison function
  // and you can't get at the internal "sort by this field" helper.
  collections.defaults.reverse = true;
  collections.defaults.refer = false;
  collections.defaults.filterBy = (file) => file.layout === "post.njk";
  collections.defaults.sortBy = (a, b) => {
    const d = a["creation_date"];
    const e = b["creation_date"];
    if (!d && !e) return 0;
    if (!d) return -1;
    if (!e) return 1;
    if (e > d) return -1;
    if (d > e) return 1;
    return 0;
  };

  ms.metadata({
    sitename: "Owl’s Portfolio",
  })
    .source("src")
    .destination("build")
    .ignore([
      "**/.#*", // emacs detritus
      "**/#*#",
      "**/*~",
      "**/.*.sw[a-p]", // vim detritus
      "comments", // until we have something better to do with them
    ])
    .use(
      metadata({
        out_links: "src/meta/outlinks.yaml",
      })
    )
    .use(
      edit_history({
        patterns: ["posts/*/*.{html,md}", "!posts/*/index.{html,md}"],
        exclude: [
          // These are all the commits that touched files in posts/ to
          // make changes that don't, or only trivially, affect content.
          "066205e57f4b9abbcc447a35268a32d4a2027c3f",
          "116522beda01270146e68822dc17388c14a35498",
          "1495b48d3d152a4081385a6c5bef475d5a451dd1",
          "19547448b1fae06e1a43b2660a4fb6b5fb22acfe",
          "3cad6bb3b378f1a122632bb2cfa39cb96cdacaec",
          "690d3f1f15ef50c5bf3bc1e8a4bf7239f8d259db",
          "6aed9536008603405f57b4d979002ea0a1742751",
          "6e8860a469ac1f0abc69da46ca19182f3ed3700a",
          "811a6f0e9109d359fb5ca524cfce0269366ae187",
          "873d2d676b1467dfb2575752ba5b4edb218aa1e2",
          "93d8a565a459d55549048f7a0d1b3d328a774069",
          "b0d27ac3b8553a6f7d92367a53c5deadd24d7cc2",
          "bbd8a0a65c674015006f86e995a82a3eb24335b6",
          "bc97ff6de477d2f19f30e183004057cdbadf592b",
          "cf74c9a57bec2cb69dc8b5fdaa72a263bcb13e61",
          "d492493a2937d434332c61410650064ebdb7fb99",
          "d915b45880fe6c3199114b0ce1a8335773cb630f",
          "dba4f7e3abfb3373c3b06730965ec1128109923f",
          "ea3fd9fabb19afece0b04b2772fba0a20cbb2cf8",
          "ec5628aa86b17de5ec1d0d53e5d5b7f8e58bf0b2",
          "f26985732d4b7af44dccdfd167bce030d4c779fd",
          "f355fbb6d5e8490f470b61163590ec964297d142",
          "f8e48eadeae1de531a8b30e2ab62048a35fc10ea",
          "ff8cb06f05683a2a07e654ccb30fb0ebd7f76e3f",
        ],
        date_opts: { zone: "America/New_York" },
      })
    )
    .use(
      defaults_from_path([
        {
          pattern: "posts/*/*.{html,md}",
          defaults: (_unused1, path, _unused2) => {
            const [, category, post] = path.match(
              /^posts\/([^/]+)\/([^/]+)\.(?:html|md)$/u
            );
            if (post === "index") {
              return {
                collection: category,
                layout: "category.njk",
                permalink: false,
              };
            } else {
              return {
                collection: category,
                layout: "post.njk",
              };
            }
          },
        },
        {
          pattern: "pages/*.{html,md}",
          defaults: { layout: "page.njk" },
        },
      ])
    )
    .use(
      collections({
        posts: {
          pattern: "posts/*/*.{html,md}",
          refer: true,
        },
        pages: {
          pattern: "pages/*.md",
          filterBy: (file) => !Object.hasOwn(file, "save_as"),
        },
      })
    )
    .use(await custom_markdown())
    .use(
      teasers({
        pattern: ["posts/*/*.html", "!posts/*/index.html"],
        teaser_key: "excerpt",
      })
    )
    .use(
      permalinks({
        duplicatesFail: true,
        relative: false,
      })
    )
    .use(
      rename_patterns([
        { file: "meta/htaccess", to: ".htaccess" },
        { file: "meta/cc-by-nc-4-80x15.png", to: "s/cc-by-nc-4-80x15.png" },
        { file: "pages/404/index.html", to: "s/404.html" },
        {
          file: ["meta/**", "pages/**", "posts/**"],
          from: /^[^/]+\//u,
          to: "",
        },
      ])
    )
    .use(
      pagination({
        "collections.posts": {
          perPage: 10,
          layout: "archive.njk",
          first: "index.html",
          noPageOne: true,
          path: ":num/index.html",
        },
      })
    )
    .use(custom_nunjucks());

  await use_postprocess_plugins(ms, is_development);
  await ms.build();
}
await main();

// Local Variables:
// js2-additional-externs: ("URL" "process")
// End:
