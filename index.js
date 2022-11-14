import Metalsmith from "metalsmith";
import layouts from "@metalsmith/layouts";
import permalinks from "@metalsmith/permalinks";
import MarkdownIt from "metalsmith-markdownit";

import hljs from "highlight.js";

import * as url from "url";

const source_root = url.fileURLToPath(new URL(".", import.meta.url));

// function debug_tree(tag) {
//  return (ms) => {
//    for (const k of Object.keys(ms).sort()) {
//      console.log(tag, k);
//    }
//  };
// }

async function custom_markdown() {
  const markdown = MarkdownIt({
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

async function main() {
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
    .ignore("comments") // for now
    .ignore("meta") // for now
    .use(await custom_markdown())
    .use(
      permalinks({
        duplicatesFail: true,
        // unique: true,
        relative: false,
      })
    )
    .use(
      layouts({
        pattern: "pages/**/index.html",
        default: "page.njk",
      })
    )
    .use(
      layouts({
        pattern: "posts/**/index.html",
        default: "post.njk",
      })
    )
    .build();
}
main().then(() => {});

// Local Variables:
// js2-additional-externs: ("URL")
// End:
