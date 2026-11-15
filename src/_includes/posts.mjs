// Blog post metadata, read from the <title> and article:published_time at the top of each post.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const blogDir = fileURLToPath(new URL('../blog', import.meta.url));

const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const unescape = (s) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

/** All blog posts, newest first. `path` is relative to the blog directory. */
export function getPosts() {
  return fs
    .globSync('*/*.md', { cwd: blogDir })
    .map((file) => {
      let source = fs.readFileSync(path.join(blogDir, file), 'utf8');
      return {
        path: file,
        title: unescape(source.match(/<title>(.*?)<\/title>/s)?.[1] ?? file),
        date: source.match(/<meta property="article:published_time" content="([^"]+)"/)?.[1] ?? '',
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.path.localeCompare(b.path));
}

/** Blog navigation list items. Links are relative to _includes, where the macro is called. */
export function nav() {
  return getPosts()
    .map((post) => `<li><a href="../blog/${escape(post.path)}">${escape(post.title)}</a></li>`)
    .join('\n');
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
  let entries = posts.map((post) => {
    let dir = path.dirname(post.path);
    let content = `<parcel:include src="fragment:blog/${escape(post.path)}"></parcel:include>`;
    return `<entry>
    <title>${escape(post.title)}</title>
    <link href="blog/${escape(post.path)}"/>
    <updated>${toRfc3339(post.date)}</updated>
    <id>${SITE_URL}/blog/${escape(dir)}/</id>
    <content type="html">${escape(content)}</content>
  </entry>`;
  });
  return `<updated>${toRfc3339(posts[0].date)}</updated>\n  ${entries.join('\n  ')}`;
}

/** Redirects /blog/ to the newest post. Paths are relative to src/blog, where the macro is called. */
export function redirect() {
  let [post] = getPosts();
  let href = escape(post.path);
  return `<meta http-equiv="refresh" content="0; url=${href}">
<p>Redirecting to <a href="${href}">${escape(post.title)}</a>…</p>`;
}
