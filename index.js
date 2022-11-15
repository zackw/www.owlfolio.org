import Metalsmith from "metalsmith";
import default_values from "@metalsmith/default-values";
import layouts from "@metalsmith/layouts";
import permalinks from "@metalsmith/permalinks";
import markdown_it from "metalsmith-markdownit";
import metafiles from "metalsmith-metafiles";
import move_up from "metalsmith-move-up";

import hljs from "highlight.js";

import * as url from "url";

// function debug_tree(tag) {
//   return (ms) => {
//     for (const k of Object.keys(ms).sort()) {
//       console.log(tag, k);
//     }
//   };
// }

async function custom_markdown() {
  const markdown = markdown_it({
    typographer: true,
    html: true,
    highlight: (str, lang) => {
      if (lang) {
        const hlang = hljs.getLanguage(lang);
        if (hlang) {
          const canon_lang = hlang.name.toLowerCase();
          try {
            const highlighted = hljs.highlight(str, {
              language: lang,
            }).value;
            return `<pre class="hljs language-${canon_lang}"><code>${highlighted}</code></pre>`;
          } catch (_unused) {}
        }
      }
      // if we get here, either we don't have a language tag or it wasn't
      // recognized
      const highlighted = markdown.parser.utils.escapeHtml(str);
      return `<pre class="hljs language-none"><code>${highlighted}</code></pre>`;
    },
  });

  const parser_extensions = [
    "anchor",
    "attrs",
    "deflist",
    "footnote",
    "katex",
    "sub",
    "sup",
  ];
  const parser_mods = await Promise.all(
    parser_extensions.map((mdx) => import(`markdown-it-${mdx}`))
  );
  parser_mods.map((mod) => markdown.parser.use(mod.default));

  return markdown;
}

/// Mini-plugin that looks for a file property PROP, and if it's found,
/// changes the name of that file to the value of the property
function rename_to_prop(prop) {
  return (files, _unused, done) => {
    Object.keys(files).forEach((file) => {
      const blob = files[file];
      if (Object.hasOwn(blob, prop)) {
        const renamed = blob[prop];
        if (Object.hasOwn(files, renamed)) {
          throw new Error(`collision: ${file} -> ${renamed} already present`);
        }
        files[renamed] = blob;
        delete files[file];
      }
    });
    done();
  };
}

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
    .use(
      metafiles({
        postfix: ".m",
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
    .use(move_up(["pages/**", "posts/**"]))
    .use(rename_to_prop("save_as"))
    .build();
}
main().then(() => {});

// Local Variables:
// js2-additional-externs: ("URL")
// End:
