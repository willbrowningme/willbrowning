<template>
  <section>
    <div class="my-8">
      <div class="page-content text-center md:text-left">
        <p class="mb-6">
          Here are the topics I've discussed on this site. If you'd like to see more posts on a certain subject or would like to see something new just let me know on
          <a target="_blank" rel="nofollow noopener noreferrer" href="https://twitter.com/willbrowningme">Twitter</a>.
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

<script>
const collect = require("collect.js")

export default {
  head() {
    return {
      title: "Topics - Will Browning"
    }
  },
  async asyncData({ app, error }) {
    const { data } = await app.$axios.post(
      process.env.POSTS_URL,
      JSON.stringify({
        filter: { published: true },
        sort: { _created: -1 }
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    )

    if (!data.entries) {
      return error({ message: "404 Page not found", statusCode: 404 })
    }

    const collection = collect(data.entries)

    const topics = collection
      .map(post => post.tags)
      .flatten()
      .unique()
      .map(tag => {
        let count = collection
          .filter(item => {
            return collect(item.tags).contains(tag)
          })
          .count()

        return {
          name: tag,
          count: count
        }
      })
      .sortByDesc(topic => topic.count)
      .all()

    return { topics: topics }
  }
}
</script>
