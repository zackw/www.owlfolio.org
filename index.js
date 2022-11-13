const Metalsmith = require("metalsmith");
const layouts = require("@metalsmith/layouts");
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
    highlight: function(str, lang) {
        if (!lang) return '';

        const hlang = hljs.getLanguage(lang);
        if (!hlang) return '';

        let highlighted;
        try {
            highlighted = hljs.highlight(str, {
                language: lang,
            }).value;
        } catch (err) {
            console.log(`highlight: failed,`, err);
            return '';
        }

        return `<pre class="hljs language-${hlang.name.toLowerCase()}"><code>`
            + highlighted
            + '</code></pre>';
    },
});
markdown.parser.use(md_deflist);
markdown.parser.use(md_attrs);
markdown.parser.use(md_anchor);
markdown.parser.use(md_footnote);
markdown.parser.use(md_sup);
markdown.parser.use(md_sub);
markdown.parser.use(md_math);

Metalsmith(__dirname)
    .source('src')
    .destination('build')
    .ignore('comments') // for now
    .ignore('meta') // for now
    .use(markdown)
    .use(layouts({
        default: 'default.hbs'
    }))
    .build(function (err, files) { if (err) throw err; });
