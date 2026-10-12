import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import GigForm from './GigForm'

const gig = {
    _id: 'g1',
    title: 'Logo design',
    description: 'Clean logo concept with two rounds of revisions',
    category: 'Design',
    price: 250,
    deliveryDays: 3,
    active: true
}

async function fillNewGig(user) {
    await user.type(screen.getByLabelText('Title'), 'Copy editing')
    await user.type(
        screen.getByLabelText('Description'),
        'Proofreading and light editing for up to 2000 words'
    )
    await user.type(screen.getByLabelText('Category'), 'Writing')
    await user.type(screen.getByLabelText('Price (R)'), '120.5')
    await user.type(screen.getByLabelText('Delivery Days'), '2')
}

describe('GigForm', () => {
    it('starts empty in create mode', () => {
        render(<GigForm selectedGig={null} onSubmit={vi.fn()} onCancel={vi.fn()} />)

        expect(screen.getByRole('heading', { name: 'Create Gig' })).toBeInTheDocument()
        expect(screen.getByLabelText('Title')).toHaveValue('')
        expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()
    })

    it('submits price and delivery days as numbers', async () => {
        const onSubmit = vi.fn()
        const user = userEvent.setup()
        render(<GigForm selectedGig={null} onSubmit={onSubmit} onCancel={vi.fn()} />)

        await fillNewGig(user)
        await user.click(screen.getByRole('button', { name: 'Create Gig' }))

        expect(onSubmit).toHaveBeenCalledWith({
            title: 'Copy editing',
            description: 'Proofreading and light editing for up to 2000 words',
            category: 'Writing',
            price: 120.5,
            deliveryDays: 2,
            active: true
        })
    })

    it('sends active as false when the box is unticked', async () => {
        const onSubmit = vi.fn()
        const user = userEvent.setup()
        render(<GigForm selectedGig={null} onSubmit={onSubmit} onCancel={vi.fn()} />)

        await fillNewGig(user)
        await user.click(screen.getByLabelText('Gig is active'))
        await user.click(screen.getByRole('button', { name: 'Create Gig' }))

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({ active: false })
        )
    })

    it('loads the selected gig for editing and can be cancelled', async () => {
        const onCancel = vi.fn()
        const user = userEvent.setup()
        render(<GigForm selectedGig={gig} onSubmit={vi.fn()} onCancel={onCancel} />)

        expect(screen.getByRole('heading', { name: 'Edit Gig' })).toBeInTheDocument()
        expect(screen.getByLabelText('Title')).toHaveValue('Logo design')
        expect(screen.getByLabelText('Price (R)')).toHaveValue(250)
        expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: 'Cancel' }))

        expect(onCancel).toHaveBeenCalled()
    })

    it('locks the form buttons while saving', () => {
        render(
            <GigForm selectedGig={gig} onSubmit={vi.fn()} onCancel={vi.fn()} busy />
        )

        expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled()
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
    })
})
