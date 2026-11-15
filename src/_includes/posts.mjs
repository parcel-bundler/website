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
