const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(syntaxHighlight, {
		templateFormats: ["js", "html", "ts", "css", "md"]
	});
	eleventyConfig.addPlugin(eleventyNavigationPlugin);

	eleventyConfig.setTemplateFormats(["md", "css"]);
	eleventyConfig.setDataDeepMerge(true);
};
