import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import api from '../api/api'
import {
    getFreelancerBookings
} from '../api/bookingApi'
import GigForm from '../components/GigForm'
import GigCard from '../components/GigCard'

function MyGigsPage() {
    const navigate = useNavigate()
    const { logout } = useAuth()

    const [gigs, setGigs] = useState([])
    const [selectedGig, setSelectedGig] = useState(null)
    const [loading, setLoading] = useState(true)
    const [busy, setBusy] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const [bookings, setBookings] = useState([])
    const [loadingBookings, setLoadingBookings] = useState(true)
    const [bookingError, setBookingError] = useState('')

    // End the current session and return to login.
    function handleLogout() {
        logout()
        navigate('/login', { replace: true })
    }

    // Retrieve gigs belonging to the authenticated freelancer.
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

    // Retrieve bookings for gigs owned by the authenticated freelancer.
    async function loadBookings() {
        try {
            setBookingError('')

            const response = await getFreelancerBookings()
            setBookings(response.bookings || [])
        } catch (err) {
            if (err.response?.status === 401) {
                setBookingError('Please log in as a freelancer.')
            } else if (err.response?.status === 403) {
                setBookingError(
                    'This booking view is only available to freelancers.'
                )
            } else {
                setBookingError(
                    err.response?.data?.error ||
                    'Unable to load bookings.'
                )
            }
        } finally {
            setLoadingBookings(false)
        }
    }

    // Load gigs when the page opens.
    useEffect(() => {
        // Defer the request to avoid synchronous state updates in the effect.
        const timeoutId = setTimeout(() => {
            loadGigs()
        }, 0)

        return () => clearTimeout(timeoutId)
    }, [])

    // Load freelancer bookings when the page opens.
    useEffect(() => {
        // Defer the request to avoid synchronous state updates in the effect.
        const timeoutId = setTimeout(() => {
            loadBookings()
        }, 0)

        return () => clearTimeout(timeoutId)
    }, [])

    // Create a new gig or update an existing listing.
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

    // Delete a gig after confirmation.
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

    function formatBookingDate(date) {
        if (!date) {
            return 'Date unavailable'
        }

        const parsedDate = new Date(date)

        if (Number.isNaN(parsedDate.getTime())) {
            return 'Date unavailable'
        }

        return parsedDate.toLocaleDateString()
    }

    return (
        <main className="page-shell">
            <header className="page-header">
                <p className="eyebrow">HustleHub+</p>
                <h1>My Gigs</h1>
                <p>
                    Create and manage the services you offer to clients.
                </p>

                <button
                    type="button"
                    onClick={() => navigate('/income')}
                >
                    View Income
                </button>

                {/* Logout functionality for authenticated freelancers. */}
                <button
                    type="button"
                    onClick={handleLogout}
                >
                    Log Out
                </button>
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

            <section className="booking-management-section">
                <div className="list-heading">
                    <div>
                        <h2>Client Bookings</h2>
                        <p>
                            View bookings made for your freelance services.
                        </p>
                    </div>

                    <span>
                        {bookings.length}{' '}
                        booking{bookings.length === 1 ? '' : 's'}
                    </span>
                </div>

                {bookingError && (
                    <div className="alert error-alert">
                        {bookingError}
                    </div>
                )}

                {loadingBookings ? (
                    <p>Loading bookings...</p>
                ) : bookingError ? null : bookings.length === 0 ? (
                    <div className="empty-state">
                        <h3>No bookings yet</h3>
                        <p>
                            Bookings for your gigs will appear here when
                            clients make purchases.
                        </p>
                    </div>
                ) : (
                    <div className="booking-list">
                        {bookings.map(booking => (
                            <article
                                className="booking-card"
                                key={booking._id}
                            >
                                <div className="booking-card-header">
                                    <div>
                                        <h3>
                                            {booking.gig?.title ||
                                                'Freelance Service'}
                                        </h3>

                                        <span>
                                            {booking.gig?.category ||
                                                'Category unavailable'}
                                        </span>
                                    </div>

                                    <span className="booking-status">
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="booking-card-details">
                                    <p>
                                        <strong>Booking ID:</strong>{' '}
                                        {booking._id}
                                    </p>

                                    <p>
                                        <strong>Client ID:</strong>{' '}
                                        {booking.client}
                                    </p>

                                    <p>
                                        <strong>Amount:</strong>{' '}
                                        R
                                        {Number(
                                            booking.amount
                                        ).toFixed(2)}
                                    </p>

                                    <p>
                                        <strong>Delivery:</strong>{' '}
                                        {booking.gig?.deliveryDays ||
                                            'Unavailable'}{' '}
                                        day
                                        {booking.gig?.deliveryDays === 1
                                            ? ''
                                            : 's'}
                                    </p>

                                    <p>
                                        <strong>Transaction ID:</strong>{' '}
                                        {booking.transactionId ||
                                            'Unavailable'}
                                    </p>

                                    <p>
                                        <strong>
                                            Transaction Status:
                                        </strong>{' '}
                                        {booking.transactionStatus ||
                                            'Unavailable'}
                                    </p>

                                    <p>
                                        <strong>Booked:</strong>{' '}
                                        {formatBookingDate(
                                            booking.createdAt
                                        )}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}

export default MyGigsPage