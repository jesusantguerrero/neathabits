const { teal, red, green } = require('tailwindcss/colors')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: teal[500],
          ...teal,
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
