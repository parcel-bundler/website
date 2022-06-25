// @flow strict-local
const invariant = require("assert");
const t = require("@babel/types");
const nullthrows = require("nullthrows");
const marked = require("marked");

/*::
export type JSDocParam = {|
  type: "param",
  name: string,
  description: string,
|};
export type JSDocMethod = {|
  type: "method",
  name: string,
  description: string,
  params: Array<JSDocParam>,
  returns: ?string,
  experimental: boolean,
|};
export type JSDocProperty = {|
  type: "property",
  name: string,
  description: string,
  default?: ?string,
  experimental: boolean,
|};

export type JSDoc = JSDocMethod | JSDocParam | JSDocProperty;

export type JSDocType = {|
  description: string,
  properties: Array<JSDoc>,
  excludedProperties: Set<string>,
  section: ?string,
|};
*/

module.exports.MapMap = class MapMap /*::<T> */
  extends Map /*:: <string, Map<string, T>> */ {
  append(key1 /*: string */, key2 /*: string */, value /*: T*/) {
    let otherMap = this.get(key1);
    if (!otherMap) {
      otherMap = new Map();
      this.set(key1, otherMap);
    }
    otherMap.set(key2, value);
  }
};

module.exports.SetMap = class SetMap /*::<T> */
  extends Map /*:: <string, Set<T>> */ {
  add(key1 /*: string */, value /*: T*/) {
    let set /*: ?Set<T>*/ = this.get(key1);
    if (!set) {
      set = (new Set() /*: Set<T>*/);
      super.set(key1, set);
    }
    set.add(value);
  }
};

function extractJSDocComment(node /*: any */) /*: ?string*/ {
  return (
    node.leadingComments &&
    node.leadingComments[0] &&
    node.leadingComments[0].value.startsWith("*") &&
    node.leadingComments[0].value.replace(/(?:\\\n)?^\s*\* ?/gm, "").trim()
  );
}
module.exports.extractJSDocComment = extractJSDocComment;

function parseJsDocComment(contents) /*: ?JSDocType */ {
  let result = {
    description: "",
    properties: [],
    section: "",
    excludedProperties: new Set(),
  };
  let lines = contents.split("\n");
  for (let line of lines) {
    if (line.startsWith("@")) {
      if (line.startsWith("@section ")) {
        result.section = line.slice(9).trim();
        continue;
      }

      let m = nullthrows(line.match(/@(\w+)\s*(\w*)\s*(.*)/));
      let [, type, name, description] = m;
      switch (type) {
        // case "method":
        //   result.properties.push({
        //     type: "method",
        //     name,
        //     description,
        //     params: [],
        //     returns: null,
        //   });
        //   break;
        case "returns":
        case "property":
        case "param":
        case "default":
        case "experimental":
          result.properties.push(
            // $FlowFixMe
            {
              type,
              name,
              description,
            }
          );
          break;
        case "private":
          return null;
        default:
          invariant(false, "Unknown JSDoc directive: " + line);
      }
    } else {
      if (line) {
        result.description += line + "\n";
      } else {
        result.description += `<br>`;
      }
    }
  }
  result.description = marked(result.description);
  return result;
}

module.exports.parseJsDoc = function parseJsDoc(
  declaration /*: any*/
) /*: ?JSDocType */ {
  let contents = extractJSDocComment(declaration);

  let result /*: ?JSDocType */ = contents
    ? parseJsDocComment(contents)
    : {
        description: "",
        properties: [],
        section: "",
        excludedProperties: new Set(),
      };

  if (!result) return;

  let body = declaration.body || declaration.right;
  if (t.isObjectTypeAnnotation(body)) {
    for (let prop of body.properties) {
      let nodeComment = extractJSDocComment(prop);
      if (!nodeComment) continue;

      t.assertIdentifier(prop.key);
      let name = prop.key.name;
      let parsed = parseJsDocComment(nodeComment);
      if (!parsed) {
        result.excludedProperties.add(name);
      } else {
        let { description, properties } = parsed;
        let experimental =
          properties.find((v) => v.type === "experimental") != null;
        if (t.isFunctionTypeAnnotation(prop.value)) {
          result.properties.push({
            type: "method",
            name,
            description,
            params: properties
              .filter((v) => v.type === "param")
              .map((v) => {
                invariant(v.type === "param", v.type);
                return v;
              }),
            // $FlowFixMe
            returns: properties.find((v) => v.type === "returns"),
            experimental,
          });
        } else {
          let defaultValue = properties.find((v) => v.type === "default")
            ?.description;
          result.properties.push({
            type: "property",
            name,
            description,
            default: defaultValue,
            experimental,
          });
        }
      }
    }
  }

  return result;
};

module.exports.escapeHtml = function escapeHtml(
  str /*: string */
) /*: string*/ {
  const tagsToReplace = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
  };
  return str.replace(/[&<>]/g, function (tag) {
    return tagsToReplace[tag] || tag;
  });
};

module.exports.indent = function indent(
  str /*: string*/,
  spaces /*: number*/ = 2
) /*: string*/ {
  let indentation = " ".repeat(spaces);
  return str
    .trim()
    .split("\n")
    .map((l) => indentation + l)
    .join("\n");
};
