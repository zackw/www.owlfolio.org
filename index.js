import Metalsmith from "metalsmith";
import collections from "@metalsmith/collections";
import layouts from "@metalsmith/layouts";
import metadata from "@metalsmith/metadata";
import permalinks from "@metalsmith/permalinks";

import * as url from "url";

import {
  custom_markdown,
  default_values_from_path,
  rename_patterns,
} from "./lib/local-plugins.js";

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
    const d = a["date"];
    const e = b["date"];
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
      default_values_from_path([
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
      layouts({
        engineOptions: {},
      })
    )
    .use(postprocess({ indent_size: 2, indent_char: " " }));

  await ms.build();
}
await main();

// Local Variables:
// js2-additional-externs: ("URL" "process")
// End:
