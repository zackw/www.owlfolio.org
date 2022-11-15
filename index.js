import Metalsmith from "metalsmith";
import default_values from "@metalsmith/default-values";
import layouts from "@metalsmith/layouts";
import metadata from "@metalsmith/metadata";
import permalinks from "@metalsmith/permalinks";

import beautify from "metalsmith-beautify";
import cond from "metalsmith-if";

import * as url from "url";
import { custom_markdown, rename_patterns } from "./lib/local-plugins.js";

// function debug_tree(tag) {
//   return (ms) => {
//     for (const k of Object.keys(ms).sort()) {
//       console.log(tag, k);
//     }
//   };
// }

async function main() {
  const source_root = url.fileURLToPath(new URL(".", import.meta.url));
  const mode = process.env.NODE_ENV || "development";
  await Metalsmith(source_root)
    .metadata({
      sitename: "Owl’s Portfolio",
    })
    .source("src")
    .destination("build")
    .ignore([
      ".#*", // emacs detritus
      "#*#",
      "*~",
      ".*.sw[a-p]", // vim detritus
      "comments", // until we have something better to do with them
    ])
    .use(
      metadata({
        out_links: "src/meta/outlinks.yaml",
      })
    )
    .use(await custom_markdown())
    .use(
      permalinks({
        duplicatesFail: true,
        // unique: true,
        relative: false,
      })
    )
    .use(
      default_values([
        {
          pattern: "pages/**/index.html",
          defaults: { layout: "page.njk" },
        },
        {
          pattern: "posts/**/index.html",
          defaults: { layout: "post.njk" },
        },
      ])
    )
    .use(layouts())
    .use(
      cond(
        mode === "development",
        beautify({ indent_size: 2, indent_char: " " })
      )
    )
    .use(
      rename_patterns([
        { file: "meta/htaccess", to: ".htaccess" },
        { file: "meta/cc-by-nc-4-80x15.png", to: "s/cc-by-nc-4-80x15.png" },
        { file: "pages/404/index.html", to: "s/404.html" },
        {
          file: ["meta/**", "pages/**", "posts/**"],
          from: /^[^/]+\//,
          to: "",
        },
      ])
    )
    .build();
}
main().then(() => {});

// Local Variables:
// js2-additional-externs: ("URL", "process")
// End:
