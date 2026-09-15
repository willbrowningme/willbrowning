const fs = require('fs')
const siteUrl = process.env.NETLIFY_RESERVED__URL || process.env.URL
fs.writeFileSync('./.env', `
BASE_URL=${process.env.BASE_URL}\n
POSTS_URL=${process.env.POSTS_URL}\n
URL=${siteUrl}\n
PER_PAGE=${process.env.PER_PAGE}\n
TURNSTILE_SITE_KEY=${process.env.TURNSTILE_SITE_KEY || ''}
`)