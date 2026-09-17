<template>
  <section class="posts">
    <div class="my-8">
      <div class="page-content page text-center md:text-left mb-8">
        <p>
          Older posts on Laravel, Vue, Nuxt and related tools.
        </p>
      </div>
      <PostList :posts="posts" />
      <div v-if="hasNext" class="flex flex-col items-center mt-8">
        <a href="/writings/2" class="text-sm text-blue-400 font-sans no-underline">
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

<script setup>
const config = useRuntimeConfig()
const { data: allPosts } = await useMarkdownPosts()
const listing = paginatePosts(allPosts.value || [], 1, Number(config.public.perPage))

if (!listing.posts.length) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const posts = listing.posts
const hasNext = listing.hasNext
const totalPages = listing.totalPages

useHead({
  title: 'Writings - Will Browning'
})
</script>
