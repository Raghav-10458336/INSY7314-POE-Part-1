import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import GigCard from './GigCard'

const gig = {
    _id: 'g1',
    title: 'Logo design',
    description: 'Clean logo concept with two rounds of revisions',
    category: 'Design',
    price: 250,
    deliveryDays: 3,
    active: true
}

describe('GigCard', () => {
    it('shows the gig details', () => {
        render(<GigCard gig={gig} onEdit={vi.fn()} onDelete={vi.fn()} />)

        expect(screen.getByRole('heading', { name: 'Logo design' })).toBeInTheDocument()
        expect(screen.getByText('Design')).toBeInTheDocument()
        expect(screen.getByText(gig.description)).toBeInTheDocument()
        expect(screen.getByText('R250.00')).toBeInTheDocument()
        expect(screen.getByText('3 day delivery')).toBeInTheDocument()
    })

    it('marks an inactive gig as inactive', () => {
        render(
            <GigCard
                gig={{ ...gig, active: false }}
                onEdit={vi.fn()}
                onDelete={vi.fn()}
            />
        )

        expect(screen.getByText('Inactive')).toBeInTheDocument()
        expect(screen.queryByText('Active')).not.toBeInTheDocument()
    })

    it('passes the gig to the edit and delete handlers', async () => {
        const onEdit = vi.fn()
        const onDelete = vi.fn()
        const user = userEvent.setup()
        render(<GigCard gig={gig} onEdit={onEdit} onDelete={onDelete} />)

        await user.click(screen.getByRole('button', { name: 'Edit' }))
        await user.click(screen.getByRole('button', { name: 'Delete' }))

        expect(onEdit).toHaveBeenCalledWith(gig)
        expect(onDelete).toHaveBeenCalledWith(gig)
    })

    it('disables both actions while busy', () => {
        render(<GigCard gig={gig} onEdit={vi.fn()} onDelete={vi.fn()} busy />)

        expect(screen.getByRole('button', { name: 'Edit' })).toBeDisabled()
        expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
    })
})
