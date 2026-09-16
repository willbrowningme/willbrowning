<template>
  <section class="posts">
    <div class="my-8">
      <post-list :posts="posts"/>
      <div v-if="hasNext" class="flex flex-col items-center mt-8">
        <a href="/blog/2" class="text-sm text-blue-400 font-sans no-underline">
          Next
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            width="13"
            height="13"
            class="fill-current stroke-current inline text-blue-400 align-middle ml-1"
          >
            <path
              d="M11.314 7.071l-4.95-4.95A1 1 0 0 1 7.778.707l5.657 5.657a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 0 1-1.414-1.414l4.95-4.95zm-6 0l-4.95-4.95A1 1 0 1 1 1.778.707l5.657 5.657a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 0 1-1.414-1.414l4.95-4.95z"
            ></path>
          </svg>
        </a>
        <div class="text-sm text-gray-700 mt-4">Page 1 of {{ totalPages }}</div>
      </div>
    </div>
  </section>
</template>

<script>
import PostList from "~/components/PostList.vue"

export default {
  components: {
    PostList
  },
  asyncData({ error }) {
    const { paginate } = require('~/lib/posts')
    const data = paginate(1)

    if (!data.posts.length) {
      return error({ message: "404 Page not found", statusCode: 404 })
    }

    return {
      posts: data.posts,
      hasNext: data.hasNext,
      totalPages: data.totalPages
    }
  }
}
</script>
