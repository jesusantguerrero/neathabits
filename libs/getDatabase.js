const { notionClient } = require('./notionClient')

exports.getResources = async(resourceId) => {
  return await notionClient.databases.query({
    database_id: resourceId,
    filter: {
      and: [{
        property: 'Type',
        select: {
          equals: 'Note',
        },
      },
      ],
    },
  })
}
