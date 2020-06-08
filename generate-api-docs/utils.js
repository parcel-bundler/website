// @flow strict-local
const invariant = require("assert");
const t = require("@babel/types");
const nullthrows = require("nullthrows");

/*::
declare type JSDocParam = {|
  type: "param",
  name: string,
  description: string,
|};
declare type JSDocMethod = {|
  type: "method",
  name: string,
  description: string,
  params: Array<JSDocParam>,
  returns: ?string
|};
declare type JSDocProperty = {|
  type: "property",
  name: string,
  description: string,
|};


declare type JSDoc = JSDocMethod | JSDocParam | JSDocProperty;

declare type JSDocType = {|
  description: string,
  properties: Array<JSDoc>,
  section: ?string,
|};
*/

module.exports.MapMap = class MapMap /*::<T> */ extends Map /*:: <string, Map<string, T>> */ {
  append(key1 /*: string */, key2 /*: string */, value /*: T*/) {
    let otherMap = this.get(key1);
    if (!otherMap) {
      otherMap = new Map();
      this.set(key1, otherMap);
    }
    otherMap.set(key2, value);
  }
};

module.exports.SetMap = class SetMap /*::<T> */ extends Map /*:: <string, Set<T>> */ {
  add(key1 /*: string */, value /*: T*/) {
    let set /*: ?Set<T>*/ = this.get(key1);
    if (!set) {
      set = (new Set() /*: Set<T>*/);
      super.set(key1, set);
    }
    set.add(value);
  }
};

function getJSDocCommentOfNode(node /*: any */) /*: ?string*/ {
  return (
    node.leadingComments &&
    node.leadingComments[0] &&
    node.leadingComments[0].value.startsWith("*") &&
    node.leadingComments[0].value.replace(/(?:\\\n)?^\s*\* ?/gm, "").trim()
  );
}

function parseJsDocComment(contents) /*: JSDocType */ {
  let result = {
    description: "",
    properties: [],
    section: "",
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
          result.properties.push(
            // $FlowFixMe
            {
              type,
              name,
              description,
            }
          );
          break;
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
  return result;
}

module.exports.parseJsDoc = function parseJsDoc(
  declaration /*: any*/
) /*: JSDocType*/ {
  let contents = getJSDocCommentOfNode(declaration);

  let result = contents
    ? parseJsDocComment(contents)
    : {
        description: "",
        properties: [],
        section: "",
      };

  let body = declaration.body || declaration.right;
  if (t.isObjectTypeAnnotation(body)) {
    for (let prop of body.properties) {
      let nodeComment = getJSDocCommentOfNode(prop);
      if (!nodeComment) continue;

      t.assertIdentifier(prop.key);
      let name = prop.key.name;
      let { description, properties } = parseJsDocComment(nodeComment);
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
        });
      } else {
        result.properties.push({
          type: "property",
          name,
          description,
        });
      }
    }
  }

  return result;
};

module.exports.escapeHtml = function escapeHtml(str /*: string */) {
  const tagsToReplace = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
  };
  console.log(str)
  return str.replace(/[&<>]/g, function (tag) {
    return tagsToReplace[tag] || tag;
  });
};
