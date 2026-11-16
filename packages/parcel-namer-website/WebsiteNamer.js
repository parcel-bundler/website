const { Namer } = require("@parcel/plugin");
const path = require("path");

// Names pages by their path in src, with pretty URLs: features/cli.md is written to
// features/cli/index.html, and served at /features/cli/. Blog posts live in a directory of the
// same name (blog/v2/v2.md), which is collapsed (blog/v2/index.html).
module.exports = new Namer({
  name({ bundle, options }) {
    if (!bundle.needsStableName) {
      return null;
    }

    let filePath = bundle.getMainEntry().filePath;
    let relative = path
      .relative(options.projectRoot, filePath)
      .replace(/^(src[\\/]home|src)[\\/]/, "");
    let base = relative.slice(
      0,
      relative.length - path.extname(relative).length
    );
    let name = path.basename(base);
    if (bundle.type !== "html" || name === "index" || base === "404") {
      return base + "." + bundle.type;
    }

    let dir = path.dirname(base);
    if (path.basename(dir) === name) {
      return path.join(dir, "index.html");
    }
    return path.join(base, "index.html");
  },
});
