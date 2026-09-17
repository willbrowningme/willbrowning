<template>
  <section>
    <article v-if="post" class="my-8">
      <div class="tags text-gray-600 font-bold font-sans text-sm tracking-wider">
        <span>{{ toDate(post._created) }} (Updated: {{ toDate(post._modified) }})</span>
        <span class="dot-divider"></span>
        <a v-for="(tag, key) in post.tags" :key="key" :href="`/category/${tag}`" class="text-pink no-underline">#{{ tag }}</a>
        <span class="dot-divider"></span>
        <span>{{ readTime(post.content) }}</span>
      </div>
      <h1 class="mt-2">
        {{ post.title }}
      </h1>
      <div class="page-content markdown" v-html="toHtml(post.meta_description + '\n\n' + post.content)">
      </div>

      <Subscribe :key="post.title_slug" />

      <PageNav :prev-post="prevPost" :next-post="nextPost" />

    </article>
  </section>
</template>

<script setup>
const route = useRoute()
const config = useRuntimeConfig()
const { data: allPosts } = await useMarkdownPosts()
const result = getPostBySlug(allPosts.value || [], route.params.title_slug)

if (!result) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const post = result.post
const prevPost = result.prevPost
const nextPost = result.nextPost

const siteUrl = String(config.public.siteUrl || 'https://willbrowning.me').replace(/\/$/, '')
const imagePath = post.image
  ? (/^https?:\/\//.test(post.image) ? post.image : siteUrl + post.image)
  : siteUrl + '/handstand.jpg'

useHead({
  title: post.title,
  meta: [
    { name: 'description', content: post.meta_description },
    { property: 'og:title', content: post.title },
    { property: 'og:description', content: post.meta_description },
    { property: 'og:image', content: imagePath },
    { property: 'twitter:site', content: post.title },
    { property: 'twitter:title', content: post.title },
    { property: 'twitter:description', content: post.meta_description },
    { property: 'twitter:image', content: imagePath }
  ]
})
</script>
