import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ClientHomePage from './ClientHomePage'

const mocks = vi.hoisted(() => ({
    get: vi.fn(),
    createBooking: vi.fn(),
    getMyBookings: vi.fn(),
    logout: vi.fn()
}))

vi.mock('../api/api', () => ({ default: { get: mocks.get } }))

vi.mock('../api/bookingApi', () => ({
    createBooking: mocks.createBooking,
    getMyBookings: mocks.getMyBookings
}))

vi.mock('../context/useAuth', () => ({
    useAuth: () => ({ user: { name: 'Cleo Client' }, logout: mocks.logout })
}))

const gigs = [
    {
        _id: 'g1',
        title: 'Logo design',
        description: 'Clean logo concept with two rounds of revisions',
        category: 'Design',
        price: 250,
        deliveryDays: 3
    },
    {
        _id: 'g2',
        title: 'Copy editing',
        description: 'Proofreading and light editing for up to 2000 words',
        category: 'Writing',
        price: 120.5,
        deliveryDays: 1
    }
]

function renderPage() {
    return render(
        <MemoryRouter initialEntries={['/client']}>
            <Routes>
                <Route path="/client" element={<ClientHomePage />} />
                <Route path="/login" element={<p>login page</p>} />
            </Routes>
        </MemoryRouter>
    )
}

describe('ClientHomePage', () => {
    beforeEach(() => {
        mocks.get.mockReset()
        mocks.createBooking.mockReset()
        mocks.getMyBookings.mockReset()
        mocks.logout.mockReset()

        mocks.get.mockResolvedValue({ data: { gigs } })
        mocks.getMyBookings.mockResolvedValue({ bookings: [] })
    })

    it('greets the client and lists the available gigs', async () => {
        renderPage()

        expect(await screen.findByText('Logo design')).toBeInTheDocument()
        expect(screen.getByText('Copy editing')).toBeInTheDocument()
        expect(screen.getByText(/Welcome back, Cleo Client/)).toBeInTheDocument()
        expect(mocks.get).toHaveBeenCalledWith('/gigs')
    })

    it('says so when there are no gigs', async () => {
        mocks.get.mockResolvedValue({ data: { gigs: [] } })
        renderPage()

        expect(await screen.findByText('No services available')).toBeInTheDocument()
    })

    it('shows the problem when the gigs cannot be loaded', async () => {
        mocks.get.mockRejectedValue({ response: { data: { error: 'too many requests' } } })
        renderPage()

        expect(await screen.findByText('Unable to load services')).toBeInTheDocument()
        expect(screen.getByText('too many requests')).toBeInTheDocument()
    })

    it('opens and closes the details of a gig', async () => {
        const user = userEvent.setup()
        renderPage()

        await screen.findByText('Logo design')
        await user.click(screen.getAllByRole('button', { name: 'View Details' })[0])

        const dialog = screen.getByRole('dialog')
        expect(within(dialog).getByText('Logo design')).toBeInTheDocument()
        expect(within(dialog).getByRole('button', { name: 'Book This Gig' })).toBeInTheDocument()

        await user.click(within(dialog).getByRole('button', { name: 'Close' }))

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('books the selected gig and reloads the bookings', async () => {
        mocks.createBooking.mockResolvedValue({
            booking: { _id: 'b1' },
            transaction: { _id: 't1' }
        })
        const user = userEvent.setup()
        renderPage()

        await screen.findByText('Logo design')
        await user.click(screen.getAllByRole('button', { name: 'View Details' })[1])
        await user.click(screen.getByRole('button', { name: 'Book This Gig' }))

        expect(mocks.createBooking).toHaveBeenCalledWith('g2')
        expect(await screen.findByText('Booking confirmed.')).toBeInTheDocument()
        expect(screen.getByText(/Booking ID:\s*b1/)).toBeInTheDocument()
        expect(screen.getByText(/Transaction ID:\s*t1/)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Booking Confirmed' })).toBeDisabled()
        expect(mocks.getMyBookings).toHaveBeenCalledTimes(2)
    })

    it('shows the message from the server when a booking is refused', async () => {
        mocks.createBooking.mockRejectedValue({
            response: {
                data: { error: 'Too many booking attempts. Please try again in 15 minutes.' }
            }
        })
        const user = userEvent.setup()
        renderPage()

        await screen.findByText('Logo design')
        await user.click(screen.getAllByRole('button', { name: 'View Details' })[0])
        await user.click(screen.getByRole('button', { name: 'Book This Gig' }))

        expect(
            await screen.findByText('Too many booking attempts. Please try again in 15 minutes.')
        ).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Book This Gig' })).toBeEnabled()
    })

    it('lists earlier bookings with their transaction status', async () => {
        mocks.getMyBookings.mockResolvedValue({
            bookings: [
                {
                    _id: 'b9',
                    gig: { title: 'Brand kit', category: 'Design', deliveryDays: 5 },
                    amount: 480,
                    status: 'confirmed',
                    transactionId: 't9',
                    transactionStatus: 'confirmed',
                    createdAt: '2026-10-08T10:00:00.000Z'
                }
            ]
        })
        renderPage()

        expect(await screen.findByText('Brand kit')).toBeInTheDocument()
        expect(screen.getByText('t9')).toBeInTheDocument()
        expect(screen.getByText(/R480\.00/)).toBeInTheDocument()
    })

    it('logs out and returns to the login page', async () => {
        const user = userEvent.setup()
        renderPage()

        await user.click(screen.getByRole('button', { name: 'Log Out' }))

        expect(mocks.logout).toHaveBeenCalled()
        expect(screen.getByText('login page')).toBeInTheDocument()
    })
})
