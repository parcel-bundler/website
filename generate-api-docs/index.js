// @flow
const fs = require("fs");
const path = require("path");
const nullthrows = require("nullthrows");
const invariant = require("assert");
const { execSync } = require("child_process");

const { parse } = require("@babel/parser");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;

const {
  MapMap,
  SetMap,
  parseJsDoc,
  escapeHtml,
  indent,
  extractJSDocComment,
} = require("./utils.js");

/*::
import type { JSDoc, JSDocType, JSDocParam } from "./utils.js";

export type CollectedType = {|
  declaration: any,
  loc: {|
    filename: string,
    start: {| column: string, line: string |},
  |},
  defaultSection: ?string
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

let [PARCEL_ROOT, OUTPUT_DIR] = process.argv.slice(2);
if (!PARCEL_ROOT || !OUTPUT_DIR) {
  console.error(
    "\tUsage: node generate-api-docs/index.js /path/to/folder-containing-parcel-and-parcel-sourcemap-repo"
  );
  process.exit(1);
}
PARCEL_ROOT = fs.realpathSync(PARCEL_ROOT);

const PARCEL_TYPES = path.join(
  PARCEL_ROOT,
  "parcel/packages/core/types/index.js"
);
const PARCEL_REV = execSync("git rev-parse HEAD", {
  cwd: path.dirname(PARCEL_TYPES),
  encoding: "utf8",
}).trim();
const PARCEL_DIAGNOSTIC = path.join(
  PARCEL_ROOT,
  "parcel/packages/core/diagnostic/src/diagnostic.js"
);
const PARCEL_LOGGER = path.join(
  PARCEL_ROOT,
  "parcel/packages/core/logger/src/Logger.js"
);

const PARCEL_SOURCE_MAP = [
  path.join(PARCEL_ROOT, "source-map/src/SourceMap.js"),
  path.join(PARCEL_ROOT, "source-map/src/types.js"),
];
const PARCEL_SOURCE_MAP_REV = execSync("git rev-parse HEAD", {
  cwd: path.dirname(PARCEL_SOURCE_MAP[0]),
  encoding: "utf8",
}).trim();

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const PARCEL_URL = `https://github.com/parcel-bundler/parcel/blob/${PARCEL_REV}`;
const SOURCE_MAP_URL = `https://github.com/parcel-bundler/source-map/blob/${PARCEL_SOURCE_MAP_REV}`;

const SECTION_TO_URL = {
  index: {
    link: "/plugin-system/api/",
  },
  bundler: {
    link: "/plugin-system/bundler/",
  },
  namer: {
    link: "/plugin-system/namer/",
  },
  optimizer: {
    link: "/plugin-system/optimizer/",
  },
  compressor: {
    link: "/plugin-system/compressor/",
  },
  packager: {
    link: "/plugin-system/packager/",
  },
  reporter: {
    link: "/plugin-system/reporter/",
  },
  reporter: {
    link: "/plugin-system/reporter/",
  },
  resolver: {
    link: "/plugin-system/resolver/",
  },
  runtime: {
    link: "/plugin-system/runtime/",
  },
  transformer: {
    link: "/plugin-system/transformer/",
  },
  validator: {
    link: "/plugin-system/validator/",
  },
  logger: {
    link: "/plugin-system/logging/",
  },
  diagnostic: {
    link: "/plugin-system/logging/",
  },
  "source-map": {
    link: "/plugin-system/source-maps/",
    repo: SOURCE_MAP_URL,
  },
};

// ---------------------------
// CROSS REFERENCING
// ---------------------------

let jsDocs /*: Map<string, JSDocType>*/ = new Map();
let typeToSection = new Map();

function urlToType(name) {
  let section = nullthrows(typeToSection.get(name));
  return `${nullthrows(SECTION_TO_URL[section], section).link}#${name}`;
}

