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
  async asyncData ({ app, params, error, payload }) {
    /* if (payload) {
      return { posts: payload, category: params.tag }
    } else if(process.server) { */
      const { data } = await app.$axios.post(process.env.POSTS_URL,
      JSON.stringify({
          filter: { published: true, tags: { $has:params.tag } },
          sort: {_created:-1}
        }),
      {
        headers: { 'Content-Type': 'application/json' }
      })

      if (!data.entries[0]) {
        return error({ message: '404 Page not found', statusCode: 404 })
      }

      return { posts: data.entries, category: params.tag }
    //}
  },
  head() {
    return {
      title: `Posts tagged with ${this.category}`
    }
  }
}
</script>
