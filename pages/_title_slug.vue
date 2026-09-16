<template>
  <section>
    <article v-if="post" class="my-8">
      <div class="tags text-gray-600 font-bold font-sans text-sm tracking-wider">
        <span>{{ post._created | toDate }} (Updated: {{ post._modified | toDate }})</span>
        <span class="dot-divider"></span>
        <a v-for="(tag, key) in post.tags" :key="key" :href="`/category/${tag}`" class="text-pink no-underline">#{{ tag }}</a>
        <span class="dot-divider"></span>
        <span>{{ post.content | readTime }}</span>
      </div>
      <h1 class="mt-2">
        {{ post.title }}
      </h1>
      <div class="page-content markdown" v-html="toHtml(post.meta_description + '\n\n' + post.content)">
      </div>

      <subscribe :key="post.title_slug"/>

      <page-nav :prevPost="prevPost" :nextPost="nextPost"/>

    </article>
  </section>
</template>

<script>
import Subscribe from '~/components/Subscribe.vue'
import PageNav from '~/components/PageNav.vue'

export default {
  components: {
    Subscribe,
    PageNav
  },
  async asyncData ({ app, params, error, payload }) {
    if (payload && payload.post) {
      return {
        post: payload.post,
        prevPost: payload.prevPost,
        nextPost: payload.nextPost
      }
    }

    const { data } = await app.$axios.post(process.env.POSTS_URL,
    JSON.stringify({
        filter: { published: true, title_slug: params.title_slug },
        sort: {_created:-1},
        populate: 1
      }),
    {
      headers: { 'Content-Type': 'application/json' }
    })

    if (!data.entries || !data.entries[0]) {
      return error({ message: '404 Page not found', statusCode: 404 })
    }

    return {
      post: data.entries[0],
      prevPost: null,
      nextPost: null
    }
  },
  head() {
    if (!this.post) {
      return {}
    }

    const imagePath = this.post.image && this.post.image.path
      ? 'https://api.willbrowning.me/storage/uploads' + this.post.image.path
      : 'https://willbrowning.me/handstand.jpg'

    return {
      title: this.post.title,
      meta: [
        { hid: 'description', name: 'description', content: this.post.meta_description },
        { hid: 'og:title', property: 'og:title', content: this.post.title },
        { hid: 'og:description', property: 'og:description', content: this.post.meta_description },
        { hid: 'og:image', property: 'og:image', content: imagePath },
        { hid: 'twitter:site', property: 'twitter:site', content: this.post.title },
        { hid: 'twitter:title', property: 'twitter:title', content: this.post.title },
        { hid: 'twitter:description', property: 'twitter:description', content: this.post.meta_description },
        { hid: 'twitter:image', property: 'twitter:image', content: imagePath }
      ]
    }
  },
  methods: {
    toHtml(content) {
      return this.$options.filters.parseMd(content)
    }
  }
}
</script>
