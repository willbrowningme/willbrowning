require('dotenv').config()
const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all')
const path = require('path')
const axios = require('axios')
const marked = require('marked')
const collect = require('collect.js')

const perPage = Number(process.env.PER_PAGE)

class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
  }
}

module.exports = {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Will Browning - Personal Blog',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Hi I\'m Will Browning, a self-taught web developer from the UK. I blog about Laravel, Vue and Tailwind amongst other things.' },
      { hid: 'author', name: 'author', content: 'Will Browning' },
      { property: 'og:type', content: 'article' },
      { hid: 'og:title', property: 'og:title', content: 'Will Browning - Personal Blog' },
      { hid: 'og:description', property: 'og:description', content: 'Hi I\'m Will Browning, a self-taught web developer from the UK. I blog about Laravel, Vue and Tailwind amongst other things.' },
      { hid: 'og:image', property: 'og:image', content: 'https://willbrowning.me/handstand.jpg' },
      { property: 'twitter:card', content: 'summary' },
      { property: 'twitter:site', content: '@willbrowningme' },
      { hid: 'twitter:title', property: 'twitter:title', content: 'Will Browning - Personal Blog' },
      { hid: 'twitter:description', property: 'twitter:description', content: 'Hi I\'m Will Browning, a self-taught web developer from the UK. I blog about Laravel, Vue and Tailwind amongst other things.' },
      { hid: 'twitter:image', property: 'twitter:image', content: 'https://willbrowning.me/handstand.jpg' },
      { hid: 'msapplication-TileColor', name: 'msapplication-TileColor', content: '#00aba9' },
      { hid: 'theme-color', name: 'theme-color', content: '#ffffff' }
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
    ]
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/sitemap',
    '@nuxtjs/feed',
  ],
  axios: {
    browserBaseURL: '/'
  },
  plugins: [
    '~/plugins/vue-filters'
  ],
  css: [
    '~/assets/css/main.css',
    'highlight.js/styles/dracula.css',
  ],
  generate: {
    routes: async () => {
      const { data } = await axios.post(process.env.POSTS_URL,
      JSON.stringify({
          filter: { published: true },
          sort: {_created:-1},
          populate: 1
        }),
      {
        headers: { 'Content-Type': 'application/json' }
      })

      const collection = collect(data.entries)

      const tags = collection.map(post => post.tags)
      .flatten()
      .unique()
      .map(tag => {
        let payload = collection.filter(item => {
          return collect(item.tags).contains(tag)
        }).all()

        return {
          route: `category/${tag}`,
          payload: payload
        }
      }).all()

      const posts = collection.map((post, key) => {
        return {
          route: post.title_slug,
          payload: {
            post: post,
            prevPost: collection.get(key+1),
            nextPost: collection.get(key-1)
          }
        }
      }).all()

      if(perPage < data.total) {
        const pages = collection
        .take(perPage-data.total)
        .chunk(perPage)
        .map((items, key) => {
          let page = key+2
          return {
            route: `blog/${page}`,
            payload: {
              posts: items.all(),
              hasNext: page*perPage < data.total,
              totalPages: Math.ceil(data.total / perPage)
            }
          }
        }).all()

        return posts.concat(tags,pages)
      }

      return posts.concat(tags)
    }
  },
  sitemap: {
    path: '/sitemap.xml',
    hostname: process.env.URL,
    cacheTime: 1000 * 60 * 15,
    generate: true, // Enable me when using nuxt generate
    async routes () {
      const { data } = await axios.post(process.env.POSTS_URL,
      JSON.stringify({
          filter: { published: true },
          sort: {_created:-1}
        }),
      {
        headers: { 'Content-Type': 'application/json' }
      })

      const collection = collect(data.entries)

      const tags = collection.map(post => post.tags)
      .flatten()
      .unique()
      .map(tag => `category/${tag}`).all()

      const posts = collection.map(post => post.title_slug).all()

      if(perPage < data.total) {
        const pages = collection
        .take(perPage-data.total)
        .chunk(perPage)
        .map((items, page) => `blog/${page+2}`).all()

        return posts.concat(tags,pages)
      }

      return posts.concat(tags)
    }
  },
  feed: [
    {
      path: '/feed.xml', // The route to your feed.
      create: async feed => {
        feed.options = {
          title: 'Will Browning - Feed',
          id: process.env.URL+'/feed.xml',
          link: process.env.URL+'/feed.xml',
          description: 'A feed for willbrowning.me',
          favicon: process.env.URL+'/favicon.ico',
          copyright: 'All rights reserved, Will Browning'
        }

        const { data } = await axios.post(process.env.POSTS_URL,
        JSON.stringify({
            filter: { published: true },
            sort: {_created:-1}
          }),
        {
          headers: { 'Content-Type': 'application/json' }
        })

        data.entries.forEach(post => {
          feed.addItem({
            title: post.title,
            link: `${process.env.URL}/${post.title_slug}`,
            id: `${process.env.URL}/${post.title_slug}`,
            description: post.meta_description,
            content: marked(post.content),
            date: new Date(post._created*1000),
          })
        })
      },
      cacheTime: 1000 * 60 * 15, // How long should the feed be cached
      type: 'atom1' // Can be: rss2, atom1, json1
    }
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev }) {
      if (!isDev) {
        // Remove unused CSS using purgecss. See https://github.com/FullHuman/purgecss
        // for more information about purgecss.
        config.plugins.push(
          new PurgecssPlugin({

            // Specify the locations of any files you want to scan for class names.
            paths: glob.sync([
              path.join(__dirname, 'pages/**/*.vue'),
              path.join(__dirname, 'layouts/**/*.vue'),
              path.join(__dirname, 'components/**/*.vue')
            ]),
            extractors: [
              {
                extractor: TailwindExtractor,

                // Specify the file extensions to include when scanning for
                // class names.
                extensions: ["html", "vue"]
              }
            ],
            whitelist: [
              "html",
              "body",
              "ul",
              "ol",
              "pre",
              "code",
              "blockquote",
              "blog-image",
              "blog-note",
              "blog-image",
              "mt-4"
            ],
            whitelistPatterns: [/\bhljs\S*/]
          })
        )
      }
    }
  }
}
