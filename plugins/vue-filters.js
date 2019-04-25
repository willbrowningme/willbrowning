import Vue from 'vue'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
dayjs.extend(advancedFormat)
import highlightjs from 'highlight.js/lib/highlight.js'
import marked, { Renderer } from 'marked'
import removeMd from 'remove-markdown'

// register used languages in highlightjs
highlightjs.registerLanguage('bash', require('highlight.js/lib/languages/bash'))
highlightjs.registerLanguage('scss', require('highlight.js/lib/languages/scss'))
highlightjs.registerLanguage('css', require('highlight.js/lib/languages/css'))
highlightjs.registerLanguage('php', require('highlight.js/lib/languages/php'))
highlightjs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'))
highlightjs.registerLanguage('json', require('highlight.js/lib/languages/json'))
highlightjs.registerLanguage('go', require('highlight.js/lib/languages/go'))
highlightjs.registerLanguage('markdown', require('highlight.js/lib/languages/markdown'))
highlightjs.registerLanguage('nginx', require('highlight.js/lib/languages/nginx'))
highlightjs.registerLanguage('python', require('highlight.js/lib/languages/python'))
highlightjs.registerLanguage('yaml', require('highlight.js/lib/languages/yaml'))
highlightjs.registerLanguage('xml', require('highlight.js/lib/languages/xml'))

// Create your custom renderer
const renderer = new Renderer()
renderer.code = (code, language) => {
  // Check whether the given language is valid for highlight.js
  const validLang = !!(language && highlightjs.getLanguage(language))
  // Highlight only if the language is valid
  const highlighted = validLang ? highlightjs.highlight(language, code).value : code
  // Render the highlighted code with `hljs` class
  return `<pre class="md ${language}"><code class="hljs ${language}">${highlighted}</code></pre>`
};

// Set the renderer to marked
marked.setOptions({ renderer })

Vue.filter('parseExcerpt', function(string, value) {
    let content = removeMd(string)
    if(value >= content.length){
        return content
    }
    return content.substring(0, value) + '...'
})

Vue.filter('toDate', function(timestamp) {
    return dayjs(timestamp*1000).format('Do MMM YY')
})

Vue.filter('parseMd', function(content) {
    return marked(content)
})

Vue.filter('readTime', function(content) {
    let wordCount = removeMd(content).split(' ').length
    return Math.round(wordCount / 200.0) + ' min read'
})