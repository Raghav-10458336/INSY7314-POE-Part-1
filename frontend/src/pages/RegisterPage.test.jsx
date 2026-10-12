import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RegisterPage from './RegisterPage'

const { registerUser } = vi.hoisted(() => ({ registerUser: vi.fn() }))

vi.mock('../api/authApi', () => ({ registerUser }))

function LoginStub() {
    const { state } = useLocation()

    return <p>{state?.message ?? 'login page'}</p>
}

function renderRegister() {
    return render(
        <MemoryRouter initialEntries={['/register']}>
            <Routes>
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginStub />} />
            </Routes>
        </MemoryRouter>
    )
}

async function fillForm(user, { password = 'Hustle#2026pass', confirm = password, role } = {}) {
    await user.type(screen.getByLabelText('Full name'), '  Freya Alpha ')
    await user.type(screen.getByLabelText('Email address'), 'freya@example.com')
    await user.type(screen.getByLabelText('Password'), password)
    await user.type(screen.getByLabelText('Confirm password'), confirm)

    if (role) {
        await user.selectOptions(screen.getByLabelText('I want to join as a'), role)
    }
}

describe('RegisterPage', () => {
    beforeEach(() => {
        registerUser.mockReset()
    })

    it('registers a client by default and sends the trimmed details', async () => {
        registerUser.mockResolvedValue({})
        const user = userEvent.setup()
        renderRegister()

        await fillForm(user)
        await user.click(screen.getByRole('button', { name: 'Create account' }))

        expect(registerUser).toHaveBeenCalledWith({
            name: 'Freya Alpha',
            email: 'freya@example.com',
            password: 'Hustle#2026pass',
            role: 'client'
        })
    })

    it('registers a freelancer when that role is chosen', async () => {
        registerUser.mockResolvedValue({})
        const user = userEvent.setup()
        renderRegister()

        await fillForm(user, { role: 'freelancer' })
        await user.click(screen.getByRole('button', { name: 'Create account' }))

        expect(registerUser).toHaveBeenCalledWith(
            expect.objectContaining({ role: 'freelancer' })
        )
    })

    it('does not call the API when the passwords differ', async () => {
        const user = userEvent.setup()
        renderRegister()

        await fillForm(user, { confirm: 'Different#2026pass' })
        await user.click(screen.getByRole('button', { name: 'Create account' }))

        expect(screen.getByRole('alert')).toHaveTextContent('Passwords do not match.')
        expect(registerUser).not.toHaveBeenCalled()
    })

    it('rejects a password longer than 72 bytes', async () => {
        const user = userEvent.setup()
        renderRegister()

        await fillForm(user, { password: 'a'.repeat(73) })
        await user.click(screen.getByRole('button', { name: 'Create account' }))

        expect(screen.getByRole('alert')).toHaveTextContent(
            'Password must not exceed 72 bytes.'
        )
        expect(registerUser).not.toHaveBeenCalled()
    })

    it('shows the message from the server when registration fails', async () => {
        registerUser.mockRejectedValue({
            response: { data: { error: 'email already registered' } }
        })
        const user = userEvent.setup()
        renderRegister()

        await fillForm(user)
        await user.click(screen.getByRole('button', { name: 'Create account' }))

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'email already registered'
        )
    })

    it('goes to the login page with a confirmation after success', async () => {
        registerUser.mockResolvedValue({})
        const user = userEvent.setup()
        renderRegister()

        await fillForm(user)
        await user.click(screen.getByRole('button', { name: 'Create account' }))

        expect(
            await screen.findByText('Account created successfully. Please sign in.')
        ).toBeInTheDocument()
    })

    it('reveals each password field on request', async () => {
        const user = userEvent.setup()
        renderRegister()

        await user.click(screen.getByRole('button', { name: 'Show password' }))
        await user.click(
            screen.getByRole('button', { name: 'Show confirmation password' })
        )

        expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')
        expect(screen.getByLabelText('Confirm password')).toHaveAttribute('type', 'text')
    })
})
