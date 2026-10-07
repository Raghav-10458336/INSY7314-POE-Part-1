import { useEffect, useState } from 'react'

const emptyForm = {
    title: '',
    description: '',
    category: '',
    price: '',
    deliveryDays: '',
    active: true
}

function GigForm({ selectedGig, onSubmit, onCancel, busy }) {
    const [form, setForm] = useState(emptyForm)

    useEffect(() => {
        if (selectedGig) {
            setForm({
                title: selectedGig.title || '',
                description: selectedGig.description || '',
                category: selectedGig.category || '',
                price: selectedGig.price ?? '',
                deliveryDays: selectedGig.deliveryDays ?? '',
                active: selectedGig.active ?? true
            })
        } else {
            setForm(emptyForm)
        }
    }, [selectedGig])

    function handleChange(event) {
        const { name, value, type, checked } = event.target

        setForm(current => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()

        onSubmit({
            ...form,
            price: Number(form.price),
            deliveryDays: Number(form.deliveryDays)
        })
    }

    return (
        <form className="gig-form" onSubmit={handleSubmit}>
            <h2>{selectedGig ? 'Edit Gig' : 'Create Gig'}</h2>

            <label>
                Title
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    minLength="3"
                    maxLength="80"
                    required
                />
            </label>

            <label>
                Description
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    minLength="10"
                    maxLength="1000"
                    rows="5"
                    required
                />
            </label>

            <label>
                Category
                <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    minLength="2"
                    maxLength="50"
                    required
                />
            </label>

            <div className="form-row">
                <label>
                    Price (R)
                    <input
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Delivery Days
                    <input
                        name="deliveryDays"
                        type="number"
                        min="1"
                        max="365"
                        value={form.deliveryDays}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <label className="checkbox-label">
                <input
                    name="active"
                    type="checkbox"
                    checked={form.active}
                    onChange={handleChange}
                />
                Gig is active
            </label>

            <div className="form-actions">
                <button type="submit" disabled={busy}>
                    {busy
                        ? 'Saving...'
                        : selectedGig
                            ? 'Save Changes'
                            : 'Create Gig'}
                </button>

                {selectedGig && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={busy}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    )
}

export default GigForm
