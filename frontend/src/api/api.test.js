import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import api from './api'

const originalAdapter = api.defaults.adapter

function reply(status, seen) {
    api.defaults.adapter = async config => {
        seen.config = config

        if (status >= 400) {
            throw Object.assign(new Error(`status ${status}`), {
                config,
                response: { status, data: {}, headers: {}, config }
            })
        }

        return { status, data: {}, headers: {}, config, statusText: 'OK' }
    }
}

describe('api client', () => {
    let expired

    beforeEach(() => {
        expired = vi.fn()
        window.addEventListener('auth:expired', expired)
    })

    afterEach(() => {
        window.removeEventListener('auth:expired', expired)
        api.defaults.adapter = originalAdapter
    })

    it('sends the stored token as a bearer header', async () => {
        const seen = {}
        sessionStorage.setItem('authToken', 'abc.def.ghi')
        reply(200, seen)

        await api.get('/gigs/my')

        expect(seen.config.headers.Authorization).toBe('Bearer abc.def.ghi')
    })

    it('sends no authorization header when there is no token', async () => {
        const seen = {}
        reply(200, seen)

        await api.get('/gigs')

        expect(seen.config.headers.Authorization).toBeUndefined()
    })

    it('clears the session and signals expiry when a signed in request gets 401', async () => {
        sessionStorage.setItem('authToken', 'expired.token.value')
        reply(401, {})

        await expect(api.get('/auth/me')).rejects.toBeDefined()

        expect(sessionStorage.getItem('authToken')).toBeNull()
        expect(expired).toHaveBeenCalledTimes(1)
    })

    it('does not signal expiry for a 401 without a token, such as a failed login', async () => {
        reply(401, {})

        await expect(api.post('/auth/login', {})).rejects.toBeDefined()

        expect(expired).not.toHaveBeenCalled()
    })

    it('keeps the session when the server fails for another reason', async () => {
        sessionStorage.setItem('authToken', 'valid.token.value')
        reply(500, {})

        await expect(api.get('/gigs/my')).rejects.toBeDefined()

        expect(sessionStorage.getItem('authToken')).toBe('valid.token.value')
        expect(expired).not.toHaveBeenCalled()
    })
})
