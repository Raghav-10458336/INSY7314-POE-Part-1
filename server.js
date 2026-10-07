require('dotenv').config()
const fs = require('fs')
const path = require('path')
const https = require('https')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const connectDB = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const gigRoutes = require('./routes/gigRoutes')
const errorHandler = require('./middleware/errorHandler')

const app = express()

connectDB()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/gigs', gigRoutes)

app.use((req, res, next) => {
  res.status(404).json({ error: 'not found' })
})

app.use(errorHandler)

// no certs yet? run: node generateCert.js
const options = {
  key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem'))
}

const PORT = process.env.PORT || 5000

https.createServer(options, app).listen(PORT, () => {
  console.log(`server running on https://localhost:${PORT}`)
})

module.exports = app


