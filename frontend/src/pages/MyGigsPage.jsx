import { useEffect, useState } from 'react'
import api from '../api/api'
import GigForm from '../components/GigForm'
import GigCard from '../components/GigCard'

function MyGigsPage() {
    const [gigs, setGigs] = useState([])
    const [selectedGig, setSelectedGig] = useState(null)
    const [loading, setLoading] = useState(true)
    const [busy, setBusy] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    async function loadGigs() {
        try {
            setError('')
            const response = await api.get('/gigs/my')
            setGigs(response.data.gigs || [])
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Please log in as a freelancer.')
            } else if (err.response?.status === 403) {
                setError('This page is only available to freelancers.')
            } else {
                setError(
                    err.response?.data?.error ||
                    'Unable to load gigs.'
                )
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadGigs()
    }, [])

    async function saveGig(form) {
        try {
            setBusy(true)
            setMessage('')
            setError('')

            if (selectedGig) {
                await api.put(`/gigs/${selectedGig._id}`, form)
                setMessage('Gig updated successfully.')
            } else {
                await api.post('/gigs', form)
                setMessage('Gig created successfully.')
            }

            setSelectedGig(null)
            await loadGigs()
        } catch (err) {
            const details = err.response?.data?.details

            if (Array.isArray(details)) {
                setError(
                    details.map(item => item.message).join(' ')
                )
            } else {
                setError(
                    err.response?.data?.error ||
                    'Unable to save gig.'
                )
            }
        } finally {
            setBusy(false)
        }
    }

    async function deleteGig(gig) {
        const confirmed = window.confirm(
            `Delete "${gig.title}"?`
        )

        if (!confirmed) {
            return
        }

        try {
            setBusy(true)
            setMessage('')
            setError('')

            await api.delete(`/gigs/${gig._id}`)

            if (selectedGig?._id === gig._id) {
                setSelectedGig(null)
            }

            setMessage('Gig deleted successfully.')
            await loadGigs()
        } catch (err) {
            setError(
                err.response?.data?.error ||
                'Unable to delete gig.'
            )
        } finally {
            setBusy(false)
        }
    }

    return (
        <main className="page-shell">
            <header className="page-header">
                <p className="eyebrow">HustleHub+</p>
                <h1>My Gigs</h1>
                <p>
                    Create and manage the services you offer to clients.
                </p>
            </header>

            {message && (
                <div className="alert success-alert">
                    {message}
                </div>
            )}

            {error && (
                <div className="alert error-alert">
                    {error}
                </div>
            )}

            <section className="management-grid">
                <GigForm
                    selectedGig={selectedGig}
                    onSubmit={saveGig}
                    onCancel={() => setSelectedGig(null)}
                    busy={busy}
                />

                <div>
                    <div className="list-heading">
                        <h2>Your Listings</h2>
                        <span>
                            {gigs.length} gig{gigs.length === 1 ? '' : 's'}
                        </span>
                    </div>

                    {loading ? (
                        <p>Loading gigs...</p>
                    ) : gigs.length === 0 ? (
                        <div className="empty-state">
                            <h3>No gigs yet</h3>
                            <p>
                                Create your first listing using the form.
                            </p>
                        </div>
                    ) : (
                        <div className="gig-list">
                            {gigs.map(gig => (
                                <GigCard
                                    key={gig._id}
                                    gig={gig}
                                    onEdit={setSelectedGig}
                                    onDelete={deleteGig}
                                    busy={busy}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    )
}

export default MyGigsPage
