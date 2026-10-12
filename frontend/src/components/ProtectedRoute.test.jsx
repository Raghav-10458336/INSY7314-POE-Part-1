import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import ProtectedRoute from './ProtectedRoute'

const auth = vi.hoisted(() => ({ value: { user: null, loading: false } }))

vi.mock('../context/useAuth', () => ({
    useAuth: () => auth.value
}))

function renderRoute(allowedRoles) {
    return render(
        <MemoryRouter initialEntries={['/private']}>
            <Routes>
                <Route path="/login" element={<p>login page</p>} />
                <Route
                    path="/private"
                    element={
                        <ProtectedRoute allowedRoles={allowedRoles}>
                            <p>private content</p>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </MemoryRouter>
    )
}

describe('ProtectedRoute', () => {
    it('waits while the session is being checked', () => {
        auth.value = { user: null, loading: true }
        renderRoute(['client'])

        expect(screen.getByText('Checking authentication...')).toBeInTheDocument()
        expect(screen.queryByText('private content')).not.toBeInTheDocument()
    })

    it('sends visitors who are not signed in to the login page', () => {
        auth.value = { user: null, loading: false }
        renderRoute(['client'])

        expect(screen.getByText('login page')).toBeInTheDocument()
        expect(screen.queryByText('private content')).not.toBeInTheDocument()
    })

    it('blocks a signed in user with the wrong role', () => {
        auth.value = { user: { role: 'client' }, loading: false }
        renderRoute(['freelancer'])

        expect(screen.getByText(/403/)).toBeInTheDocument()
        expect(screen.queryByText('private content')).not.toBeInTheDocument()
    })

    it('shows the page to a user with an allowed role', () => {
        auth.value = { user: { role: 'freelancer' }, loading: false }
        renderRoute(['freelancer'])

        expect(screen.getByText('private content')).toBeInTheDocument()
    })

    it('lets any signed in user through when no roles are listed', () => {
        auth.value = { user: { role: 'client' }, loading: false }
        renderRoute(undefined)

        expect(screen.getByText('private content')).toBeInTheDocument()
    })
})
