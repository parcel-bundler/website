// Syntax highlighting for code blocks, as a macro for <pre> elements (registered for the HTML
// transformer in .parcelrc).
//
// A code block's language comes from its <code class="language-...">. Lines can be highlighted by
// appending them to the language, zero-indexed, e.g. ```json/2-4 or ```js/0,3. With two groups
// (e.g. ```js/1/2), the first marks added lines and the second removed ones.
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/index.js');
const { languages: components } = require('prismjs/components.json');
loadLanguages.silent = true;

// Language names and aliases (e.g. js, ts, shell) to Prism's names.
const aliases = new Map();
for (let [name, { alias }] of Object.entries(components)) {
  if (name === 'meta') continue;
  aliases.set(name, name);
  for (let a of [alias ?? []].flat()) {
    aliases.set(a, name);
  }
}

function grammar(language) {
  let name = aliases.get(language);
  if (!name) {
    return null;
  }
  if (!Prism.languages[name]) {
    loadLanguages([name]);
  }
  return Prism.languages[name] ?? null;
}

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = (s) => escape(s).replace(/"/g, '&quot;');

function unescape(s) {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

/** Parses e.g. "3,7-9" into a set of line numbers. */
function parseLines(spec = '') {
  let lines = new Set();
  for (let range of spec.split(',')) {
    let [start, end = start] = range.trim().split('-').map((n) => parseInt(n, 10));
    for (let i = start; i <= end; i++) {
      lines.add(i);
    }
  }
  return lines;
}

/** Wraps each line in a span, or a mark/ins/del if it is highlighted. */
function wrapLines(html, spec) {
  let groups = spec.split('/');
  let [highlighted, added, removed] =
    groups.length === 2 ? [new Set(), parseLines(groups[0]), parseLines(groups[1])] : [parseLines(groups[0]), new Set(), new Set()];

  return html
    .split('\n')
    .slice(0, -1) // The last line is empty.
    .map((line, i) => {
      // A token spanning multiple lines (e.g. a comment) can't be wrapped per line.
      if (line.split('<span').length !== line.split('</span').length) {
        return line;
      }
      if (highlighted.has(i)) return `<mark class="highlight-line highlight-line-active">${line}</mark>`;
      if (added.has(i)) return `<ins class="highlight-line highlight-line-add">${line}</ins>`;
      if (removed.has(i)) return `<del class="highlight-line highlight-line-remove">${line}</del>`;
      return `<span class="highlight-line">${line}</span>`;
    })
    .join('<br>');
}

/** Highlights `text`, or returns null if the language isn't supported. */
function highlight(text, language) {
  if (language === 'text') {
    return escape(text);
  }
  let g = grammar(language);
  if (!g) {
    return null;
  }
  // Markdown highlights the code blocks inside it only in languages that are already loaded.
  if (aliases.get(language) === 'markdown') {
    for (let [, lang] of text.matchAll(/^\s*(?:```|~~~)\s*([\w-]+)/gm)) {
      grammar(lang);
    }
  }
  return Prism.highlight(text, g, language);
}

const CODE = /<code(\s[^>]*)?>([^<]*)<\/code>/g;
const LANGUAGE = /\sclass="(?:[^"]*\s)?language-([^"\s/]+)(?:\/([^"\s]*))?/;

export function pre(content, attributes) {
  let attrs = Object.entries(attributes)
    .map(([name, value]) => ` ${name}="${escapeAttr(value)}"`)
    .join('');

  // A code block from markdown: <pre><code class="language-js">...</code></pre>, where the language
  // may specify lines to highlight (e.g. language-js/1-2).
  let markdown = attrs === '' && content.match(/^\s*<code class="language-([^"\s/]+)(?:\/([^"\s]*))?">([^<]*)<\/code>\s*$/);
  if (markdown) {
    let [, language, lines, code] = markdown;
    let html = highlight(unescape(code), language);
    if (html == null) {
      return `<pre>${content}</pre>`;
    }
    html = lines != null ? wrapLines(html, lines) : html.replace(/\n$/, '').split('\n').join('<br>');
    return `<pre class="language-${language}"><code class="language-${language}">${html}</code></pre>`;
  }

  // Hand-written HTML (e.g. the home page) keeps its markup, and each <code class="language-...">
  // in the <pre> is highlighted in place. A <code> without a language is left as is.
  content = content.replace(CODE, (code, codeAttrs = '', text) => {
    let language = codeAttrs.match(LANGUAGE)?.[1];
    let html = language && highlight(unescape(text), language);
    return html == null ? code : `<code${codeAttrs}>${html}</code>`;
  });
  return `<pre${attrs}>${content}</pre>`;
}
