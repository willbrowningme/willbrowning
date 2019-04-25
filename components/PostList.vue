<template>
  <ul class="flex flex-col w-full p-0">
    <li class="mb-6 w-full" v-for="(post, key) in posts" :key="key">
      <div class="tags text-gray-600 font-bold font-sans text-xs tracking-wider">
        <span class="text-sm">{{ post._created | toDate }}</span>
        <span class="dot-divider"></span>
        <a v-for="(tag, key) in post.tags" :key="key" :href="`/category/${tag}`">#{{ tag }}</a>
        <span class="dot-divider"></span>
        <span>{{ post.content | readTime }}</span>
      </div>

      <a :href="`/${post.title_slug}`">
        <h2 class="my-2 text-gray-800 text-lg lg:text-xl">
          {{ post.title }}
        </h2>
      </a>

      <div class="page-content hidden md:block text-base mb-2" v-html="excerpt(post)"></div>

      <a class="text-sm text-blue-400 font-sans" :href="`/${post.title_slug}`">
        Read more
      </a>
    </li>
  </ul>
</template>

<script>
export default {
  props: ['posts'],
  methods: {
    excerpt(post) {
      return this.$options.filters.parseExcerpt(post.meta_description + '\n' + post.content, 250)
    }
  }
}
</script>
