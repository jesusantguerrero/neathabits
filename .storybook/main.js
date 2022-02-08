const path = require('path');
const Icons = require('unplugin-icons/vite');
const IconsResolver = require('unplugin-icons/resolver');
const Components = require('unplugin-vue-components/vite');
const AutoImport = require('unplugin-auto-import/vite');

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
  core: {
    "builder": "storybook-builder-vite",
  },
  async viteFinal(config) {
    config.resolve.alias['~/'] = `${path.resolve(__dirname, '..', 'src')}/`;

    config.plugins = [...config.plugins,
        // https://github.com/antfu/unplugin-icons
        Icons({
          autoInstall: true,
        }),

        // https://github.com/antfu/unplugin-auto-import
        AutoImport({
          imports: [
            'vue',
            'vue-router',
            'vue-i18n',
            '@vueuse/head',
            '@vueuse/core',
            'vitest',
          ],
          dts: 'src/auto-imports.d.ts',
        }),

        // https://github.com/antfu/unplugin-vue-components
        Components({
          // allow auto load markdown components under `./src/components/`
          extensions: ['vue', 'md'],

          // allow auto import and register components used in markdown
          include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

          // custom resolvers
          resolvers: [
            // auto import icons
            // https://github.com/antfu/unplugin-icons
            IconsResolver({
              prefix: false,
              // enabledCollections: ['carbon']
            }),
          ],

          dts: 'src/components.d.ts',
        }),
    ];

    return config;
  },
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