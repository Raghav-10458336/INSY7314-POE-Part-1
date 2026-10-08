
'use strict'

// Represents an application error that is safe to show to the client.
class ApiError extends Error {
    constructor(status, message) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.isApiError = true
    }
}

// Standard messages for common HTTP errors.
const DEFAULT_MESSAGES = {
    400: 'invalid request',
    401: 'unauthorized',
    403: 'forbidden',
    404: 'not found',
    409: 'conflict',
    429: 'too many requests'
}

// Handle errors consistently without exposing sensitive details.
function errorHandler(err, req, res, next) {
    // Handle invalid MongoDB ObjectIds and other casting errors.
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: 'invalid request'
        })
    }

    // Handle Mongoose validation failures.
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'invalid request'
        })
    }

    // Handle duplicate MongoDB values, such as registered emails.
    if (err.code === 11000) {
        return res.status(409).json({
            error: 'resource already exists'
        })
    }

    // Only expose messages from trusted application errors.
    const isTrustedError = err instanceof ApiError &&
        Number.isInteger(err.status) &&
        err.status >= 400 &&
        err.status <= 599

    const status = isTrustedError ? err.status : 500

    const message = isTrustedError
        ? err.message
        : DEFAULT_MESSAGES[status] || 'something went wrong'

    // Log unexpected errors on the server, never in API responses.
    if (status === 500) {
        console.error('Unexpected API error:', {
            method: req.method,
            path: req.originalUrl,
            message: err.message
        })
    }

    res.status(status).json({
        error: message
    })
}

module.exports = errorHandler
module.exports.ApiError = ApiError
