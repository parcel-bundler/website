const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginSass = require("eleventy-plugin-sass");

const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight, {
    templateFormats: ["*"],
    alwaysWrapLineHighlights: false,
  });

  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addPlugin(pluginSass, {
    watch: ["src/*.{scss,sass}"],
  });

  // Copy assets
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({
    "src/assets/favicon.ico": "favicon.ico",
  });

  eleventyConfig.setTemplateFormats(["md", "css", "png", "svg", "mp4", "jpg"]);
  eleventyConfig.addWatchTarget("./api/");

  eleventyConfig.setLibrary(
    "md",
    markdownIt({
      html: true,
    }).use(markdownItAnchor, {
      permalink: true,
      permalinkBefore: true,
    })
  );

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
            (name ? `<em>${name}</em>:` : "<span>&nbsp;</span>") +
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

  return {
    dir: {
      input: "src",
    },
    markdownTemplateEngine: "njk",
  };
};
