'use strict'

const fs = require('fs')
const path = require('path')
const https = require('https')
const crypto = require('crypto')

const LOG_DIR = process.env.LOG_DIR || path.join(__dirname, '..', 'logs')
const APP_LOG = path.join(LOG_DIR, 'application.log')
const ERROR_LOG = path.join(LOG_DIR, 'error.log')

const SENSITIVE_KEYS = new Set([
    'password',
    'token',
    'authorization',
    'cookie',
    'jwt',
    'secret',
    'sourcetoken',
    'accesstoken',
    'refreshtoken',
    'jwt_secret',
    'mongo_uri',
    'betterstack_source_token'
])

function ensureLogDirectory() {
    fs.mkdirSync(LOG_DIR, { recursive: true })
}

function hashValue(value) {
    if (!value) return null
    return crypto
        .createHash('sha256')
        .update(String(value))
        .digest('hex')
        .slice(0, 16)
}

function sanitize(value, key = '') {
    if (SENSITIVE_KEYS.has(String(key).toLowerCase())) {
        return '[REDACTED]'
    }

    if (Array.isArray(value)) {
        return value.map(item => sanitize(item))
    }

    if (value && typeof value === 'object') {
        const clean = {}
        for (const [childKey, childValue] of Object.entries(value)) {
            clean[childKey] = sanitize(childValue, childKey)
        }
        return clean
    }

    if (typeof value === 'string') {
        const redacted = value
            .replace(/Bearer\s+[A-Za-z0-9._~+\/-]+=*/gi, 'Bearer [REDACTED]')
            .replace(/mongodb(?:\+srv)?:\/\/[^\s]+/gi, '[REDACTED_MONGODB_URI]')

        if (redacted.length > 500) {
            return `${redacted.slice(0, 500)}...[TRUNCATED]`
        }

        return redacted
    }

    return value
}

function sendToBetterStack(entry) {
    const host = process.env.BETTERSTACK_INGESTING_HOST
    const token = process.env.BETTERSTACK_SOURCE_TOKEN

    if (!host || !token) return

    const payload = JSON.stringify(entry)

    const request = https.request({
        hostname: host.replace(/^https?:\/\//, '').replace(/\/$/, ''),
        path: '/',
        method: 'POST',
        timeout: 2500,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    })

    request.on('timeout', () => request.destroy())
    request.on('error', () => {
        // Monitoring must never interrupt the application request path.
    })

    request.write(payload)
    request.end()
}

function write(level, event, metadata = {}) {
    ensureLogDirectory()

    const entry = sanitize({
        dt: new Date().toISOString(),
        level,
        service: 'hustlehub-backend',
        event,
        ...metadata
    })

    const line = `${JSON.stringify(entry)}\n`
    fs.appendFileSync(APP_LOG, line, 'utf8')

    if (level === 'error') {
        fs.appendFileSync(ERROR_LOG, line, 'utf8')
    }

    if (process.env.NODE_ENV !== 'test') {
        const output = level === 'error' ? console.error : console.log
        output(JSON.stringify(entry))
    }

    sendToBetterStack(entry)
}

module.exports = {
    info(event, metadata) {
        write('info', event, metadata)
    },
    warn(event, metadata) {
        write('warn', event, metadata)
    },
    error(event, metadata) {
        write('error', event, metadata)
    },
    hashValue,
    sanitize
}
