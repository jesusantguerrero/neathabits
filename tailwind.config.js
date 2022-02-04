const { red, green, blue } = require('tailwindcss/colors')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './node_modules/atmosphere-ui/**/*.vue',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: blue[500],
          ...blue,
        },
        error: {
          DEFAULT: red[400],
        },
        success: {
          DEFAULT: green[400],
        },
        warning: {
          DEFAULT: '#ffc107',
        },
      },
    },
  },
  plugins: [],
}
