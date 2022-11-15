const Metalsmith = require("metalsmith");
const layouts = require("@metalsmith/layouts");
const permalinks = require("@metalsmith/permalinks");
const MarkdownIt = require("metalsmith-markdownit");

const md_deflist = require("markdown-it-deflist");
const md_attrs = require("markdown-it-attrs");
const md_anchor = require("markdown-it-anchor");
const md_footnote = require("markdown-it-footnote");
const md_sub = require("markdown-it-sub");
const md_sup = require("markdown-it-sup");
const md_math = require("markdown-it-katex");

const hljs = require("highlight.js");

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
markdown.parser.use(md_deflist);
markdown.parser.use(md_attrs);
markdown.parser.use(md_anchor);
markdown.parser.use(md_footnote);
markdown.parser.use(md_sup);
markdown.parser.use(md_sub);
markdown.parser.use(md_math);

function debug_tree(tag) {
  return (ms) => {
    for (const k of Object.keys(ms).sort()) {
      console.log(tag, k);
    }
  };
}

Metalsmith(__dirname)
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
  .use(markdown)
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
  .build((err, _unused) => {
    if (err) throw err;
  });
