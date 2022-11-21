import Metalsmith from "metalsmith";
import default_values from "@metalsmith/default-values";
import layouts from "@metalsmith/layouts";
import metadata from "@metalsmith/metadata";
import permalinks from "@metalsmith/permalinks";

import collections from "metalsmith-auto-collections";

import * as url from "url";
import { custom_markdown, rename_patterns } from "./lib/local-plugins.js";

async function main() {
  const source_root = url.fileURLToPath(new URL(".", import.meta.url));
  const mode = process.env.NODE_ENV || "development";
  const ms = Metalsmith(source_root);

  let postprocess;
  switch (mode) {
    case "development":
      postprocess = (await import("metalsmith-beautify")).default;
      (await import("metalsmith-debug-ui")).patch(ms);
      break;

    case "production":
      postprocess = (..._ignored) =>
        function postprocess_noop(_unused1, _unused2, done) {
          done();
        };
      break;

    default:
      throw new Error(`invalid setting for NODE_ENV: ${mode}`);
  }

  ms.metadata({
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
    .use(
      collections({
        pattern: ["posts/*/*.md", "posts/*/*.html"],
        settings: {
          sortBy: "date",
          reverse: true,
        },
      })
    )
    .use(await custom_markdown())
    .use(
      permalinks({
        duplicatesFail: true,
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
    .use(layouts())
    .use(postprocess({ indent_size: 2, indent_char: " " }));

  await ms.build();
}
await main();

// Local Variables:
// js2-additional-externs: ("URL" "process")
// End:
