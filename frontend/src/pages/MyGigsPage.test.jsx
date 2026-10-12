import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import MyGigsPage from './MyGigsPage'

const mocks = vi.hoisted(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    remove: vi.fn(),
    getFreelancerBookings: vi.fn(),
    logout: vi.fn()
}))

vi.mock('../api/api', () => ({
    default: {
        get: mocks.get,
        post: mocks.post,
        put: mocks.put,
        delete: mocks.remove
    }
}))

vi.mock('../api/bookingApi', () => ({
    getFreelancerBookings: mocks.getFreelancerBookings
}))

vi.mock('../context/useAuth', () => ({
    useAuth: () => ({ logout: mocks.logout })
}))

const gig = {
    _id: 'g1',
    title: 'Logo design',
    description: 'Clean logo concept with two rounds of revisions',
    category: 'Design',
    price: 250,
    deliveryDays: 3,
    active: true
}

const booking = {
    _id: 'b1',
    client: 'c1',
    gig: { title: 'Logo design', category: 'Design', deliveryDays: 3 },
    amount: 250,
    status: 'confirmed',
    transactionId: 't1',
    transactionStatus: 'confirmed',
    createdAt: '2026-10-08T10:00:00.000Z'
}

function renderPage() {
    return render(
        <MemoryRouter initialEntries={['/my-gigs']}>
            <Routes>
                <Route path="/my-gigs" element={<MyGigsPage />} />
                <Route path="/income" element={<p>income page</p>} />
                <Route path="/login" element={<p>login page</p>} />
            </Routes>
        </MemoryRouter>
    )
}

describe('MyGigsPage', () => {
    beforeEach(() => {
        Object.values(mocks).forEach(mock => mock.mockReset())

        mocks.get.mockResolvedValue({ data: { gigs: [gig] } })
        mocks.getFreelancerBookings.mockResolvedValue({ bookings: [booking] })
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('lists the freelancer gigs and the bookings made on them', async () => {
        renderPage()

        expect(
            await screen.findAllByRole('heading', { name: 'Logo design', level: 3 })
        ).toHaveLength(2)
        expect(await screen.findByText('Transaction ID:')).toBeInTheDocument()
        expect(screen.getByText('1 gig')).toBeInTheDocument()
        expect(screen.getByText('1 booking')).toBeInTheDocument()
        expect(mocks.get).toHaveBeenCalledWith('/gigs/my')
    })

    it('creates a gig from the form', async () => {
        mocks.get.mockResolvedValue({ data: { gigs: [] } })
        mocks.post.mockResolvedValue({ data: {} })
        const user = userEvent.setup()
        renderPage()

        await screen.findByText('No gigs yet')
        await user.type(screen.getByLabelText('Title'), 'Copy editing')
        await user.type(
            screen.getByLabelText('Description'),
            'Proofreading and light editing for up to 2000 words'
        )
        await user.type(screen.getByLabelText('Category'), 'Writing')
        await user.type(screen.getByLabelText('Price (R)'), '120.5')
        await user.type(screen.getByLabelText('Delivery Days'), '2')
        await user.click(screen.getByRole('button', { name: 'Create Gig' }))

        expect(mocks.post).toHaveBeenCalledWith('/gigs', {
            title: 'Copy editing',
            description: 'Proofreading and light editing for up to 2000 words',
            category: 'Writing',
            price: 120.5,
            deliveryDays: 2,
            active: true
        })
        expect(await screen.findByText('Gig created successfully.')).toBeInTheDocument()
    })

    it('shows the validation details when saving fails', async () => {
        mocks.post.mockRejectedValue({
            response: {
                data: {
                    details: [{ message: 'price must be a valid number greater than or equal to 0' }]
                }
            }
        })
        const user = userEvent.setup()
        renderPage()

        await screen.findByRole('button', { name: 'Delete' })
        await user.type(screen.getByLabelText('Title'), 'Copy editing')
        await user.type(screen.getByLabelText('Description'), 'Proofreading and light editing')
        await user.type(screen.getByLabelText('Category'), 'Writing')
        await user.type(screen.getByLabelText('Price (R)'), '10')
        await user.type(screen.getByLabelText('Delivery Days'), '2')
        await user.click(screen.getByRole('button', { name: 'Create Gig' }))

        expect(
            await screen.findByText('price must be a valid number greater than or equal to 0')
        ).toBeInTheDocument()
    })

    it('does not delete a gig unless the freelancer confirms', async () => {
        const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
        const user = userEvent.setup()
        renderPage()

        await user.click(await screen.findByRole('button', { name: 'Delete' }))

        expect(confirm).toHaveBeenCalled()
        expect(mocks.remove).not.toHaveBeenCalled()
    })

    it('deletes a confirmed gig and reloads the list', async () => {
        vi.spyOn(window, 'confirm').mockReturnValue(true)
        mocks.remove.mockResolvedValue({ data: {} })
        const user = userEvent.setup()
        renderPage()

        await user.click(await screen.findByRole('button', { name: 'Delete' }))

        expect(mocks.remove).toHaveBeenCalledWith('/gigs/g1')
        expect(await screen.findByText('Gig deleted successfully.')).toBeInTheDocument()
        expect(mocks.get).toHaveBeenCalledTimes(2)
    })

    it('tells a non freelancer that the page is not for them', async () => {
        mocks.get.mockRejectedValue({ response: { status: 403 } })
        renderPage()

        expect(
            await screen.findByText('This page is only available to freelancers.')
        ).toBeInTheDocument()
    })

    it('opens the income page', async () => {
        const user = userEvent.setup()
        renderPage()

        await user.click(screen.getByRole('button', { name: 'View Income' }))

        expect(screen.getByText('income page')).toBeInTheDocument()
    })
})
