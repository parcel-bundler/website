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

  eleventyConfig.addPlugin(pluginSass, { watch: ["src/*.{scss,sass}"] });
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.setTemplateFormats(["md", "css", "png", "svg"]);

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

  eleventyConfig.addPairedShortcode("note", function (content) {
    return `<div class="well">${content}</div>`;
  });
  eleventyConfig.addPairedShortcode("warning", function (content) {
    return `<div class="well warning">${content}</div>`;
  });
  eleventyConfig.addPairedShortcode("error", function (content) {
    return `<div class="well error">${content}</div>`;
  });

  // TODO add "Open in REPL " 😉
  eleventyConfig.addPairedShortcode("sample", function (content, entry, mode) {
    let data = content
      .split("\n")
      .filter(Boolean)
      .map((s) => JSON.parse(s));
    return (
      `<div class="well sample ${mode === "column" ? "column" : "row"}">\n\n` +
      (entry ? `<div class="cmd"><code>parcel ${entry}</code></div>` : "") +
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
      `</div>`
    );
  });
  eleventyConfig.addPairedShortcode("samplefile", function (content, name) {
    return JSON.stringify({ name, content });
  });

  return {
    dir: {
      input: "src",
    },
    markdownTemplateEngine: "njk",
  };
};
