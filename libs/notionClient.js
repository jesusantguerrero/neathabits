const { Client } = require('@notionhq/client')
const notionAPIKey = process.env.NOTION_API_KEY || ''

// Initializing a client
module.exports.notionClient = new Client({
  auth: notionAPIKey,
})
