---
title: Clearing Your Cloudflare Cache After New Deployments
title_slug: clearing-your-cloudflare-cache-after-new-deployments
published: true
created: 2018-08-07T16:10:36.000Z
modified: 2019-07-17T14:14:08.000Z
meta_description: "I had lost count of the number of times I've previously deployed new code to production, cleared browser cache and still been unable to see the changes. The reason being that Cloudflare was caching these files and still serving the old files. Luckily there is a really easy way to clear the cache and purge everything using the API."
image: /images/posts/5bcef7562b26ccloudflare-api.png
tags:
  - deployment
---

## Getting your Cloudflare API key

First we need to find our API key. So visit the "My Profile" section when logged into Cloudflare - [https://dash.cloudflare.com/profile](https://dash.cloudflare.com/profile) at the bottom of the page you'll see your keys.

<div class="blog-image">
    
![Cloudflare API keys](/images/posts/5bcef7562b26ccloudflare-api.png) 
</div>

We'll be using the Global API Key to clear the cache.

## Finding your sites Zone ID

The Zone ID for your website can be found in the "Overview" section for that site. It will look like this:

<div class="blog-image">
    
![Cloudflare Zone ID](/images/posts/5bcef944bce69cloudflare-zone-id.png) 
</div>

## Sending the API request

The request we'll be sending to clear the cache looks like this:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR-ZONE-ID/purge_cache" \
     -H "X-Auth-Email: YOUR-CLOUDFLARE-EMAIL" \
     -H "X-Auth-Key: YOUR-GLOBAL-API-KEY" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
```
Where `YOUR-CLOUDFLARE-EMAIL` is the email you use to login to Cloudflare. `YOUR-GLOBAL-API-KEY` is the key we found above and where `YOUR-ZONE-ID` is a unique identifier for your Cloudflare website.

You can add this code to the end of your deployment script to make sure the cache is purged after each deployment.

In the above example we're telling Cloudflare to purge everything but you can also choose which items to purge that have matching Cache-Tag headers or which hosts to purge although this does appear to be `only available for Enterprise accounts`.

```bash
--data '{
"tags":["some-tag","another-tag"],
"hosts":["www.example.com","images.example.com"]
}'
```

More documentation can be found here - [https://api.cloudflare.com/#zone-purge-files-by-cache-tags-or-host](https://api.cloudflare.com/#zone-purge-files-by-cache-tags-or-host)

If everything went to plan you should get a response from Cloudflare like so:

```bash
{
  "success": true,
  "errors": [],
  "messages": [],
  "result": {
    "id": "9a7806061c88ada191ed06f989cc3dac"
  }
}
```
