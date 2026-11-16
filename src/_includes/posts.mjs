// Blog post metadata, read from each post's source. The title is its <title> if it has one, or
// otherwise its first <h1>, like the markdown transformer's `title` option. The navigation shows a
// shorter label instead if the <h1> has a data-nav-title attribute. The date is its
// article:published_time.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const blogDir = fileURLToPath(new URL('../blog', import.meta.url));

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const unescape = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

function getTitle(source) {
  // Only a <title> in the metadata at the top of the post counts, not e.g. one in an inline SVG.
  let title = source.match(/^(?:\s*<(?:meta|link|base)\b[^>]*>)*\s*<title>(.*?)<\/title>/s)?.[1];
  let html = title ?? source.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1];
  if (html != null) {
    return unescape(html.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();
  }
  return source.match(/^# (.+)$/m)?.[1].trim();
}

/**
 * All blog posts, newest first. `path` is relative to the blog directory, and links to a post
 * reference its source (relative to where the macro is called), which Parcel rewrites to its URL.
 * `url` is the post's public URL, for the feed.
 */
export function getPosts() {
  return fs
    .globSync('*/*.md', { cwd: blogDir })
    .map((file) => {
      let source = fs.readFileSync(path.join(blogDir, file), 'utf8');
      let title = getTitle(source) ?? file;
      return {
        path: file,
        url: `/blog/${path.dirname(file)}/`,
        title,
        date: source.match(/<meta property="article:published_time" content="([^"]+)"/)?.[1] ?? '',
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.path.localeCompare(b.path));
}

/** Blog navigation list items. */
export function nav() {
  return getPosts()
    .map((post) => `<li><a href="../blog/${escape(post.path)}">${escape(post.title)}</a></li>`)
    .join('\n');
}

/** A link to the newest post, e.g. for the Blog section of the header. */
export function latestLink(content, attributes) {
  let [post] = getPosts();
  let attrs = Object.entries(attributes)
    .map(([name, value]) => ` ${name}="${escape(value)}"`)
    .join('');
  return `<a href="../blog/${escape(post.path)}"${attrs}>${content}</a>`;
}

const SITE_URL = 'https://parceljs.org';

/**
 * Atom <updated> and <entry> elements for every post, for feed.xml. Paths are relative to src,
 * where the macro is called. Each entry's content is the post without the site layout, via the
 * `fragment:` pipeline in .parcelrc.
 */
export function feed() {
  let posts = getPosts();
  let toRfc3339 = (date) => `${date}T00:00:00Z`;
  // Oldest first, like the previous feed. Readers sort entries by date anyway.
  let entries = [...posts].reverse().map((post) => {
    let content = `<parcel:include src="fragment:blog/${escape(post.path)}"></parcel:include>`;
    return `<entry>
    <title>${escape(post.title)}</title>
    <link href="${SITE_URL}${escape(post.url)}"/>
    <updated>${toRfc3339(post.date)}</updated>
    <id>${SITE_URL}${escape(post.url)}</id>
    <content type="html">${escape(content)}</content>
  </entry>`;
  });
  return `<updated>${toRfc3339(posts[0].date)}</updated>\n  ${entries.join('\n  ')}`;
}

/** Redirects /blog/ to the newest post. */
export function redirect() {
  let [post] = getPosts();
  let href = escape(post.path);
  return `<meta http-equiv="refresh" content="0; url=${href}">
<p>Redirecting to <a href="${href}">${escape(post.title)}</a>…</p>`;
}
