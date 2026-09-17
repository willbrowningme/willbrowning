import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import removeMd from 'remove-markdown'
import { parseMarkdown } from '~/utils/markdown'

dayjs.extend(advancedFormat)

export function toDate(timestamp) {
  return dayjs(timestamp * 1000).format('Do MMM YY')
}

export function readTime(content) {
  const wordCount = removeMd(content).split(' ').length
  return Math.round(wordCount / 200.0) + ' min read'
}

export function excerpt(string, value = 250) {
  const content = removeMd(string)
  if (value >= content.length) {
    return content
  }
  return content.substring(0, value) + '...'
}

export function toHtml(content) {
  return parseMarkdown(content)
}
