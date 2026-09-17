import fs from 'node:fs'
import path from 'node:path'
import { parsePost, sortPosts } from './parse-post.mjs'

export function loadMarkdownPosts() {
  const dir = path.join(process.cwd(), 'content', 'posts')
  const files = fs.readdirSync(dir).filter(name => name.endsWith('.md'))
  const posts = files
    .map(name => parsePost(fs.readFileSync(path.join(dir, name), 'utf8')))
    .filter(Boolean)

  return sortPosts(posts)
}
