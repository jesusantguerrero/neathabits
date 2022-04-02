import path from 'path'
import { startDevServer } from '@cypress/vite-dev-server'
/* eslint-env node */
// ***********************************************************
// This example plugins/index.ts can be used to load plugins

export default (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('dev-server:start', (options) => {
    return startDevServer({
      options,
      viteConfig: {
        configFile: path.resolve(__dirname, '..', '..', 'vite.config.ts'),
      },
    })
  })
  return config
}
