'use strict'

const logger = require('../services/logger')

function requestLogger(req, res, next) {
    const startedAt = Date.now()

    res.on('finish', () => {
        logger.info('http_request', {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            durationMs: Date.now() - startedAt,
            userId: req.user?.id || null,
            role: req.user?.role || null,
            ipHash: logger.hashValue(req.ip)
        })
    })

    next()
}

module.exports = requestLogger
