'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const logger = require('../services/logger')

test('logger sanitizes common secret fields recursively', () => {
    const clean = logger.sanitize({
        password: 'SuperSecret123!',
        token: 'jwt-value',
        nested: {
            authorization: 'Bearer abc',
            safe: 'visible'
        }
    })

    assert.equal(clean.password, '[REDACTED]')
    assert.equal(clean.token, '[REDACTED]')
    assert.equal(clean.nested.authorization, '[REDACTED]')
    assert.equal(clean.nested.safe, 'visible')
})

test('logger hashes identifiers deterministically without exposing the original value', () => {
    const first = logger.hashValue('user@example.com')
    const second = logger.hashValue('user@example.com')

    assert.equal(first, second)
    assert.notEqual(first, 'user@example.com')
    assert.equal(first.length, 16)
})
