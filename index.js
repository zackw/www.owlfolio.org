import Metalsmith from "metalsmith";
import default_values from "@metalsmith/default-values";
import layouts from "@metalsmith/layouts";
import permalinks from "@metalsmith/permalinks";

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
  await Metalsmith(source_root)
    .metadata({
      SITENAME: "Owl’s Portfolio",
      AUTHOR: "Zack Weinberg",
      TIMEZONE: "America/New_York",
      DEFAULT_LANG: "en",
      DEFAULT_PAGINATION: 10,
    })
    .source("src")
    .destination("build")
    .ignore("comments") // until we have something better to do with them
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
      rename_patterns([
        { file: "meta/htaccess", to: ".htaccess" },
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
// js2-additional-externs: ("URL")
// End:
