const fs = require('fs')
const path = require('path')
const { parsePost, sortPosts } = require('./parse-post')

function loadMarkdownPosts() {
  const dir = path.join(__dirname, '..', 'content', 'posts')
  const files = fs.readdirSync(dir).filter(name => name.endsWith('.md'))
  const posts = files
    .map(name => parsePost(fs.readFileSync(path.join(dir, name), 'utf8')))
    .filter(Boolean)

  return sortPosts(posts)
}

module.exports = {
  loadMarkdownPosts
}
