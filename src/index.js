import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import express from 'express'
import path from 'path'

import bot from './bot.js'
config()

const __filename = fileURLToPath(import.meta.url)

const __dirname = path.dirname(__filename)

const port = process.env.PORT || 5000
const server = express()

server.disable('x-powered-by')
server.use(express.static(path.resolve(path.join(__dirname, 'public'))))
server.get('*', (_req, res) => {
  res.sendFile(path.resolve(path.join(__dirname, 'public/index.html')))
})

server.listen(port, () => {
  bot()
  console.log(`🚀 Server is running on port ${port} ✨`)
})
