const server = require('@cypress/vite-dev-server')

module.exports = (on, config) => {
  on('dev-server:start', async(options) => {
    return server.startDevServer({ options })
  })

  return config
}
