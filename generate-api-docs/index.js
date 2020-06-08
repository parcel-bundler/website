// @flow
const fs = require("fs");
const path = require("path");
const nullthrows = require("nullthrows");
const invariant = require("assert");

const { parse } = require("@babel/parser");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;

const {
  MapMap,
  SetMap,
  parseJsDoc,
  escapeHtml,
  indent,
} = require("./utils.js");

/*::
import type { JSDocType } from "./utils.js";

export type CollectedType = {|
  declaration: any,
  loc: {|
    filename: string,
    start: {| column: string, line: string |},
  |},
|};
declare type ProcessedType =
  | {|
      type: "type",
      definition: string,
      loc: {
        filename: string,
        start: {| column: string, line: string |},
        ...
      },
      jsDoc: JSDocType,
    |}
  | {|
      type: "interface",
      definition: Array<{| key: ?string, value: string |}>,
      loc: {
        filename: string,
        start: {| column: string, line: string |},
        ...
      },
      jsDoc: JSDocType,
    |};
*/

const [PARCEL_ROOT, OUTPUT_DIR] = process.argv.slice(2);
if (!PARCEL_ROOT || !OUTPUT_DIR) {
  console.error(
    "\tUsage: node generate-api-docs/index.js /path/to/parcel-monorepo"
  );
  process.exit(1);
}

const PARCEL_TYPES = false
  ? path.join(PARCEL_ROOT, "parcel/packages/core/types/index.js")
  : path.join(__dirname, "example.flow");

const PARCEL_SOURCE_MAP = path.join(PARCEL_ROOT, "source-map/src/SourceMap.js");

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
const PUBLIC_URL = "/"; //OUTPUT_DIR;

const SECTION_TO_URL = {
  index: "/plugin-system/api/",
  bundler: "/plugin-system/bundler/",
  namer: "/plugin-system/namer/",
  optimizer: "/plugin-system/optimizer/",
  packager: "/plugin-system/packager/",
  reporter: "/plugin-system/reporter/",
  reporter: "/plugin-system/reporter/",
  resolver: "/plugin-system/resolver/",
  runtime: "/plugin-system/runtime/",
  transformer: "/plugin-system/transformer/",
  validator: "/plugin-system/validator/",
  "source-map": "/plugin-system/source-map/",
};

// ---------------------------
// CROSS REFERENCING
// ---------------------------

let collected /*: Map<string, CollectedType>*/ = new Map();
let typeToSection = new Map();

function urlToType(name) {
  let section = nullthrows(typeToSection.get(name));
  return `${nullthrows(SECTION_TO_URL[section], section)}#${name}`;
}

let typeReferenced = new SetMap();
function replaceReferences(name /*: string*/, contents /*: string*/) {
  for (let [n] of collected) {
    contents = contents.replace(
      new RegExp(`(^|\\W)(${n})($|\\W)`, "g"),
      (_, l, type, r) => {
        if (n !== name) {
          let refs = typeReferenced.get(n);
          if (!refs) {
            refs = new Set();
            typeReferenced.set(n, refs);
          }
          refs.add(name);
        }
        return l + `<a href="${urlToType(type)}">` + type + "</a>" + r;
      }
    );
  }
  return contents;
}

// ---------------------------
// COLLECT
// ---------------------------

function classToInterface(decl) {
  return {
    type: "InterfaceDeclaration",
    id: decl.id,
    extends: decl.superClass
      ? [{ type: "InterfaceExtends", id: decl.superClass }]
      : [],
    implements: [],
    mixins: [],
    leadingComments: decl.leadingComments,
    body: {
      type: "ObjectTypeAnnotation",
      properties: decl.body.body
        .map((p) => {
          switch (p.type) {
            case "ClassMethod":
              return {
                type: "ObjectTypeProperty",
                static: p.static,
                kind: "init",
                key: p.key,
                proto: false,
                method: true,
                leadingComments: p.leadingComments,
                value: {
                  type: "FunctionTypeAnnotation",
                  rest: null,
                  typeParams: true,
                  params: p.params.map((param) => {
                    if (param.type === "AssignmentPattern") {
                      param = param.left;
                    }
                    return {
                      type: "FunctionTypeParam",
                      name: { type: "Identifier", name: param.name },
                      optional: param.optional,
                      typeAnnotation: param.typeAnnotation.typeAnnotation,
                    };
                  }),
                  returnType: p.returnType
                    ? p.returnType.typeAnnotation
                    : { type: "VoidTypeAnnotation" },
                },
              };
            case "ClassPrivateProperty":
              return;
            default:
              invariant(false, p.type);
          }
        })
        .filter(Boolean),
    },
  };
}

function collectExportDeclaration(node) {
  let { declaration } = node;

  declaration.leadingComments = node.leadingComments;
  let jsdoc = node.leadingComments && node.leadingComments[0];

  if (declaration.type === "ClassDeclaration") {
    declaration = classToInterface(declaration);
  }
  collected.set(declaration.id.name, {
    declaration: declaration,
    loc: node.loc,
  });
}

function collect(file) {
  traverse(
    parse(fs.readFileSync(file, "utf8"), {
      sourceType: "module",
      plugins: ["flow", "classPrivateProperties"],
      sourceFilename: path.relative(PARCEL_ROOT, file),
    }),
    {
      ExportDefaultDeclaration(path) {
        collectExportDeclaration(path.node);
        path.skip();
      },
      ExportNamedDeclaration(path) {
        collectExportDeclaration(path.node);
        path.skip();
      },
      TypeAlias({ node }) {
        collected.set(node.id.name, {
          declaration: node,
          loc: node.loc,
        });
      },
    }
  );
}

collect(PARCEL_TYPES);
// collect(PARCEL_SOURCE_MAP);

