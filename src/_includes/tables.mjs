// Wraps tables so that wide ones scroll horizontally (see .table-wrapper in doc-styles.css), as a
// macro for <table> elements registered for the HTML transformer in .parcelrc.

const escape = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function table(content, attributes) {
  let attrs = Object.entries(attributes)
    .map(([name, value]) => ` ${name}="${escape(value)}"`)
    .join('');
  return `<div class="table-wrapper"><table${attrs}>${content}</table></div>`;
}
