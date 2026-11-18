// Macros for code samples and API names, registered as custom elements for the HTML transformer
// (including markdown pages) in .parcelrc:
//
//   <code-sample>            Files side by side (or stacked with layout="column").
//   <code-migration>         Files before and after a change, with an arrow between them.
//   <code-file name="...">   One file in a sample or migration, labeled with its name.
//   <code-tabs>              Code blocks in different languages, as tabs (see code-tabs.js).
//   <api-name js="...">      An API name in prose, in the language selected in the tabs.
//
// Each receives its content as HTML, with any markdown inside already compiled, and nested
// custom elements (e.g. <code-file>) are expanded after their parent's output.

const escape = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function sample(content, { layout }) {
  return (
    `<figure class="well sample ${layout === 'column' ? 'column' : 'row'}">` +
    `<div class="assets">${content}</div>` +
    `</figure>`
  );
}

export function file(content, { name, migration }) {
  // Migrations label files as "<em>name</em>:", samples as "<em>name:</em>".
  let label = !name ? '' : migration != null ? `<em>${escape(name)}</em>:` : `<em>${escape(name)}:</em>`;
  return `<div class="asset">${label}${content}</div>`;
}

export function migration(content) {
  let files = content.match(/<code-file\b/g)?.length ?? 0;
  let assets = content
    .replace(/<code-file\b/g, '<code-file migration')
    // An arrow between the before and after files, or before a lone "after" file.
    .replace(/(<\/code-file>)\s*(<code-file\b)/g, '$1<div class="arrow"></div>$2');
  if (files === 1) {
    assets = '<div class="arrow"></div>' + assets;
  }
  return `<figure class="well warning migration"><div class="assets">${assets}</div></figure>`;
}

const languages = {
  javascript: { key: 'js', label: 'JavaScript' },
  js: { key: 'js', label: 'JavaScript' },
  rust: { key: 'rust', label: 'Rust' },
  go: { key: 'go', label: 'Go' },
  swift: { key: 'swift', label: 'Swift' },
};

// A stable id for a set of tabs. Ids are derived from the content rather than a counter, so they
// don't depend on how many other tabs were rendered before (e.g. on other pages, or in a rebuild).
function hash(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

/** Renders consecutive code blocks as tabs, one per language. */
export function codeTabs(content) {
  let id = `code-tabs-${hash(content)}`;
  let blocks = [...content.matchAll(/<pre\b[^>]*>[\s\S]*?<\/pre>/g)].map(([code]) => {
    let language = code.match(/\blanguage-(\w+)/)?.[1];
    let lang = languages[language];
    if (!lang) {
      throw new Error(`Unknown language in <code-tabs>: ${language}`);
    }
    return { ...lang, code };
  });

  let tabs = blocks.map(
    ({ key, label }, i) =>
      `<button type="button" role="tab" id="${id}-${key}" aria-controls="${id}-${key}-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-lang="${key}">${label}</button>`
  );
  let panels = blocks.map(
    ({ key, code }, i) =>
      `<div role="tabpanel" id="${id}-${key}-panel" aria-labelledby="${id}-${key}" data-lang="${key}"${i === 0 ? '' : ' hidden'}>${code}</div>`
  );

  return (
    `<div class="code-tabs" data-langs="${blocks.map((b) => b.key).join(' ')}">` +
    `<div role="tablist" aria-label="Language">${tabs.join('')}</div>` +
    panels.join('') +
    `</div>`
  );
}

/**
 * An API name in prose that switches along with the code tabs, e.g.
 * <api-name js="asset.getCode()" rust="asset.content()"></api-name>.
 * The first language given is shown before the script runs.
 */
export function apiName(content, names) {
  let entries = Object.entries(names);
  let keys = new Set(Object.values(languages).map((l) => l.key));
  for (let [lang] of entries) {
    if (!keys.has(lang)) {
      throw new Error(`Unknown language in <api-name>: ${lang}`);
    }
  }

  return (
    `<span class="api-name" data-langs="${entries.map(([lang]) => lang).join(' ')}">` +
    entries
      .map(([lang, name], i) => `<code data-lang="${lang}"${i === 0 ? '' : ' hidden'}>${escape(name)}</code>`)
      .join('') +
    `</span>`
  );
}
