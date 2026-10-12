import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginPage from './LoginPage'

const { login } = vi.hoisted(() => ({ login: vi.fn() }))

vi.mock('../context/useAuth', () => ({
    useAuth: () => ({ login })
}))

function renderLogin() {
    return render(
        <MemoryRouter initialEntries={['/login']}>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/my-gigs" element={<p>freelancer home</p>} />
                <Route path="/client" element={<p>client home</p>} />
                <Route path="/register" element={<p>register page</p>} />
            </Routes>
        </MemoryRouter>
    )
}

async function signIn(user) {
    await user.type(screen.getByLabelText('Email address'), 'freya@example.com')
    await user.type(screen.getByLabelText('Password'), 'Hustle#2026pass')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))
}

describe('LoginPage', () => {
    beforeEach(() => {
        login.mockReset()
    })

    it('shows the sign in form', () => {
        renderLogin()

        expect(
            screen.getByRole('heading', { name: 'Sign in to your account' })
        ).toBeInTheDocument()
        expect(screen.getByLabelText('Email address')).toBeInTheDocument()
        expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
        expect(
            screen.getByRole('link', { name: 'Create an account' })
        ).toHaveAttribute('href', '/register')
    })

    it('passes the email and password to login', async () => {
        login.mockResolvedValue({ role: 'client' })
        const user = userEvent.setup()
        renderLogin()

        await signIn(user)

        expect(login).toHaveBeenCalledWith('freya@example.com', 'Hustle#2026pass')
    })

    it('sends a freelancer to their gigs', async () => {
        login.mockResolvedValue({ role: 'freelancer' })
        const user = userEvent.setup()
        renderLogin()

        await signIn(user)

        expect(await screen.findByText('freelancer home')).toBeInTheDocument()
    })

    it('sends a client to their dashboard', async () => {
        login.mockResolvedValue({ role: 'client' })
        const user = userEvent.setup()
        renderLogin()

        await signIn(user)

        expect(await screen.findByText('client home')).toBeInTheDocument()
    })

    it('shows the message from the server when sign in fails', async () => {
        login.mockRejectedValue({
            response: { data: { error: 'invalid email or password' } }
        })
        const user = userEvent.setup()
        renderLogin()

        await signIn(user)

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'invalid email or password'
        )
    })

    it('falls back to a general message when the server gives none', async () => {
        login.mockRejectedValue(new Error('Network Error'))
        const user = userEvent.setup()
        renderLogin()

        await signIn(user)

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'Unable to sign in. Please try again.'
        )
    })

    it('shows and hides the password', async () => {
        const user = userEvent.setup()
        renderLogin()

        await user.click(screen.getByRole('button', { name: 'Show password' }))
        expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')

        await user.click(screen.getByRole('button', { name: 'Hide password' }))
        expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
    })

    it('locks the button while the request is running', async () => {
        login.mockReturnValue(new Promise(() => {}))
        const user = userEvent.setup()
        renderLogin()

        await signIn(user)

        expect(
            await screen.findByRole('button', { name: 'Signing in...' })
        ).toBeDisabled()
    })
})
