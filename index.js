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

function hljs_or_escape(str, lang) {
    if (lang) {
        const hlang = hljs.getLanguage(lang);
        if (hlang) {
            const canon_lang = hlang.name.toLowerCase();
            try {
                const highlighted = hljs.highlight(str, {
                    language: lang,
                }).value;
                return `<pre class="hljs language-${canon_lang}"><code>`
                    + highlighted
                    + '</code></pre>';
            } catch (__) {
            }
        }
    }
    // if we get here, either we don't have a language tag or it wasn't
    // recognized

    return '<pre class="hljs language-none"><code>'
        + markdown.parser.utils.escapeHtml(str)
        + '</code></pre>';
}


const markdown = MarkdownIt({
    typographer: true,
    html: true,
    highlight: hljs_or_escape,
});
markdown.parser.use(md_deflist);
markdown.parser.use(md_attrs);
markdown.parser.use(md_anchor);
markdown.parser.use(md_footnote);
markdown.parser.use(md_sup);
markdown.parser.use(md_sub);
markdown.parser.use(md_math);

function debug_tree(tag) {
    return function (ms) {
        for (let k of Object.keys(ms).sort()) {
            console.log(tag, k);
        }
    };
}

Metalsmith(__dirname)
    .metadata({
        SITENAME: "Owl’s Portfolio",
        AUTHOR: 'Zack Weinberg',
        TIMEZONE: 'America/New_York',
        DEFAULT_LANG: 'en',
        DEFAULT_PAGINATION: 10,
    })
    .source('src')
    .destination('build')
    .ignore('comments') // for now
    .ignore('meta') // for now
    .use(markdown)
    .use(debug_tree("before_permalinks:"))
    .use(permalinks({
        duplicatesFail: true,
        //unique: true,
        relative: false,
    }))
    .use(debug_tree("after_permalinks:"))
    .use(layouts({
        pattern: 'pages/**/index.html',
        default: 'page.njk',
    }))
    .use(layouts({
        pattern: 'posts/**/index.html',
        default: 'post.njk',
    }))
    .build(function (err, files) { if (err) throw err; });
