/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/components/**/*.vue',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/app.vue',
    './app/error.vue'
  ],
  safelist: [
    'blog-image',
    'blog-note'
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          DEFAULT: '#ff214f',
          light: '#ffebf0'
        },
        purple: {
          DEFAULT: '#661cb7',
          light: '#eee3fc'
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
        'sans-serif'
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
        'Segoe UI Symbol'
      ],
      mono: [
        'SFMono-Regular',
        'Consolas',
        'Liberation Mono',
        'Menlo',
        'Courier',
        'monospace'
      ]
    },
    container: {
      center: true
    }
  }
}
