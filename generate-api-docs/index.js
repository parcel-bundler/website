// @flow
const fs = require("fs");
const path = require("path");
const nullthrows = require("nullthrows");

const { parse } = require("@babel/parser");
const generate = require("@babel/generator").default;
const traverse = require("@babel/traverse").default;

const { MapMap, SetMap, parseJsDoc, escapeHtml } = require("./utils.js");

/*::
export type CollectedType = {|
  declaration: any,
  loc: {|
    filename: string,
    start: {| column: string, line: string |},
    end: {| column: string, line: string |},
  |},
|};
declare type ProcessedType = {|
  type: string,
  loc: {|
    filename: string,
    start: {| column: string, line: string |},
    end: {| column: string, line: string |},
  |},
  jsdoc: {|
    description: string,
    properties: Array<{| type: string, name: string, description: string |}>,
  |},
|};

*/

const [PARCEL_ROOT, OUTPUT_DIR] = process.argv.slice(2);
if (!PARCEL_ROOT || !OUTPUT_DIR) {
  console.error(
    "\tUsage: node generate-api-docs/index.js /path/to/parcel-monorepo"
  );
  process.exit(1);
}

const ROOT = PARCEL_ROOT;
const TYPES = false
  ? path.join(PARCEL_ROOT, "packages/core/types/index.js")
  : path.join(__dirname, "example.flow");

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
  validator: "/plugin-system/validator/",
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

let ast = parse(fs.readFileSync(TYPES, "utf8"), {
  sourceType: "module",
  plugins: ["flow"],
  sourceFilename: path.relative(PARCEL_ROOT, TYPES),
});

traverse(ast, {
  ExportNamedDeclaration(path) {
    let { node } = path;
    node.declaration.leadingComments = node.leadingComments;
    let jsdoc = node.leadingComments && node.leadingComments[0];
    collected.set(node.declaration.id.name, {
      declaration: node.declaration,
      loc: node.loc,
    });
    path.skip();
  },
  TypeAlias({ node }) {
    collected.set(node.id.name, {
      declaration: node,
      loc: node.loc,
    });
  },
});

// ---------------------------
// PARSE JSDOC
// ---------------------------

let parsed = new Map();
for (let [name, { declaration, loc }] of collected) {
  let parsedJsDoc = parseJsDoc(declaration);
  let section = parsedJsDoc.section || "index";
  typeToSection.set(name, section);
  parsed.set(name, {
    type: generate(declaration, { comments: false }).code.trim(),
    jsdoc: parsedJsDoc,
    loc,
  });
}

// ---------------------------
// PROCESS
// ---------------------------

let generated = new MapMap();
for (let [name, { type, loc, jsdoc }] of parsed) {
  let section = nullthrows(typeToSection.get(name));
  generated.append(section, name, {
    type: replaceReferences(name, escapeHtml(type)),
    jsdoc: {
      description: replaceReferences(name, jsdoc.description),
      properties: jsdoc.properties.map((prop) => ({
        name: prop.name,
        type: prop.type,
        description: replaceReferences(name, prop.description),
      })),
    },
    loc,
  });
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
</style>
</head>
<body>
<div class="api">
`;

  for (let [
    name,
    {
      type,
      jsdoc: { description, properties },
      loc,
    },
  ] of data) {
    let props = properties.filter(({ type }) => type === "property");
    let methods = properties.filter(({ type }) => type === "method");
    let params = properties.filter(({ type }) => type === "param");
    let refs = typeReferenced.get(name);

    output += `<div class="type">

<h4 class="title">
  <span id="${name}">${name}</span>
  <a href="https://github.com/parcel-bundler/parcel/blob/v2/${loc.filename}#L${
      loc.start.line
    }"><i>${loc.filename}:${loc.start.line}</i></a>
</h4>

${description ? `<p>${description}</p>` : ""}
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
<pre><code>${type}</code></pre>
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
