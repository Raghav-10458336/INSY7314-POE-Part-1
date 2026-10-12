import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from './AuthContext.jsx'
import { useAuth } from './useAuth'

const mocks = vi.hoisted(() => ({
    loginUser: vi.fn(),
    getCurrentUser: vi.fn()
}))

vi.mock('../api/authApi', () => ({
    loginUser: mocks.loginUser,
    getCurrentUser: mocks.getCurrentUser
}))

function Probe() {
    const { user, loading, login, logout } = useAuth()
    const [failed, setFailed] = useState(false)

    if (loading) {
        return <p>loading</p>
    }

    return (
        <div>
            <p>{user ? `signed in as ${user.role}` : 'signed out'}</p>
            {failed && <p>login failed</p>}
            <button
                onClick={() =>
                    login('freya@example.com', 'Hustle#2026pass').catch(() =>
                        setFailed(true)
                    )
                }
            >
                sign in
            </button>
            <button onClick={logout}>sign out</button>
        </div>
    )
}

function renderProbe() {
    return render(
        <AuthProvider>
            <Probe />
        </AuthProvider>
    )
}

describe('AuthProvider', () => {
    beforeEach(() => {
        mocks.loginUser.mockReset()
        mocks.getCurrentUser.mockReset()
    })

    it('starts signed out when there is no stored token', async () => {
        renderProbe()

        expect(await screen.findByText('signed out')).toBeInTheDocument()
        expect(mocks.getCurrentUser).not.toHaveBeenCalled()
    })

    it('restores the user from a stored token', async () => {
        sessionStorage.setItem('authToken', 'stored.token.value')
        mocks.getCurrentUser.mockResolvedValue({ user: { id: 'u1', role: 'freelancer' } })
        renderProbe()

        expect(await screen.findByText('signed in as freelancer')).toBeInTheDocument()
    })

    it('drops a stored token the server no longer accepts', async () => {
        sessionStorage.setItem('authToken', 'stale.token.value')
        mocks.getCurrentUser.mockRejectedValue({ response: { status: 401 } })
        renderProbe()

        expect(await screen.findByText('signed out')).toBeInTheDocument()
        expect(sessionStorage.getItem('authToken')).toBeNull()
    })

    it('keeps the token when the server cannot be reached', async () => {
        sessionStorage.setItem('authToken', 'stored.token.value')
        mocks.getCurrentUser.mockRejectedValue(new Error('Network Error'))
        renderProbe()

        expect(await screen.findByText('signed out')).toBeInTheDocument()
        expect(sessionStorage.getItem('authToken')).toBe('stored.token.value')
    })

    it('stores the token and exposes the user after login', async () => {
        mocks.loginUser.mockResolvedValue({ token: 'new.token.value' })
        mocks.getCurrentUser.mockResolvedValue({ user: { id: 'u2', role: 'client' } })
        const user = userEvent.setup()
        renderProbe()

        await user.click(await screen.findByRole('button', { name: 'sign in' }))

        expect(await screen.findByText('signed in as client')).toBeInTheDocument()
        expect(sessionStorage.getItem('authToken')).toBe('new.token.value')
    })

    it('clears the token on logout', async () => {
        mocks.loginUser.mockResolvedValue({ token: 'new.token.value' })
        mocks.getCurrentUser.mockResolvedValue({ user: { id: 'u2', role: 'client' } })
        const user = userEvent.setup()
        renderProbe()

        await user.click(await screen.findByRole('button', { name: 'sign in' }))
        await screen.findByText('signed in as client')
        await user.click(screen.getByRole('button', { name: 'sign out' }))

        expect(await screen.findByText('signed out')).toBeInTheDocument()
        expect(sessionStorage.getItem('authToken')).toBeNull()
    })

    it('does not keep a token when the user lookup after login fails', async () => {
        mocks.loginUser.mockResolvedValue({ token: 'new.token.value' })
        mocks.getCurrentUser.mockRejectedValue(new Error('Network Error'))
        const user = userEvent.setup()
        renderProbe()

        await user.click(await screen.findByRole('button', { name: 'sign in' }))

        expect(await screen.findByText('login failed')).toBeInTheDocument()
        expect(screen.getByText('signed out')).toBeInTheDocument()
        expect(sessionStorage.getItem('authToken')).toBeNull()
    })
})