let typeReferenced = new SetMap();
function replaceReferencesDescription(
  name /*: string*/,
  contents /*: string*/
) {
  for (let [n] of jsDocs) {
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

function replaceReferences /*::<T: { description: string, params?: ?$ReadOnlyArray<JSDocParam> }> */(
  name,
  v /*: T */
) /*: T */ {
  if (v.params)
    return {
      ...v,
      // $FlowFixMe
      params: v.params.map((p) => replaceReferences(name, p)),
      description: replaceReferencesDescription(name, v.description),
    };
  else
    return {
      ...v,
      description: replaceReferencesDescription(name, v.description),
    };
}

// ---------------------------
// COLLECT
// ---------------------------

let collected /*: Map<string, CollectedType>*/ = new Map();
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
                  params: p.params.map((param: any) => {
                    if (param.type === "AssignmentPattern") {
                      param = param.left;
                    } else if (param.type === "ObjectPattern") {
                      param = {
                        name: "v",
                        optional: param.optional,
                        typeAnnotation: param.typeAnnotation,
                      };
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
            case "ClassProperty":
              if (extractJSDocComment(p)?.includes("@private")) {
                return;
              }

              invariant(p.typeAnnotation);
              return {
                type: "ObjectTypeProperty",
                static: p.static,
                kind: "init",
                key: p.key,
                proto: false,
                method: false,
                leadingComments: p.leadingComments,
                value: p.typeAnnotation.typeAnnotation,
              };
            default:
              invariant(false, p.type);
          }
        })
        .filter(Boolean),
    },
  };
}

function collectExportDeclaration(node, defaultSection) {
  let { declaration } = node;
  if (declaration.type === "Identifier") return;

  declaration.leadingComments = node.leadingComments;
  let jsdoc = node.leadingComments && node.leadingComments[0];

  invariant(
    declaration.type === "ClassDeclaration" ||
      declaration.type === "TypeAlias" ||
      declaration.type === "VariableDeclaration" ||
      declaration.type === "FunctionDeclaration" ||
      declaration.type === "InterfaceDeclaration",
    declaration.type
  );

  if (declaration.type === "FunctionDeclaration") {
    declaration.body = { type: "BlockStatement", body: [] };
  }

  if (declaration.type === "VariableDeclaration") {
    for (let decl of declaration.declarations) {
      collected.set(decl.id.name, {
        declaration: declaration,
        loc: decl.loc,
        defaultSection,
      });
    }
  } else {
    if (declaration.type === "ClassDeclaration") {
      declaration = classToInterface(declaration);
    }

    collected.set(declaration.id.name, {
      declaration: declaration,
      loc: node.loc,
      defaultSection,
    });
  }
}

function collect(file, defaultSection) {
  traverse(
    parse(fs.readFileSync(file, "utf8"), {
      sourceType: "module",
      plugins: ["flow", "classPrivateProperties"],
      sourceFilename: path.relative(PARCEL_ROOT, file),
    }),
    {
      ExportDefaultDeclaration(path) {
        collectExportDeclaration(path.node, defaultSection);
        path.skip();
      },
      ExportNamedDeclaration(path) {
        collectExportDeclaration(path.node, defaultSection);
        path.skip();
      },
      TypeAlias({ node }) {
        collected.set(node.id.name, {
          declaration: node,
          loc: node.loc,
          defaultSection,
        });
      },
    }
  );
}

collect(PARCEL_TYPES);
collect(PARCEL_LOGGER, "logger");
collect(PARCEL_DIAGNOSTIC, "diagnostic");
PARCEL_SOURCE_MAP.forEach((p) => collect(p, "source-map"));

// ---------------------------
// PARSE JSDOC
// ---------------------------

for (let [name, { declaration, loc, defaultSection }] of collected) {
  let parsedJsDoc = parseJsDoc(declaration);
  if (!parsedJsDoc) continue;

  let section = parsedJsDoc.section || defaultSection || "index";
  typeToSection.set(name, section);
  jsDocs.set(name, parsedJsDoc);
}

// ---------------------------
// GENERATE
// ---------------------------

