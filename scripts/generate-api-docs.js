const fs = require('fs');
const path = require('path');
const invariant = require('assert');

const {parse} = require('@babel/parser');
const generate = require('@babel/generator').default;
const traverse = require('@babel/traverse').default;

let PARCEL_ROOT = process.argv[2];
invariant(PARCEL_ROOT, 'node scripts/generate-api-docs.js /path/to/parcel-monorepo')

const ROOT = '/Users/niklas/Documents/_dev/_git/parcel/parcel/';
const TYPES = true
  ? '/Users/niklas/Documents/_dev/_git/parcel/parcel/packages/core/types/index.js'
  : '/Users/niklas/Documents/_dev/_git/parcel/api-docs/x.js';

// ---------------------------

let collected = new Map();

let typeReferenced = new Map();
function replaceReferences(name, string) {
  for (let [n] of collected) {
    string = string.replace(
      new RegExp(`(^|\\W)(${n})($|\\W)`, 'g'),
      (_, l, type, r) => {
        if (n !== name) {
          let refs = typeReferenced.get(n);
          if (!refs) {
            refs = new Set();
            typeReferenced.set(n, refs);
          }
          refs.add(name);
        }
        return l + `<a href="#${type}">` + type + '</a>' + r;
      },
    );
  }
  return string;
}

function parseJsDoc(string) {
  let result = {
    description: '',
    properties: [],
  };

  if (string) {
    string = string
      .replace(/(?:\\\n)?^\s*\* ?/gm, '')
      .trim()
      .split('\n');
    for (let line of string) {
      if (line.startsWith('@')) {
        let type;
        if (line.startsWith('@property ')) {
          line = line.slice(10);
          type = 'property';
        } else if (line.startsWith('@method ')) {
          line = line.slice(8);
          type = 'method';
        } else if (line.startsWith('@param ')) {
          line = line.slice(7);
          type = 'param';
        } else {
          invariant(false, 'Unknown JSDoc directive: ' + line);
        }

        let space = line.indexOf(' ');
        let name = line.substring(0, space);
        let description = line.substring(space + 1);
        result.properties.push({
          type,
          name,
          description,
        });
      } else {
        if (line) {
          result.description += line + '\n';
        } else {
          result.description += `<br>`;
        }
      }
    }
  }
  return result;
}

function escapeHtml(str) {
  const tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  };
  return str.replace(/[&<>]/g, function(tag) {
    return tagsToReplace[tag] || tag;
  });
}

// ---------------------------

let ast = parse(fs.readFileSync(TYPES, 'utf8'), {
  sourceType: 'module',
  plugins: ['flow'],
  sourceFilename: path.relative(ROOT, TYPES),
});

traverse(ast, {
  ExportNamedDeclaration(path) {
    let {node} = path;
    let jsdoc = node.leadingComments && node.leadingComments[0];
    collected.set(node.declaration.id.name, {
      declaration: node.declaration,
      loc: node.loc,
      jsdoc: jsdoc && jsdoc.value.startsWith('*') && jsdoc.value,
    });
    path.skip();
  },
  TypeAlias({node}) {
    let jsdoc = node.leadingComments && node.leadingComments[0];
    collected.set(node.id.name, {
      declaration: node,
      loc: node.loc,
      jsdoc: jsdoc && jsdoc.value.startsWith('*') && jsdoc.value,
    });
  },
});

let generated = new Map();
for (let [name, {declaration, loc, jsdoc}] of collected) {
  let parsedJsDoc = parseJsDoc(jsdoc);

  generated.set(name, {
    type: replaceReferences(
      name,
      escapeHtml(generate(declaration, {comments: false}).code.trim()),
    ),
    jsdoc: {
      description: replaceReferences(name, parsedJsDoc.description),
      properties: parsedJsDoc.properties.map(prop => ({
        name: prop.name,
        type: prop.type,
        description: replaceReferences(name, prop.description),
      })),
    },
    loc,
  });
}

console.log(`<html>
<head>
<style>
  .api .type {
   margin: 2rem 0;
   padding: 0.4rem 1rem;
   border: 1px solid #eee;
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
`);

for (let [
  name,
  {
    type,
    jsdoc: {description, properties},
    loc,
  },
] of generated) {
  let props = properties.filter(({type}) => type === 'property');
  let methods = properties.filter(({type}) => type === 'method');
  let params = properties.filter(({type}) => type === 'param');
  let refs = typeReferenced.get(name);

  console.log(`<div class="type">

<h4 class="title">
  <span id="${name}">${name}</span>
  <a href="https://github.com/parcel-bundler/parcel/blob/v2/${loc.filename}#L${
    loc.start.line
  }"><i>${loc.filename}:${loc.start.line}</i></a>
</h4>

${description ? `<p>${description}</p>` : ''}
${
  props.length > 0
    ? `<h5>Property Descriptions</h5>` +
      `<ul>${props
        .map(p => `<li><b><code>${p.name}</code></b>: ${p.description}</p>`)
        .join('\n')}</ul>`
    : ''
}
${
  methods.length > 0
    ? `<h5>Method Descriptions</h5>` +
      `<ul>${methods
        .map(m => `<li><b><code>${m.name}</code></b>: ${m.description}</p>`)
        .join('\n')}</ul>`
    : ''
}
${
  params.length > 0
    ? `<h5>Parameter Descriptions</h5>` +
      `<ul>${params
        .map(m => `<li><b><code>${m.name}</code></b>: ${m.description}</p>`)
        .join('\n')}</ul>`
    : ''
}
<h5>Type</h5>
<pre><code>${type}</code></pre>
${
  refs && refs.size > 0
    ? `<h5>Referenced by:</h5>
${[...refs].map(v => `<a href="#${v}">${v}</a>`).join(', ')}`
    : ''
}
</div>`);
}

console.log(`</div></body></html>`);
