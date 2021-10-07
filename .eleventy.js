const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginRss = require("@11ty/eleventy-plugin-rss");

const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const pluginTOC = require('eleventy-plugin-toc');
const posthtml = require('posthtml');
const urls = require('posthtml-urls');
const {urlJoin} = require('@parcel/utils');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight, {
    templateFormats: ["*"],
    alwaysWrapLineHighlights: false,
  });

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addPlugin(pluginTOC);

  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.setTemplateFormats(["md", "njk", "css", "png", "svg", "mp4", "jpg"]);
  eleventyConfig.addWatchTarget("./api/");

  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
  });

  let md = markdownIt({
    html: true,
  }).use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.linkAfterHeader({
      style: 'aria-labelledby'
    }),
    tabIndex: false
  });

  md.renderer.rules.table_open = () => '<div class="table-wrapper"><table>';
  md.renderer.rules.table_close = () => '</table></div>'

  eleventyConfig.setLibrary("md", md);

  // ---------- Macros ----------

  eleventyConfig.addFilter("sortDate", function (data) {
    return [...data].sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addFilter("pageUrl", function (page) {
    return page.url;
  });

  eleventyConfig.addFilter("toISODate", function (date) {
    return date.toISOString().replace(/T.*/, "");
  });

  eleventyConfig.addFilter("headingID", function (tag) {
    return tag.toLowerCase().replace(/[^a-z]/gi, '') + '-heading';
  });

  eleventyConfig.addPairedShortcode("note", function (content) {
    return `<figure class="well"><div>${content}</div></figure>`;
  });
  eleventyConfig.addPairedShortcode("warning", function (content) {
    return `<figure class="well warning"><div>${content}</div></figure>`;
  });
  eleventyConfig.addPairedShortcode("error", function (content) {
    return `<figure class="well error"><div>${content}</div></figure>`;
  });

  eleventyConfig.addPairedShortcode("sample", function (content, cmd, mode) {
    let data = content
      .split("\n")
      .filter(Boolean)
      .map((s) => JSON.parse(s));
    return (
      `<figure class="well sample ${
        mode === "column" ? "column" : "row"
      }">\n\n` +
      (cmd ? `<div class="cmd"><code>${cmd}</code></div>` : "") +
      `<div class="assets">\n` +
      `${data
        .map(
          ({ name, content }) =>
            `<div class="asset">` +
            (name ? `<em>${name}:</em>` : '') +
            content +
            `</div>`
        )
        .join("\n")}\n` +
      `</div>\n` +
      `</figure>`
    );
  });
  eleventyConfig.addPairedShortcode("samplefile", function (content, name) {
    return JSON.stringify({ name, content });
  });

  eleventyConfig.addPairedShortcode("migration", function (content) {
    let assets = content
      .split("\n")
      .filter(Boolean)
      .map((s) => JSON.parse(s));

    if (assets.length === 1) assets.splice(0, 0, null);

    return (
      `<figure class="well warning migration">\n\n` +
      `<div class="assets">\n` +
      assets
        .map((a) =>
          a
            ? `<div class="asset">` +
              (a.name ? `<em>${a.name}</em>:` : "") +
              a.content +
              `</div>`
            : ""
        )
        .join(`<div class='arrow'></div>\n`) +
      `</div>\n` +
      `</figure>`
    );
  });

  eleventyConfig.addFilter('excerpt', function(content) {
    let excerpt = null;
  
    // The start and end separators to try and match to extract the excerpt
    const separatorsList = [
      { start: '<!-- Excerpt Start -->', end: '<!-- Excerpt End -->' },
      { start: '<p>', end: '</p>' }
    ];
  
    separatorsList.some(separators => {
      const startPosition = content.indexOf(separators.start);
      const endPosition = content.indexOf(separators.end);
  
      if (startPosition !== -1 && endPosition !== -1) {
        excerpt = content.substring(startPosition + separators.start.length, endPosition).trim();
        return true; // Exit out of array loop on first match
      }
    });
  
    return excerpt;
  });

  eleventyConfig.addNunjucksAsyncFilter('feedHTML', function (content, base, callback) {
    posthtml()
      .use(urls({
        eachURL(url, attr, element) {
          if (/^https?:/.test(url)) {
            return url;
          }
          // Generate absolute urls for <a> tags - Parcel doesn't rename them anyway.
          // Otherwise, prepend the base URL so we get an absolute path.
          let baseUrl = element === 'a' ? 'https://parceljs.org' + base : base;
          return urlJoin(baseUrl, url);
        }
      }))
      .use(tree => {
        tree.walk(node => {
          if (node && node.attrs && node.attrs.class === 'header-anchor') {
            return null;
          }

          return node;
        })
      })
      .process(content, {closingSingleTag: "slash"})
      .then(html => callback(null, html.html));
  });

  return {
    dir: {
      input: "src",
    },
    markdownTemplateEngine: "njk",
  };
};
