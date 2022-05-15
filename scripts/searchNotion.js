require('dotenv').config()
const { getResources } = require('../libs/getDatabase')

const main = async() => {
  const resources = await getResources('bfc6a539ce814a398b41f94d9f1e9aba')
  console.log(resources)
}

main()
