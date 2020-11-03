module.exports = {
  purge: {
    mode: 'layers',
    content: [
      './pages/**/*.vue',
      './layouts/**/*.vue',
      './components/**/*.vue',
    ],
    options: {
      whitelist: [
        'html',
        'body',
        'ul',
        'ol',
        'pre',
        'code',
        'blockquote',
        'blog-image',
        'blog-note',
        'blog-image',
        'mt-4'
      ],
      whitelistPatterns: [/\bhljs\S*/]
    }
  },
  theme: {
    extend: {
      colors: {
          pink: {
            default: '#ff214f',
            light: '#ffebf0'
          },
          purple: {
            default: '#661cb7',
            light: '#eee3fc',
          }
      }
    },
    fontFamily: {
      sans: [
        'BlinkMacSystemFont',
        '-apple-system',
        'Segoe UI',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        'Fira Sans',
        'Droid Sans',
        'Helvetica Neue',
        'sans-serif',
      ],
      serif: [
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica',
        'Arial',
        'sans-serif',
        'Apple Color Emoji',
        'Segoe UI Emoji',
        'Segoe UI Symbol',
      ],
      mono: [
        'SFMono-Regular',
        'Consolas',
        'Liberation Mono',
        'Menlo',
        'Courier',
        'monospace',
      ]
    },
    container: {
      center: true
    },
  },
  variants: {
    // Some useful comment
  },
  plugins: [
    // Some useful comment
  ]
}
