const path = require('path');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    {
      name: "@storybook/addon-postcss",
      options:{
        postcssLoaderOptions: {
          implementation: require('postcss')
        }
      }
    }
  ],
  "framework": "@storybook/vue3",
   webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'vue-style-loader', 'css-loader', 'sass-loader'
      ],
      include: path.resolve(__dirname, '../src'),
    })

    return config;
  },
}