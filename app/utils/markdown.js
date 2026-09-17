import highlightjs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import scss from 'highlight.js/lib/languages/scss'
import css from 'highlight.js/lib/languages/css'
import php from 'highlight.js/lib/languages/php'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import go from 'highlight.js/lib/languages/go'
import markdown from 'highlight.js/lib/languages/markdown'
import nginx from 'highlight.js/lib/languages/nginx'
import python from 'highlight.js/lib/languages/python'
import yaml from 'highlight.js/lib/languages/yaml'
import xml from 'highlight.js/lib/languages/xml'
import { marked, Renderer } from 'marked'

highlightjs.registerLanguage('bash', bash)
highlightjs.registerLanguage('scss', scss)
highlightjs.registerLanguage('css', css)
highlightjs.registerLanguage('php', php)
highlightjs.registerLanguage('javascript', javascript)
highlightjs.registerLanguage('json', json)
highlightjs.registerLanguage('go', go)
highlightjs.registerLanguage('markdown', markdown)
highlightjs.registerLanguage('nginx', nginx)
highlightjs.registerLanguage('python', python)
highlightjs.registerLanguage('yaml', yaml)
highlightjs.registerLanguage('xml', xml)

const renderer = new Renderer()
renderer.code = (code, language) => {
  const validLang = !!(language && highlightjs.getLanguage(language))
  const highlighted = validLang ? highlightjs.highlight(code, { language }).value : code
  return `<pre class="md ${language}"><code class="hljs ${language}">${highlighted}</code></pre>`
}

marked.setOptions({ renderer })

export function parseMarkdown(content) {
  return marked.parse(content)
}
