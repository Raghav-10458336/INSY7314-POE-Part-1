
'use strict'

const logger = require('../services/logger')

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
    // Handle malformed JSON and oversized request bodies.
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            error: 'invalid request'
        })
    }

    if (err.type === 'entity.too.large') {
        return res.status(413).json({
            error: 'request too large'
        })
    }

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

    // Record errors without request bodies, credentials, tokens or stack traces.
    logger.error('api_error', {
        method: req.method,
        path: req.path,
        statusCode: status,
        message: isTrustedError ? err.message : 'internal server error',
        errorType: err.name || 'Error',
        userId: req.user?.id || null,
        role: req.user?.role || null,
        ipHash: logger.hashValue(req.ip)
    })

    res.status(status).json({
        error: message
    })
}

module.exports = errorHandler
module.exports.ApiError = ApiError
