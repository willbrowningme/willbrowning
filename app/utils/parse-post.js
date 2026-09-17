import matter from 'gray-matter'

function toUnix(value) {
  if (value == null || value === '') {
    return 0
  }

  if (typeof value === 'number') {
    return value > 1e12 ? Math.floor(value / 1000) : Math.floor(value)
  }

  const ms = new Date(value).getTime()
  return Number.isNaN(ms) ? 0 : Math.floor(ms / 1000)
}

export function parsePost(raw) {
  const { data, content } = matter(String(raw || ''))

  if (data.published === false) {
    return null
  }

  const tags = Array.isArray(data.tags) ? data.tags.filter(Boolean) : []

  return {
    title: data.title,
    title_slug: data.title_slug,
    tags,
    meta_description: data.meta_description || '',
    content: String(content || '').trim(),
    image: data.image || '',
    _created: toUnix(data.created),
    _modified: toUnix(data.modified)
  }
}

export function sortPosts(posts) {
  return posts.slice().sort((a, b) => b._created - a._created)
}
