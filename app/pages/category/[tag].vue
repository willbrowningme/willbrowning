<template>
  <section class="posts">
    <div class="my-8">
      <h1>Posts tagged with "{{ category }}"</h1>
      <PostList :posts="posts" />
    </div>
  </section>
</template>

<script setup>
const route = useRoute()
const category = route.params.tag
const { data: allPosts } = await useMarkdownPosts()
const posts = getPostsByTag(allPosts.value || [], category)

if (!posts.length) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

useHead({
  title: `Posts tagged with ${category}`
})
</script>
