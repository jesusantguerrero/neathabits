require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { getResources } = require('./libs/getDatabase')
const app = express()

app.use(cors())
app.get('/resources', async(_req, res) => {
  const resources = await getResources('bfc6a539ce814a398b41f94d9f1e9aba')
  return res.json(resources)
})

app.get('/', async(_req, res) => {
  res.send('Welcome to supadown API')
})

app.listen(process.env.PORT || 5000)
