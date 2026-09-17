import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { loadMarkdownPosts } from './lib/load-markdown-posts.mjs'
import { perPage } from './lib/parse-post.mjs'

const rootDir = dirname(fileURLToPath(import.meta.url))

const siteUrl = (process.env.URL || 'https://willbrowning.me').replace(/\/$/, '')
const postsPerPage = perPage()

function prerenderRoutes() {
  const posts = loadMarkdownPosts()
  const tags = [...new Set(posts.flatMap(post => post.tags || []))]
  const routes = [
    '/',
    '/writings',
    '/newsletter',
    '/topics',
    '/feed.xml',
    ...posts.map(post => `/${post.title_slug}`),
    ...tags.map(tag => `/category/${tag}`)
  ]

  if (posts.length > postsPerPage) {
    const totalPages = Math.ceil(posts.length / postsPerPage)
    for (let page = 2; page <= totalPages; page++) {
      routes.push(`/writings/${page}`)
    }
  }

  return routes
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/sitemap'
  ],
  css: [
    'highlight.js/styles/base16/dracula.css'
  ],
  runtimeConfig: {
    public: {
      turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || '',
      siteUrl,
      perPage: postsPerPage
    }
  },
  site: {
    url: siteUrl,
    name: 'Will Browning'
  },
  app: {
    head: {
      title: 'Will Browning',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Hi I\'m Will Browning, a self-taught software developer from the UK.' },
        { name: 'author', content: 'Will Browning' },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: 'Will Browning' },
        { property: 'og:description', content: 'Hi I\'m Will Browning, a self-taught software developer from the UK.' },
        { property: 'og:image', content: 'https://willbrowning.me/handstand.jpg' },
        { property: 'twitter:card', content: 'summary' },
        { property: 'twitter:site', content: '@willbrowningme' },
        { property: 'twitter:title', content: 'Will Browning' },
        { property: 'twitter:description', content: 'Hi I\'m Will Browning, a self-taught software developer from the UK.' },
        { property: 'twitter:image', content: 'https://willbrowning.me/handstand.jpg' },
        { name: 'msapplication-TileColor', content: '#00aba9' },
        { name: 'theme-color', content: '#ffffff' }
      ],
      link: [
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' }
      ],
      script: [
        {
          src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
          defer: true
        }
      ]
    }
  },
  nitro: {
    externals: {
      inline: [
        /[\\/]lib[\\/]/,
        /[\\/]app[\\/]utils[\\/]markdown/
      ]
    },
    prerender: {
      crawlLinks: false,
      routes: prerenderRoutes()
    }
  },
  sitemap: {
    urls: prerenderRoutes()
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css'
  },
  vite: {
    server: {
      fs: {
        allow: [rootDir]
      }
    }
  }
})
