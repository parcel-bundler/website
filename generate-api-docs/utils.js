const marked = require("marked");

module.exports.MapMap = class MapMap extends Map {
  append(key1, key2, value) {
    let otherMap = this.get(key1);
    if (!otherMap) {
      otherMap = new Map();
      this.set(key1, otherMap);
    }
    otherMap.set(key2, value);
  }
};

module.exports.SetMap = class SetMap extends Map {
  add(key1, value) {
    let set = this.get(key1);
    if (!set) {
      set = new Set();
      super.set(key1, set);
    }
    set.add(value);
  }
};

// Returns the text of the JSDoc comment (`/** ... */`) directly preceding a
// node, without the leading `*`s. Line comments and non-JSDoc block comments
// (e.g. a file header) are ignored.
function extractJSDocComment(node) {
  let comments = node && node.leadingComments;
  if (!comments || comments.length === 0) return null;
  let comment = comments[comments.length - 1];
  if (comment.type !== "CommentBlock" || !comment.value.startsWith("*")) {
    return null;
  }
  return comment.value
    .replace(/^\*/, "")
    .replace(/(?:\\\n)?^\s*\* ?/gm, "")
    .trim();
}
module.exports.extractJSDocComment = extractJSDocComment;

// Tags whose presence hides the documented item.
const HIDDEN_TAGS = new Set(["private", "internal", "hidden", "ignore"]);
// Tags that are accepted but not rendered.
const IGNORED_TAGS = new Set(["see", "example", "template", "type", "typedef"]);

function emptyJsDoc() {
  return {
    description: "",
    // Array<{type: "param" | "property" | "default" | "returns", name, description}>
    tags: [],
    section: null,
    experimental: false,
    deprecated: null,
  };
}
module.exports.emptyJsDoc = emptyJsDoc;

// Parses the text of a JSDoc comment. Returns null if the item is hidden
// (`@private` and friends).
function parseJsDocComment(contents) {
  let description = "";
  let rawTags = [];
  let current = null;
  for (let line of contents.split("\n")) {
    let m = line.match(/^@(\w+)\b\s*(.*)$/);
    if (m) {
      current = { tag: m[1], text: m[2] };
      rawTags.push(current);
    } else if (current) {
      // Continuation of a multi-line tag.
      current.text += "\n" + line;
    } else {
      description += line + "\n";
    }
  }

  let result = emptyJsDoc();
  result.description = marked(description.trim());

  for (let { tag, text } of rawTags) {
    text = text.trim();
    if (HIDDEN_TAGS.has(tag)) return null;
    switch (tag) {
      case "section":
        result.section = text;
        break;
      case "experimental":
        result.experimental = true;
        break;
      case "deprecated":
        result.deprecated = text ? marked.parseInline(text) : "";
        break;
      case "default":
        result.tags.push({ type: "default", name: "", description: text });
        break;
      case "returns":
      case "return":
        result.tags.push({
          type: "returns",
          name: "",
          description: marked.parseInline(text),
        });
        break;
      case "param":
      case "property":
      case "prop": {
        // `@param name desc`, `@param {Type} name desc`, `@param [name] desc`.
        let pm = text.match(
          /^(?:\{[^}]*\}\s*)?\[?([\w.$]+)[^\s\]]*\]?\s*(?:-\s*)?([\s\S]*)$/
        );
        result.tags.push({
          type: tag === "param" ? "param" : "property",
          name: pm ? pm[1] : text,
          description: marked.parseInline(pm ? pm[2] : ""),
        });
        break;
      }
      default:
        if (!IGNORED_TAGS.has(tag)) {
          console.warn(`warning: ignoring unknown JSDoc tag @${tag}`);
        }
    }
  }

  return result;
}
module.exports.parseJsDocComment = parseJsDocComment;

module.exports.escapeHtml = function escapeHtml(str) {
  const tagsToReplace = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
  };
  return str.replace(/[&<>]/g, function (tag) {
    return tagsToReplace[tag] || tag;
  });
};

module.exports.indent = function indent(str, spaces = 2) {
  let indentation = " ".repeat(spaces);
  return str
    .trim()
    .split("\n")
    .map((l) => indentation + l)
    .join("\n");
};
