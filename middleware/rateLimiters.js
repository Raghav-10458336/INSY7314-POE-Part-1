
const { rateLimit } = require('express-rate-limit')

// General protection against excessive API requests.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        error: 'Too many requests. Please try again later.'
    }
})

// Stricter protection against repeated login attempts.
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: {
        error: 'Too many login attempts. Please try again in 15 minutes.'
    }
})

// Prevent excessive account registration attempts.
const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        error: 'Too many registration attempts. Please try again later.'
    }
})

// Protect booking submissions against excessive repeated requests.
const bookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        error: 'Too many booking attempts. Please try again in 15 minutes.'
    }
})

module.exports = {
    apiLimiter,
    loginLimiter,
    registerLimiter,
    bookingLimiter
}