// ---------------------------
// PARSE JSDOC
// ---------------------------

let jsDocs /*: Map<string, JSDocType>*/ = new Map();
for (let [name, { declaration, loc }] of collected) {
  let parsedJsDoc = parseJsDoc(declaration);
  let section = parsedJsDoc.section || "index";
  typeToSection.set(name, section);
  jsDocs.set(name, parsedJsDoc);
}

// ---------------------------
// GENERATE
// ---------------------------

let generated /*: MapMap<ProcessedType> */ = new MapMap();
for (let [name, { declaration, loc }] of collected) {
  let parsedJsDoc = nullthrows(jsDocs.get(name));
  let section = nullthrows(typeToSection.get(name));

  let jsDoc /*: JSDocType*/ = {
    description: replaceReferences(name, parsedJsDoc.description),
    // $FlowFixMe
    properties: parsedJsDoc.properties.map((prop) => ({
      description: replaceReferences(name, prop.description),
      ...prop,
    })),
    section: parsedJsDoc.section,
  };

  if (declaration.type === "InterfaceDeclaration") {
    generated.append(section, name, {
      type: "interface",
      jsDoc,
      loc,
      definition: [
        {
          value:
            generate(
              { ...declaration, body: null },
              { comments: false }
            ).code.trim() + " {",
        },
        ...declaration.body.properties.map((p) => ({
          key: p.key.name,
          value: indent(generate(p, { comments: false }).code) + ",",
        })),
        { value: "}" },
      ],
    });
  } else if (
    declaration.type === "TypeAlias" &&
    declaration.right.type === "ObjectTypeAnnotation"
  ) {
    let { exact } = declaration.right;
    generated.append(section, name, {
      type: "interface",
      jsDoc,
      loc,
      definition: [
        {
          value: `type ${declaration.id.name} = {` + (exact ? "|" : ""),
        },
        ...declaration.right.properties.map((p) => ({
          key: p.key?.name,
          value: indent(generate(p, { comments: false }).code) + ",",
        })),
        { value: (exact ? "|" : "") + "}" },
      ],
    });
  } else {
    generated.append(section, name, {
      type: "type",
      definition: generate(declaration, { comments: false }).code.trim(),
      jsDoc,
      loc,
    });
  }
}

// ---------------------------
// GENERATE
// ---------------------------

function write(file, data) {
  let output = `<html>
<head>
<style>
  .api .type {
   margin: 2rem 0;
   padding: 0.4rem 1rem;
   border: 1px solid var(--border-color);
  }
  .api .type .title {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .api .type .title a {
    font-size: 1rem;
    opacity: 0.5;
  }
  .api .type .title a:hover {
    font-size: 1rem;
    opacity: 1;
  }
  .api .inline-method {
    margin: 0.3em 3em;
  }
  .api .inline-method ul {
    margin: 0;
  }
  .api .interface {
    margin: 0;
  }
</style>
</head>
<body>
<div class="api">
`;

  for (let [name, type] of data) {
    let { loc } = type;
    let { description, properties } = type.jsDoc;
    let props = properties
      .filter(({ type }) => type === "property")
      .map((p) => {
        invariant(p.type === "property");
        return p;
      });
    let methods = properties
      .filter(({ type }) => type === "method")
      .map((p) => {
        invariant(p.type === "method");
        return p;
      });
    let params = properties
      .filter(({ type }) => type === "param")
      .map((p) => {
        invariant(p.type === "param");
        return p;
      });
    let refs = typeReferenced.get(name);

    output += `<div class="type">

<h4 class="title">
  <span id="${name}">${name}</span>
  <a href="https://github.com/parcel-bundler/parcel/blob/v2/${loc.filename}#L${
      loc.start.line
    }"><i>${loc.filename}:${loc.start.line}</i></a>
</h4>
${description ? `<p>${description}</p>` : ""}
`;

    if (type.type === "interface") {
      for (let t of type.definition) {
        output += `<pre class="interface"><code>${t.value}</code></pre>\n`;
        let method = methods.find((m) => m.name === t.key);
        if (method) {
          output += `<div class="inline-method">${method.description}`;
          if (method.params.length) {
            output += `<b>Params:</b>\n<ul>`;
            for (let param of method.params) {
              output += `<li><b><code>${param.name}</code></b>: ${param.description}</li>`;
            }
            output += `</ul>`;
          }
          output += `</div>`;
        }
      }
    } else {
      output += `
${
  props.length > 0
    ? `<h5>Property Descriptions</h5>` +
      `<ul>${props
        .map((p) => `<li><b><code>${p.name}</code></b>: ${p.description}</p>`)
        .join("\n")}</ul>`
    : ""
}
${
  methods.length > 0
    ? `<h5>Method Descriptions</h5>` +
      `<ul>${methods
        .map((m) => `<li><b><code>${m.name}</code></b>: ${m.description}</p>`)
        .join("\n")}</ul>`
    : ""
}
${
  params.length > 0
    ? `<h5>Parameter Descriptions</h5>` +
      `<ul>${params
        .map((m) => `<li><b><code>${m.name}</code></b>: ${m.description}</p>`)
        .join("\n")}</ul>`
    : ""
}
<h5>Type</h5>
<pre><code>${type.definition}</code></pre>`;
    }
    output += `
${
  refs && refs.size > 0
    ? `<h5>Referenced by:</h5>
${[...refs].map((v) => `<a href="${urlToType(v)}">${v}</a>`).join(", ")}`
    : ""
}
</div>`;
  }

  output += `</div></body></html>`;
  fs.writeFileSync(file, output);
}

for (let [section, data] of generated) {
  let file = path.join(OUTPUT_DIR, section + ".html");
  write(file, data);
  console.log("wrote", file);
}
