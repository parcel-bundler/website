// @flow strict-local
const invariant = require("assert");
const t = require("@babel/types");

/*::
declare type JSDoc = {|
  description: string,
  properties: Array<{| type: string, name: string, description: string |}>,
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

function getJSDocCommentOfNode(node) /*: ?string*/ {
  return (
    node.leadingComments &&
    node.leadingComments[0] &&
    node.leadingComments[0].value.startsWith("*") &&
    node.leadingComments[0].value.replace(/(?:\\\n)?^\s*\* ?/gm, "").trim()
  );
}

module.exports.parseJsDoc = function parseJsDoc(
  declaration /*: any*/
) /*: JSDoc*/ {
  let contents = getJSDocCommentOfNode(declaration);

  let result = {
    description: "",
    properties: [],
    section: "",
  };

  if (contents) {
    let lines = contents.split("\n");
    for (let line of lines) {
      if (line.startsWith("@")) {
        if (line.startsWith("@section ")) {
          result.section = line.slice(9).trim();
          continue;
        }

        let type;
        if (line.startsWith("@property ")) {
          line = line.slice(10);
          type = "property";
        } else if (line.startsWith("@method ")) {
          line = line.slice(8);
          type = "method";
        } else if (line.startsWith("@param ")) {
          line = line.slice(7);
          type = "param";
        } else {
          invariant(false, "Unknown JSDoc directive: " + line);
        }

        let space = line.indexOf(" ");
        let name = line.substring(0, space);
        let description = line.substring(space + 1);
        result.properties.push({
          type,
          name,
          description,
        });
      } else {
        if (line) {
          result.description += line + "\n";
        } else {
          result.description += `<br>`;
        }
      }
    }
  }

  let body = declaration.body || declaration.right;
  if (t.isObjectTypeAnnotation(body)) {
    for (let prop of body.properties) {
      let description = getJSDocCommentOfNode(prop);
      if (!description) continue;

      t.assertIdentifier(prop.key);
      let type = t.isFunctionTypeAnnotation(prop.value) ? "method" : "property";
      let name = prop.key.name;
      result.properties.push({
        type,
        name,
        description,
      });
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
  return str.replace(/[&<>]/g, function (tag) {
    return tagsToReplace[tag] || tag;
  });
};
