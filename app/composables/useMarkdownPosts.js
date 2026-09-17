import { loadPosts } from '~/utils/posts'

export function useMarkdownPosts() {
  return useAsyncData('markdown-posts', () => loadPosts(), {
    default: () => []
  })
}
