<template>
  <section class="posts">
    <div class="my-8">
      <PostList :posts="posts" />
      <div class="flex justify-center mt-8">
        <a :href="page == 2 ? '/writings' : `/writings/${Number(page)-1}`" class="text-sm text-blue-400 font-sans no-underline pr-2">
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
        <a v-if="hasNext" :href="`/writings/${Number(page)+1}`" class="text-sm text-blue-400 font-sans no-underline pl-2">
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

<script setup>
const route = useRoute()
const config = useRuntimeConfig()
const page = route.params.page
const { data: allPosts } = await useMarkdownPosts()
const listing = paginatePosts(allPosts.value || [], page, Number(config.public.perPage))

if (Number(page) < 2 || !listing.posts.length || Number(page) !== listing.page) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const posts = listing.posts
const hasNext = listing.hasNext
const totalPages = listing.totalPages

useHead({
  title: `Writings - Page ${page}`
})
</script>
