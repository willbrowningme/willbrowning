import { parsePost, sortPosts } from '~/utils/parse-post'

const modules = import.meta.glob('../../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
})

export function loadPosts() {
  return sortPosts(
    Object.values(modules)
      .map(raw => parsePost(raw))
      .filter(Boolean)
  )
}

export function getPostBySlug(posts, slug) {
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

export function paginatePosts(posts, page, size) {
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

export function getPostsByTag(posts, tag) {
  return posts.filter(post => (post.tags || []).includes(tag))
}

export function getTopics(posts) {
  const counts = {}

  posts.forEach(post => {
    (post.tags || []).forEach(tag => {
      counts[tag] = (counts[tag] || 0) + 1
    })
  })

  return Object.keys(counts)
    .map(name => ({ name, count: counts[name] }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}
