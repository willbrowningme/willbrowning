<template>
  <section>
    <div class="my-8">
      <div class="page-content text-center md:text-left">
        <p class="mb-6">
          Topics covered in
          <a href="/writings">Writings</a>.
        </p>
        <ul class="topics">
          <li v-for="topic in topics" :key="topic.name" class="block mb-4">
            <a :href="`/category/${topic.name}`" class="flex justify-between text-white rounded px-4 py-2">
              <span class="capitalize">{{ topic.name }}</span>
              <span>{{ topic.count === 1 ? `${topic.count} post` : `${topic.count} posts` }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
const { data: allPosts } = await useMarkdownPosts()
const topics = getTopics(allPosts.value || [])

if (!topics.length) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

useHead({
  title: 'Topics - Will Browning'
})
</script>
