<template>
  <ul class="flex flex-col w-full p-0">
    <li class="mb-6 w-full" v-for="(post, key) in posts" :key="key">
      <div class="tags text-gray-600 font-bold font-sans text-xs tracking-wider">
        <span class="text-sm">{{ toDate(post._created) }}</span>
        <span class="dot-divider"></span>
        <a v-for="(tag, tagKey) in post.tags" :key="tagKey" :href="`/category/${tag}`">#{{ tag }}</a>
        <span class="dot-divider"></span>
        <span>{{ readTime(post.content) }}</span>
      </div>

      <a :href="`/${post.title_slug}`">
        <h2 class="my-2 text-gray-800 text-lg lg:text-xl">
          {{ post.title }}
        </h2>
      </a>

      <div class="page-content hidden md:block text-base mb-2" v-html="excerptHtml(post)"></div>

      <a class="text-sm text-blue-400 font-sans" :href="`/${post.title_slug}`">
        Read more
      </a>
    </li>
  </ul>
</template>

<script setup>
import { toDate, readTime, excerpt } from '~/utils/format'

defineProps({
  posts: {
    type: Array,
    default: () => []
  }
})

function excerptHtml(post) {
  return excerpt(post.meta_description + '\n' + post.content, 250)
}
</script>