let generated /*: MapMap<ProcessedType> */ = new MapMap();
for (let [name, { declaration, loc }] of collected) {
  let parsedJsDoc = jsDocs.get(name);
  if (!parsedJsDoc) continue;
  let section = nullthrows(typeToSection.get(name));

  let jsDoc /*: JSDocType*/ = {
    description: replaceReferencesDescription(name, parsedJsDoc.description),
    properties: parsedJsDoc.properties
      .filter((p) => !parsedJsDoc.excludedProperties.has(p.name))
      // $FlowFixMe
      .map((p) => replaceReferences(name, p)),
    section: parsedJsDoc.section,
    excludedProperties: parsedJsDoc.excludedProperties,
  };

  if (declaration.type === "InterfaceDeclaration") {
    generated.append(section, name, {
      type: "interface",
      jsDoc,
      loc,
      definition: [
        {
          value:
            replaceReferencesDescription(
              name,
              escapeHtml(
                generate(
                  { ...declaration, body: null },
                  { comments: false }
                ).code.trim()
              )
            ) + " {",
        },
        ...declaration.body.properties
          .filter((p) => !parsedJsDoc.excludedProperties.has(p.key.name))
          .map((p) => ({
            key: p.key.name,
            value:
              indent(
                replaceReferencesDescription(
                  name,
                  escapeHtml(generate(p, { comments: false }).code)
                )
              ) + ",",
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
          value: escapeHtml(
            `type ${declaration.id.name}${
              declaration.typeParameters
                ? generate(declaration.typeParameters).code
                : ""
            } = {` + (exact ? "|" : "")
          ),
        },
        ...declaration.right.properties
          .filter(
            (p) => !p.key || !parsedJsDoc.excludedProperties.has(p.key.name)
          )
          .map((p) => ({
            key: p.key?.name,
            value:
              indent(
                replaceReferencesDescription(
                  name,
                  escapeHtml(generate(p, { comments: false }).code)
                )
              ) + ",",
          })),
        { value: (exact ? "|" : "") + "}" },
      ],
    });
  } else {
    generated.append(section, name, {
      type: "type",
      definition: replaceReferencesDescription(
        name,
        escapeHtml(generate(declaration, { comments: false }).code.trim())
      ),
      jsDoc,
      loc,
    });
  }
}

// ---------------------------
// GENERATE
// ---------------------------

const EXPERIMENTAL = `<figure class="well warning"><div>Marked as experimental</div></figure>`;

function write(section, file, data) {
  let output = `<html>
<head>
<style>
  div.api .type {
   margin: 2rem 0;
   padding: 1rem 1rem;
   border: 1px solid var(--border-color);
  }
  div.api .type .title {
    margin: 0.6rem 0;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  div.api .type .title a {
    font-size: 1rem;
    opacity: 0.5;
  }
  div.api .type .title a:hover {
    font-size: 1rem;
    opacity: 1;
  }
  div.api div.inline-method {
    padding: 0.3em 0.3em 1.3em 3.5em;
    background: var(--code-background-color);
    transition: background 0.2s ease-in-out;
  }
  div.api div.inline-method p:first-child {
    margin-top: 0;
  }
  div.api div.inline-method ul {
    margin: 0;
  }
  div.api pre.interface {
    margin: 0;
    padding: 0;
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
    let experimental =
      properties.find(({ type }) => type === "experimental") != null;
    let refs = typeReferenced.get(name);

    output += `<div class="type">
<h4 class="title">
  <span id="${name}">${name}</span>
  <a href="${SECTION_TO_URL[section].repo || PARCEL_URL}/${loc.filename.slice(
      loc.filename.indexOf("/") + 1
    )}#L${loc.start.line}"><i>${loc.filename}:${loc.start.line}</i></a>
</h4>
${description ? `${description}` : ""}
`;

    if (experimental) {
      output += EXPERIMENTAL;
    }

    if (type.type === "interface") {
      for (let t of type.definition) {
        output += `<pre class="interface"><code>${t.value}</code></pre>\n`;
        let method = methods.find((m) => m.name === t.key);
        if (method) {
          output += `<div class="inline-method">`;
          if (method.experimental) {
            output += EXPERIMENTAL;
          }
          output += method.description;
          if (method.params.length) {
            output += `<b>Params:</b>\n<ul>`;
            for (let param of method.params) {
              output += `<li><b><code>${param.name}</code></b>: ${param.description}</li>`;
            }
            output += `</ul>`;
          }
          output += `</div>`;
        }
        let prop = props.find((m) => m.name === t.key);
        if (prop) {
          output += `<div class="inline-method">`;
          if (prop.experimental) {
            output += EXPERIMENTAL;
          }
          output += prop.description;
          if (prop.default != null)
            output += `<p>Default value: <code>${prop.default}</code></p>`;
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
${[...refs]
  .sort()
  .map((v) => `<a href="${urlToType(v)}">${v}</a>`)
  .join(", ")}`
    : ""
}
</div>`;
  }

  output += `</div></body></html>`;
  fs.writeFileSync(file, output);
}

for (let [section, data] of generated) {
  let file = path.join(OUTPUT_DIR, section + ".html");
  write(section, file, data);
  console.log("wrote", file);
}
