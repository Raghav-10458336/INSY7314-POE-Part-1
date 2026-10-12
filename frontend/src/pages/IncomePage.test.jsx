import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import IncomePage from './IncomePage'

const mocks = vi.hoisted(() => ({
    getIncome: vi.fn(),
    logout: vi.fn()
}))

vi.mock('../api/incomeApi', () => ({ getIncome: mocks.getIncome }))

vi.mock('../context/useAuth', () => ({
    useAuth: () => ({ logout: mocks.logout })
}))

const income = {
    totalIncome: 370.5,
    transactionCount: 2,
    transactions: [
        {
            _id: 't2',
            booking: 'b2',
            gig: { title: 'Copy editing', category: 'Writing' },
            amount: 120.5,
            status: 'confirmed',
            createdAt: '2026-10-09T10:00:00.000Z'
        },
        {
            _id: 't1',
            booking: 'b1',
            gig: null,
            amount: 250,
            status: 'confirmed',
            createdAt: '2026-10-08T10:00:00.000Z'
        }
    ]
}

function renderPage() {
    return render(
        <MemoryRouter initialEntries={['/income']}>
            <Routes>
                <Route path="/income" element={<IncomePage />} />
                <Route path="/my-gigs" element={<p>gigs page</p>} />
                <Route path="/login" element={<p>login page</p>} />
            </Routes>
        </MemoryRouter>
    )
}

describe('IncomePage', () => {
    beforeEach(() => {
        mocks.getIncome.mockReset()
        mocks.logout.mockReset()
        mocks.getIncome.mockResolvedValue(income)
    })

    it('shows the total, the count and the average', async () => {
        renderPage()

        expect(await screen.findByText('R370.50')).toBeInTheDocument()
        expect(screen.getByText('Confirmed bookings').nextSibling).toHaveTextContent('2')
        expect(screen.getByText('R185.25')).toBeInTheDocument()
    })

    it('lists every transaction with its booking and amount', async () => {
        renderPage()

        await screen.findByText('Copy editing')

        expect(screen.getAllByRole('row')).toHaveLength(3)
        expect(screen.getByText('b2')).toBeInTheDocument()
        expect(screen.getByText('R120.50')).toBeInTheDocument()
        expect(screen.getByText('R250.00')).toBeInTheDocument()
    })

    it('labels a transaction whose gig was deleted', async () => {
        renderPage()

        expect(await screen.findByText('Gig removed')).toBeInTheDocument()
    })

    it('shows an empty state before the first booking', async () => {
        mocks.getIncome.mockResolvedValue({
            totalIncome: 0,
            transactionCount: 0,
            transactions: []
        })
        renderPage()

        expect(await screen.findByText('No income yet')).toBeInTheDocument()
        expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })

    it('shows the message from the server when loading fails', async () => {
        mocks.getIncome.mockRejectedValue({ response: { data: { error: 'forbidden' } } })
        renderPage()

        expect(await screen.findByRole('alert')).toHaveTextContent('forbidden')
        expect(screen.queryByText('Total income')).not.toBeInTheDocument()
    })

    it('links back to the gigs page', async () => {
        const user = userEvent.setup()
        renderPage()

        await user.click(screen.getByRole('link', { name: 'Back to My Gigs' }))

        expect(screen.getByText('gigs page')).toBeInTheDocument()
    })

    it('logs out and returns to the login page', async () => {
        const user = userEvent.setup()
        renderPage()

        await user.click(screen.getByRole('button', { name: 'Log Out' }))

        expect(mocks.logout).toHaveBeenCalled()
        expect(screen.getByText('login page')).toBeInTheDocument()
    })
})
