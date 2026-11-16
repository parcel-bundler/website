const { Resolver } = require("@parcel/plugin");
const fs = require("fs");
const path = require("path");

// Resolves absolute URLs of pages (e.g. /features/cli/#entries) to their source files in src, so
// links between pages are checked and follow their output names. /assets and /plugin-browser are
// aliased to src in package.json.
module.exports = new Resolver({
  resolve({ specifier, options }) {
    if (
      !specifier.startsWith("/") ||
      specifier.startsWith("/assets/") ||
      specifier.startsWith("/plugin-browser/")
    ) {
      return null;
    }

    let page = specifier.replace(/[?#].*$/, "").replace(/^\/|\/$/g, "");
    let src = path.join(options.projectRoot, "src");
    let candidates = page
      ? [
          `${page}.md`,
          `${page}/${path.basename(page)}.md`,
          `${page}/index.html`,
          `${page}.html`,
          page,
        ]
      : ["home/index.html"];
    for (let candidate of candidates) {
      let filePath = path.join(src, candidate);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return { filePath };
      }
    }

    return null;
  },
});
