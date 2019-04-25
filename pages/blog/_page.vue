<template>
  <section class="posts">
    <div class=my-8>
      <post-list :posts="posts"/>
      <div class="flex justify-center mt-8">
        <a :href="page == 2 ? '/' : `/blog/${Number(page)-1}`" class="text-sm text-blue-400 font-sans no-underline pr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="13"
            height="13"
            class="fill-current stroke-current inline text-blue-400 align-middle"
          >
            <path d="M8.828 7.071l4.95 4.95a1 1 0 1 1-1.414 1.414L6.707 7.778a1 1 0 0 1 0-1.414L12.364.707a1 1 0 0 1 1.414 1.414l-4.95 4.95zm-6 0l4.95 4.95a1 1 0 1 1-1.414 1.414L.707 7.778a1 1 0 0 1 0-1.414L6.364.707a1 1 0 1 1 1.414 1.414l-4.95 4.95z"></path>
          </svg>
          Previous
        </a>
        <a v-if="hasNext" :href="`/blog/${Number(page)+1}`" class="text-sm text-blue-400 font-sans no-underline pl-2">
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="13"
            height="13"
            class="fill-current stroke-current inline text-blue-400 align-middle ml-1"
          >
            <path d="M11.314 7.071l-4.95-4.95A1 1 0 0 1 7.778.707l5.657 5.657a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 0 1-1.414-1.414l4.95-4.95zm-6 0l-4.95-4.95A1 1 0 1 1 1.778.707l5.657 5.657a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 0 1-1.414-1.414l4.95-4.95z"></path>
          </svg>
        </a>
      </div>
      <div class="text-center text-sm text-gray-700 mt-4">
        Page {{ page }} of {{ totalPages }}
      </div>
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
    if (payload) {
      return {
        posts: payload.posts,
        page: params.page,
        hasNext: payload.hasNext,
        totalPages: payload.totalPages
      }
    } else {
      const { data } = await app.$axios.post(process.env.POSTS_URL,
      JSON.stringify({
          filter: { published: true },
          limit: process.env.PER_PAGE,
          skip: (params.page-1)*process.env.PER_PAGE,
          sort: {_created:-1}
        }),
      {
        headers: { 'Content-Type': 'application/json' }
      })

      if (!data.entries[0]) {
        return error({ message: '404 Page not found', statusCode: 404 })
      }

      return {
        posts: data.entries,
        page: params.page,
        hasNext: params.page * process.env.PER_PAGE < data.total,
        totalPages: Math.ceil(data.total / process.env.PER_PAGE)
      }
    }
  },
  head() {
    return {
      title: `Will Browning - Blog Page ${this.page}`
    }
  }
}
</script>
