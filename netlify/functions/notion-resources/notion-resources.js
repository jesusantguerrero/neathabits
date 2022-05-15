const { getResources } = require('../../../libs/getDatabase')

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async function(event) {
  try {
    const databaseId = event.queryStringParameters.database_id || ''
    const resources = await getResources(databaseId)
    return {
      statusCode: 200,
      body: JSON.stringify(resources),
    }
  }
  catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
