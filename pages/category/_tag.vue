<template>
  <section class="posts">
    <div class=my-8>
      <h1>Posts tagged with "{{ category }}"</h1>
      <post-list :posts="posts"/>
    </div>
  </section>
</template>

<script>
import PostList from '~/components/PostList.vue'

export default {
  components: {
    PostList
  },
  asyncData ({ params, error, payload }) {
    if (payload && payload.posts) {
      return { posts: payload.posts, category: payload.category || params.tag }
    }

    const { getPostsByTag } = require('~/lib/posts')
    const posts = getPostsByTag(params.tag)

    if (!posts.length) {
      return error({ message: '404 Page not found', statusCode: 404 })
    }

    return { posts, category: params.tag }
  },
  head() {
    return {
      title: `Posts tagged with ${this.category}`
    }
  }
}
</script>
