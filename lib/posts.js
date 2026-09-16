const { parsePost, sortPosts, perPage } = require('./parse-post')

function loadPosts() {
  const ctx = require.context('../content/posts', false, /\.md$/)
  const posts = ctx.keys()
    .map(key => {
      const raw = ctx(key)
      const text = typeof raw === 'string' ? raw : (raw && raw.default) || ''
      return parsePost(text)
    })
    .filter(Boolean)

  return sortPosts(posts)
}

function getPostBySlug(slug) {
  const posts = loadPosts()
  const index = posts.findIndex(post => post.title_slug === slug)

  if (index === -1) {
    return null
  }

  return {
    post: posts[index],
    prevPost: posts[index + 1] || null,
    nextPost: posts[index - 1] || null
  }
}

function paginate(page) {
  const size = perPage()
  const posts = loadPosts()
  const total = posts.length
  const pageNum = Math.max(1, Number(page) || 1)
  const start = (pageNum - 1) * size

  return {
    posts: posts.slice(start, start + size),
    hasNext: pageNum * size < total,
    totalPages: Math.max(1, Math.ceil(total / size)),
    total,
    page: pageNum
  }
}

function getPostsByTag(tag) {
  return loadPosts().filter(post => (post.tags || []).indexOf(tag) !== -1)
}

function getTopics() {
  const counts = {}

  loadPosts().forEach(post => {
    (post.tags || []).forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1
    })
  })

  return Object.keys(counts)
    .map(name => ({ name, count: counts[name] }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

module.exports = {
  loadPosts,
  getPostBySlug,
  paginate,
  getPostsByTag,
  getTopics,
  perPage
}
