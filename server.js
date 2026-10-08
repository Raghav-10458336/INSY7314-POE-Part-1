
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
const {
    apiLimiter,
    loginLimiter,
    registerLimiter
} = require('./middleware/rateLimiters')

const app = express()

// Allow the local React frontend and configured deployment origins.
const allowedOrigins = (
    process.env.FRONTEND_ORIGINS || 'http://localhost:5173'
)
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)

// Configure security headers, including an explicit Content Security Policy.
app.use(
    helmet({
        contentSecurityPolicy: {
            useDefaults: true,
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'"],
                imgSrc: ["'self'", 'data:'],
                fontSrc: ["'self'"],
                connectSrc: ["'self'"],
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                frameAncestors: ["'none'"],
                formAction: ["'self'"],
                upgradeInsecureRequests: null
            }
        }
    })
)

// Restrict browser requests to approved frontend origins.
app.use(
    cors({
        origin(origin, callback) {
            // Allow requests without an Origin header, such as Postman.
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true)
            }

            return callback(null, false)
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: false
    })
)

// Limit request body size to reduce unnecessary resource consumption.
app.use(express.json({ limit: '100kb' }))

// Apply general rate limiting to API endpoints.
app.use('/api', apiLimiter)

// Health check endpoint.
app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

// Apply stricter rate limiting to authentication endpoints.
app.use('/api/auth/login', loginLimiter)
app.use('/api/auth/register', registerLimiter)

// Register application routes.
app.use('/api/auth', authRoutes)
app.use('/api/gigs', gigRoutes)

// Member 3's booking routes will be registered during integration.

// Handle requests to unknown endpoints.
app.use((req, res) => {
    res.status(404).json({ error: 'not found' })
})

// Handle application errors centrally.
app.use(errorHandler)

const PORT = process.env.PORT || 5000

// Start HTTPS only after a successful database connection.
async function startServer() {
    try {
        await connectDB()

        const options = {
            key: fs.readFileSync(
                path.join(__dirname, 'certs', 'key.pem')
            ),
            cert: fs.readFileSync(
                path.join(__dirname, 'certs', 'cert.pem')
            )
        }

        https.createServer(options, app).listen(PORT, () => {
            console.log(`server running on https://localhost:${PORT}`)
        })
    } catch (err) {
        console.error('Server startup failed:', err.message)
        process.exit(1)
    }
}

// Prevent automatic server startup during automated tests.
if (require.main === module) {
    startServer()
}

module.exports = app
