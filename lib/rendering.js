/** Local configuration for Markdown and page template rendering.
 *
 * Copyright (c) 2022 Zack Weinberg
 *
 * This code is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.  See the file GPL-3 at the top
 * level of the source distribution for further details, or refer to
 * <http://www.gnu.org/licenses/#GPL>.
 */

import hljs from "highlight.js";
import katex from "katex";
import base_layouts from "@metalsmith/layouts";
import markdown_it from "metalsmith-markdownit";

import * as util from "node:util";

/// Wrap metalsmith-markdownit, applying all of our desired
/// configuration and loading parser extensions.  Needs to be
/// used via `metalsmith.use(await custom_markdown()` because
/// runtime imports are an async operation.
export async function custom_markdown() {
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
          } catch (_unused) {
            // discard exception and take fallback path
          }
        }
      }
      // if we get here, either we don't have a language tag or it wasn't
      // recognized
      const highlighted = markdown.parser.utils.escapeHtml(str);
      return `<pre class="hljs language-none"><code>${highlighted}</code></pre>`;
    },
  });

  const dollarmath = (await import("markdown-it-dollarmath")).default;
  markdown.parser.use(dollarmath, {
    allow_space: true,
    allow_digits: false,
    double_inline: false,
    allow_labels: true,
    renderer(content, { displayMode }) {
      return katex.renderToString(content, {
        displayMode,
        throwOnError: false,
      });
    },
  });

  const parser_extensions = [
    "anchor",
    "attrs",
    "deflist",
    "footnote",
    "sub",
    "sup",
  ];
  const parser_mods = await Promise.all(
    parser_extensions.map((mdx) => import(`markdown-it-${mdx}`))
  );
  parser_mods.map((mod) => markdown.parser.use(mod.default));

  // As of metalsmith-markdownit 0.5.0, the name of the function
  // object we're about to return is "plugin."  Change that to
  // "markdown", to make the list of pipeline stages in the debug
  // UI less confusing.
  Object.defineProperty(markdown, "name", { value: "markdown" });

  return markdown;
}

/// Wrap @metalsmith/layouts, adding various useful things to the
/// template environment.  Note that, although Nunjucks is never
/// mentioned by name here, this code does assume that that's the
/// template engine in use.
export function custom_nunjucks() {
  // Some of the layout hooks need access to the 'files' pipeline
  // argument.  The base 'layouts' plugin doesn't give us any convenient
  // way to access that, so we wrap its pipeline function in our own
  // function that captures the arguments for us.
  let files;

  function filter_inspect(obj, ...opts) {
    return util.inspect(obj, ...opts);
  }

  function filter_describe_collections(obj) {
    // obj should be an object whose keys are the category slugs.
    // Weed out the unwanted 'pages' and 'posts' categories,
    // then convert the list of slugs into a list of [slug, title]
    // pairs, sort that list by title, and return it.
    return Object.keys(obj)
      .filter((slug) => slug !== "pages" && slug !== "posts")
      .map((slug) => [slug, files[`${slug}/index.html`].title])
      .sort((a, b) => (a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0));
  }

  function filter_canon_path(path) {
    // Produce the canonical form of a site-relative path.
    // This is only ever used with page slugs, so we can assume
    // it's supposed to start and end with a slash and shouldn't
    // have a trailing "index.html".
    if (typeof path !== "string")
      return `/bogus_argument_to_canon_path/${util.inspect(path, {
        compact: true,
        breakLength: Infinity,
      })}`;
    return path
      .replace(/^\/?(.*?)\/?(?:index.html)?$/u, "/$1/")
      .replace(/\/{2,}/gu, "/");
  }

  const base_layout_fn = base_layouts({
    engineOptions: {
      filters: {
        canon_path: filter_canon_path,
        describe_collections: filter_describe_collections,
        inspect: filter_inspect,
      },
    },
  });
  return function layouts(_files, _metalsmith, _done) {
    files = _files;
    return base_layout_fn(_files, _metalsmith, _done);
  };
}
