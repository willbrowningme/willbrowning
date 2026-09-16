---
title: "Building a Static Blog with Nuxt.js and Cockpit Headless CMS - Part 4: Post Pagination"
title_slug: building-a-static-blog-with-nuxt-js-and-cockpit-headless-cms-part-4-post-pagination
published: true
created: 2018-11-12T12:15:17.000Z
modified: 2019-10-01T14:07:20.000Z
meta_description: This is just an additional post for our Nuxt Cockpit series looking at handling pagination for our blog posts when we statically generate our site.
image: /images/posts/5be984f90c881nuxt-pagination.png
tags:
  - nuxt
  - cockpit
---

If you haven't read Parts 1, 2, and 3 of this guide you can find them here:
- [Part 1: Setup](https://willbrowning.me/building-a-static-blog-with-nuxt-js-and-cockpit-headless-cms-part-1-setup/)
- [Part 2: Dynamic Routes](https://willbrowning.me/building-a-static-blog-with-nuxt-js-and-cockpit-headless-cms-part-2-dynamic-routes)
- [Part 3: Deployment](https://willbrowning.me/building-a-static-blog-with-nuxt-js-and-cockpit-headless-cms-part-3-deployment/)

## Adding Pagination to our Blog

Open up your .env file and add the following variable to it 

```env
PER_PAGE=2
```

We're setting it low on purpose so we can easily see the pagination in action. 

Then at the top of nuxt.config.js add this line:

```javascript
const perPage = Number(process.env.PER_PAGE)
```

Now that we have our perPage variable we can update our generate: property by adding the following just below `let posts = ...`

```javascript
if(perPage < data.total) {
  let pages = collection
  .take(perPage-data.total)
  .chunk(perPage)
  .map((items, key) => {
    let currentPage = key + 2
    
    return {
      route: `blog/${currentPage}`,
      payload: {
        posts: items.all(),
        hasNext: data.total > currentPage*perPage
      }
    }
  }).all()

  return posts.concat(tags,pages)
}
```

So breaking this down, first we check if the value we have set to display per page is less than the total number of blog posts.

If it is less and for example we have set 10 posts per page but there are 25 posts in total. Then with the `take` method we take (10 - 25) which equals -15 posts. The negative integer means we want to take 15 posts from the end of the posts collection. More information on this is in the [collectjs docs](https://github.com/ecrmnn/collect.js/#take).

The reason we only want to take from the end of the collection is because we do not want to include the first page of posts as this is currently already set as our blog's home page. (We already have 10 posts on the home page that we don't need to include for pagination)

Next we chunk the 15 posts we've got by the `perPage` variable, so we would have 10 and 5 in two chunks.

Then we simply map these items into their respective pages, where `currentPage` is the key that we add 2 onto since the first chunk will have a key of 0 however we want this to effectively be our page 2 (as we're going to count our home page as page 1).

We pass the post items in each chunk as the payload to use and we also pass a `hasNext` variable that lets us know if there is another page or not. In our example here `data.total` is 25 as there are 25 posts in total. When we're in the second chunk that contains 5 posts the  chunk key will be 1 so we have (1 + 2)*10 which is 30. So `hasNext` will evaluate to false.

## Adding the Blog Page

We're going to set our blog up so that pages are found at `yourdomain.com/blog/2` etc. You can instead do `yourdomain.com/2`, `yourdomain.com/blog/page-2` or whatever you prefer.

In the pages directory create a new folder called `blog` and add a file named `_page.vue` to it. Put the following code inside:

```html
<template>
  <section>
    <div class=my-8>
      <h1 class="mb-6">Blog Page {{ page }}</h1>
      <ul class="flex flex-col w-full p-0">
        <li class="mb-6 w-full" v-for="(post, key) in posts" :key="key">
          <div class="text-gray-600 font-bold text-sm tracking-wide">
            {{ post._created | toDate }}
            <a v-for="(tag, key) in post.tags" :key="key" :href="'/category/'+tag" class="ml-1">{{ tag }}</a>
          </div>

          <a :href="'/'+post.title_slug">
            <h2 class="my-2 text-gray-800 text-lg lg:text-xl font-bold">
              {{ post.title }}
            </h2>
          </a>

          <div class="page-content hidden md:block text-base mb-2" v-html="post.excerpt">
          </div>
          <a class="text-sm text-blue-400" :href="'/'+post.title_slug">
            Read more
          </a>
        </li>
      </ul>
      <div class="flex justify-center mt-8">
        <a :href="page === '2' ? '/' : `/blog/${Number(page)-1}`" class="text-sm pr-2">
          Previous Page
        </a>
        <a v-if="hasNext" :href="`/blog/${Number(page)+1}`" class="text-sm pl-2">
          Next Page
        </a>
      </div>
    </div>
  </section>
</template>
```

```javascript
<script>
export default {
  async asyncData ({ app, params, error, payload }) {
    if (payload) {
      return { posts: payload.posts, page: params.page, hasNext: payload.hasNext }
    } else {
      let { data } = await app.$axios.post(process.env.POSTS_URL,
      JSON.stringify({
          filter: { published: true },
          limit: process.env.PER_PAGE,
          skip: (params.page-1)*process.env.PER_PAGE,
          sort: {_created:-1},
          populate: 1
        }),
      {
        headers: { 'Content-Type': 'application/json' }
      })

      if (!data.entries[0]) {
        return error({ message: '404 Page not found', statusCode: 404 })
      }

      return { posts: data.entries, page: params.page, hasNext: Number((params.page-1)*process.env.PER_PAGE) + Number(process.env.PER_PAGE) < data.total }
    }
  },
  head () {
    return {
      title: `Nuxt Cockpit Static Blog - Page ${this.page}`
    }
  }
}
</script>
```

Notice the limit and skip options we added when fetching the posts for the dev server.

When our blog has been generated it will be using the payload we passed through in nuxt.config.js.

We do a quick check to see if the current page is 2 when rendering the previous link as we don't want to link to `yourdomain.com/blog/1` as that page doesn't exist, we want to simply go back to the home page to display our first page of posts.

Head over to index.vue in pages and update that too so we have a next page if there is one available.

```html
<template>
  <section>
    <div class=my-8>
      <ul class="flex flex-col w-full p-0">
        <li class="mb-6 w-full" v-for="(post, key) in posts" :key="key">
          <div class="text-gray-600 font-bold text-sm tracking-wide">
            {{ post._created | toDate }}
            <a v-for="tag in post.tags" :key="tag" :href="'/category/'+tag" class="ml-1">{{ tag }}</a>
          </div>

          <a :href="'/'+post.title_slug">
            <h2 class="my-2 text-gray-800 text-lg lg:text-xl font-bold">
              {{ post.title }}
            </h2>
          </a>

          <div class="page-content hidden md:block text-base mb-2" v-html="post.excerpt">
          </div>
          <a class="text-sm text-blue-400" :href="'/'+post.title_slug">
            Read more
          </a>
        </li>
      </ul>
      <div v-if="hasNext" class="flex justify-center mt-8">
        <a href="/blog/2" class="text-sm">
          Next Page
        </a>
      </div>
    </div>
  </section>
</template>
```

```javascript
<script>
export default {
  async asyncData ({ app, error }) {
    const { data } = await app.$axios.post(process.env.POSTS_URL,
    JSON.stringify({
        filter: { published: true },
        limit: process.env.PER_PAGE,
        sort: {_created:-1},
        populate: 1
      }),
    {
      headers: { 'Content-Type': 'application/json' }
    })

    if (!data.entries[0]) {
      return error({ message: '404 Page not found', statusCode: 404 })
    }

    return { posts: data.entries, hasNext: process.env.PER_PAGE < data.total }
  }
}
</script>
```

Notice we've added the limit option when fetching our posts which is set to our `PER_PAGE` environment variable.

If you visit the site now you should see the home page with two posts and a next link. If you click next you'll be taken to `/blog/2` and depending on how many posts you've got in Cockpit you'll see a previous and next link on this page.

<div class="blog-image">

![Nuxt Pagination](/images/posts/5be984f90c881nuxt-pagination.png)
</div>

## Update our Netlify Script

We also need to remember to update our `create-env.js` file for Netlify.

```javascript
const fs = require('fs')
fs.writeFileSync('./.env', `
API_TOKEN=${process.env.API_TOKEN}\n
BASE_URL=${process.env.BASE_URL}\n
POSTS_URL=${process.env.POSTS_URL}\n
URL=${process.env.URL}\n
PER_PAGE=${process.env.PER_PAGE}
`)
```

Make sure to update your environment variables when you are logged into Netlify like we did in Part 3 so that `PER_PAGE` is included.

## Updating our Sitemap

We also need to update our sitemap otherwise it won't be aware of our new blog pages so open up nuxt.config.js and update it to the following:

```javascript
sitemap: {
  path: '/sitemap.xml',
  hostname: process.env.URL,
  cacheTime: 1000 * 60 * 15,
  generate: true, // Enable me when using nuxt generate
  async routes () {
    let { data } = await axios.post(process.env.POSTS_URL,
    JSON.stringify({
        filter: { published: true },
        sort: {_created:-1},
        populate: 1
      }),
    {
      headers: { 'Content-Type': 'application/json' }
    })

    const collection = collect(data.entries)

    let tags = collection.map(post => post.tags)
    .flatten()
    .unique()
    .map(tag => `category/${tag}`)
    .all()

    let posts = collection.map(post => post.title_slug).all()

    if(perPage < data.total) {
      let pages = collection
      .take(perPage-data.total)
      .chunk(perPage)
      .map((items, key) => `blog/${key+2}`)
      .all()

      return posts.concat(tags,pages)
    }

    return posts.concat(tags)
  }
},
```

Now at the moment we only have pagination set up for our blog posts from all categories. If we wanted to go further we could also set up pagination per category to something like `yourdomain.com/category/nuxt/2` etc.

Update your .env `PER_PAGE` variable to something sensible like 10 and you should be good to go!

You can check out the GitHub repo of the finished blog [here](https://github.com/willbrowningme/nuxt-cockpit-static-blog) and see a live demo of the site on Netlify here - [https://nuxt-cockpit-static-blog.netlify.com](https://nuxt-cockpit-static-blog.netlify.com/)
