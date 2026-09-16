---
title: Reducing the Vendor Bundle Size in Nuxt.js
title_slug: reducing-the-vendor-bundle-size-in-nuxt-js
published: true
created: 2018-07-03T14:39:24.000Z
modified: 2019-07-17T14:14:22.000Z
meta_description: "When running Nuxt's \"npm run generate\" command I kept getting a warning stating that the javascript vendor bundle was too big on my static blog and that it was above the recommended 300kB size limit. Let's have a look at trying to reduce the size of it!"
image: /images/posts/5b3b8b4fd4f28build-analyser-after.png
tags:
  - nuxt
---

The warning in question looks like this:

<div class="blog-image">
    
![Vendor Warning](/images/posts/5b3b8772f2991vendor-warning-nuxt.png) 
</div>

Our vendor bundle is coming in at 752kB!

## Identifying the Main Culprits

First things first we need to find out why our vendor bundle is so big in the first place.

Luckily Nuxt uses [webpack-bundle-analyzer](webpack-bundle-analyzer) so we can simply add the following to our `nuxt.config.js` under the build property.

```javascript
build: {
  analyze: true,
}
```

Then when you run `npm run generate` it will open up the build analyser at `http://127.0.0.1:8888`.

<div class="blog-image">
    
![Build Analyser](/images/posts/5b3b8641cc701build-analyser.png) 
</div>

Looking at this we can see the `highlight.js` package is very big with a parsed size of 540kB!

If we inspect this further we can see this is mainly due to a few languages included with it like mathematica.js or sqf.js.

Now in my case I only use a handful of common languages so I don't need any of the other included ones.

## Including Only Highlight.js Languages We Need

After a little bit of searching I came across [this comment](https://github.com/isagalaev/highlight.js/issues/1257#issuecomment-254504876) on GitHub on how to acheive this.

So let's give it a try and update our Nuxt site.

I have a `filters.js` in the plugins directory where I was importing highlight.js.

I updated the import to the following: (I was previously doing `import hljs from 'highlight.js'`)

```javascript
import hljs from 'highlight.js/lib/highlight.js'
```
Then simply specify which languages you want to register like so:

```javascript
hljs.registerLanguage('php', require('highlight.js/lib/languages/php'))
hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
hljs.registerLanguage('css', require('highlight.js/lib/languages/css'))
```

Make sure to only add the languages that you intend to use.

## Also Update Highlight.js In Build > Vendor

I also had `Highlight.js` in the vendor file importing all of the languages, so I simply updated this aswell:

```javascript
build: {
  vendor: ['axios', 'highlight.js/lib/highlight.js'],
  analyze: true,
}
```

<div class="blog-note">
    <b>Note: </b> The vendor array has been deprecated in Nuxt 2.0
</div>

Then ran `npm run generate` again and had a look at the build analyser.

## The Result

This time the vendor bundle was only 226kB in parsed size, down from 752kB! That's a 70% decrease just from removing uneeded languages. 

<div class="blog-image">
    
![Build Analyser](/images/posts/5b3b8b4fd4f28build-analyser-after.png) 
</div>

As you can see we reduced the Highlight.js package down to 31.53kB from 540kB.

And since our vendor bundle is now less than 300kB we no longer get the annoying warning in our terminal. `Success`!

Another example we can use is with moment.js, which is usually overkill if you are only doing some basic date formatting.

Another library that is much more lightweight and has a similar API is [day.js](https://github.com/iamkun/dayjs).

If we remove moment.js and run `npm install dayjs --save` to replace it with day.js then we can simply do the following:

```javascript
const dayjs = require('dayjs')
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)

Vue.filter('toDate', function(timestamp) {
  return dayjs(timestamp*1000).format('Do MMM YY')
})
```

The reason we needed to import the advancedFormat plugin for day.js is simply because 'Do' is not included in the default day.js installation.

We can now format dates in the same way as with moment but using a much smaller library.

I'll try to add more examples here in the future.
