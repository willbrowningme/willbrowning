import { Feed } from 'feed'
import { loadMarkdownPosts } from '~~/lib/load-markdown-posts.mjs'
import { parseMarkdown } from '~~/app/utils/markdown.js'

export default defineEventHandler((event) => {
  const siteUrl = (process.env.URL || 'https://willbrowning.me').replace(/\/$/, '')
  const posts = loadMarkdownPosts()

  const feed = new Feed({
    title: 'Will Browning - Feed',
    id: `${siteUrl}/feed.xml`,
    link: `${siteUrl}/feed.xml`,
    description: 'A feed for willbrowning.me',
    favicon: `${siteUrl}/favicon.ico`,
    copyright: 'All rights reserved, Will Browning',
    author: {
      name: 'Will Browning',
      link: siteUrl
    }
  })

  posts.forEach((post) => {
    const url = `${siteUrl}/${post.title_slug}`
    feed.addItem({
      title: post.title,
      id: url,
      link: url,
      description: post.meta_description,
      content: parseMarkdown(post.content),
      date: new Date(post._created * 1000)
    })
  })

  setHeader(event, 'Content-Type', 'application/atom+xml; charset=utf-8')
  return feed.atom1()
})
