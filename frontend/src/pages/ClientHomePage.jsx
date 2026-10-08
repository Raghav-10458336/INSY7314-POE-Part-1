import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import api from '../api/api'
import {
    createBooking,
    getMyBookings
} from '../api/bookingApi'

// Dashboard displayed to authenticated client accounts.
export default function ClientHomePage() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const [gigs, setGigs] = useState([])
    const [selectedGig, setSelectedGig] = useState(null)
    const [loadingGigs, setLoadingGigs] = useState(true)
    const [gigError, setGigError] = useState('')
    const [booking, setBooking] = useState(false)
    const [bookingError, setBookingError] = useState('')
    const [bookingSuccess, setBookingSuccess] = useState(null)

    const [bookings, setBookings] = useState([])
    const [loadingBookings, setLoadingBookings] = useState(true)
    const [bookingListError, setBookingListError] = useState('')

    function handleLogout() {
        logout()
        navigate('/login', { replace: true })
    }

    useEffect(() => {
        let cancelled = false

        async function loadGigs() {
            setLoadingGigs(true)
            setGigError('')

            try {
                const response = await api.get('/gigs')

                if (!cancelled) {
                    setGigs(response.data.gigs ?? [])
                }
            } catch (error) {
                if (!cancelled) {
                    setGigError(
                        error.response?.data?.error ||
                        'Unable to load available services.'
                    )
                }
            } finally {
                if (!cancelled) {
                    setLoadingGigs(false)
                }
            }
        }

        loadGigs()

        return () => {
            cancelled = true
        }
    }, [])

    useEffect(() => {
        let cancelled = false

        async function loadBookings() {
            setLoadingBookings(true)
            setBookingListError('')

            try {
                const response = await getMyBookings()

                if (!cancelled) {
                    setBookings(response.bookings ?? [])
                }
            } catch (error) {
                if (!cancelled) {
                    setBookingListError(
                        error.response?.data?.error ||
                        'Unable to load your bookings.'
                    )
                }
            } finally {
                if (!cancelled) {
                    setLoadingBookings(false)
                }
            }
        }

        loadBookings()

        return () => {
            cancelled = true
        }
    }, [])

    function handleViewGig(gig) {
        setSelectedGig(gig)
        setBookingError('')
        setBookingSuccess(null)
    }

    function handleCloseGig() {
        if (booking) {
            return
        }

        setSelectedGig(null)
        setBookingError('')
    }

    async function handleBooking() {
        if (!selectedGig || booking) {
            return
        }

        setBooking(true)
        setBookingError('')
        setBookingSuccess(null)

        try {
            const response = await createBooking(selectedGig._id)

            setBookingSuccess(response)

            setBookings(currentBookings => [
                response.booking,
                ...currentBookings
            ])
        } catch (error) {
            setBookingError(
                error.response?.data?.error ||
                'Unable to create the booking. Please try again.'
            )
        } finally {
            setBooking(false)
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
        <main className="client-dashboard">
            <header className="client-navbar">
                <div className="client-navbar-inner">
                    <div className="client-brand">
                        <span className="client-brand-mark">H</span>
                        <span>
                            HustleHub<span className="brand-plus">+</span>
                        </span>
                    </div>

                    <div className="client-nav-actions">
                        <span className="client-role-label">
                            Client Account
                        </span>

                        <button
                            type="button"
                            className="client-logout-button"
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </header>

            <div className="client-dashboard-content">
                <section className="client-hero">
                    <div className="client-hero-copy">
                        <span className="client-eyebrow">
                            YOUR WORKSPACE
                        </span>

                        <h1>
                            Find the right talent.
                            <br />
                            <span>Bring your ideas to life.</span>
                        </h1>

                        <p>
                            Welcome back{user?.name ? `, ${user.name}` : ''}.
                            Connect with skilled freelancers and
                            discover services that help you move forward.
                        </p>

                        <div className="client-hero-tags">
                            <span>Creative Services</span>
                            <span>Development</span>
                            <span>Business Support</span>
                        </div>
                    </div>

                    <div className="client-hero-art" aria-hidden="true">
                        <div className="client-art-card client-art-card-back">
                            <div className="client-art-icon">✦</div>
                            <div className="client-art-line"></div>
                            <div className="client-art-line short"></div>
                        </div>

                        <div className="client-art-card client-art-card-front">
                            <div className="client-art-avatar">H</div>
                            <div className="client-art-details">
                                <div className="client-art-line"></div>
                                <div className="client-art-line short"></div>
                            </div>
                            <div className="client-art-check">✓</div>
                        </div>

                        <div className="client-art-circle"></div>
                    </div>
                </section>

                <section className="client-overview">
                    <div className="client-section-heading">
                        <div>
                            <span className="client-eyebrow">
                                AVAILABLE SERVICES
                            </span>

                            <h2>Discover freelance services</h2>

                            <p>
                                Browse active gigs offered by freelancers
                                on HustleHub+.
                            </p>
                        </div>
                    </div>

                    {loadingGigs && (
                        <div className="client-feature-card">
                            <h3>Loading services...</h3>
                            <p>
                                Please wait while we retrieve the
                                available gigs.
                            </p>
                        </div>
                    )}

                    {!loadingGigs && gigError && (
                        <div className="client-feature-card">
                            <h3>Unable to load services</h3>
                            <p>{gigError}</p>
                        </div>
                    )}

                    {!loadingGigs && !gigError && gigs.length === 0 && (
                        <div className="client-feature-card">
                            <h3>No services available</h3>
                            <p>
                                There are currently no active freelance
                                services available.
                            </p>
                        </div>
                    )}

                    {!loadingGigs && !gigError && gigs.length > 0 && (
                        <div className="client-feature-grid">
                            {gigs.map(gig => (
                                <article
                                    className="client-feature-card"
                                    key={gig._id}
                                >
                                    <div className="client-feature-icon teal-icon">
                                        ✦
                                    </div>

                                    <h3>{gig.title}</h3>

                                    <p>{gig.description}</p>

                                    <p>
                                        <strong>Category:</strong>{' '}
                                        {gig.category}
                                    </p>

                                    <p>
                                        <strong>Price:</strong>{' '}
                                        R{Number(gig.price).toFixed(2)}
                                    </p>

                                    <p>
                                        <strong>Delivery:</strong>{' '}
                                        {gig.deliveryDays} day
                                        {gig.deliveryDays === 1
                                            ? ''
                                            : 's'}
                                    </p>

                                    <button
                                        type="button"
                                        className="secondary-button"
                                        onClick={() =>
                                            handleViewGig(gig)
                                        }
                                    >
                                        View Details
                                    </button>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                <section className="client-overview">
                    <div className="client-section-heading">
                        <div>
                            <span className="client-eyebrow">
                                YOUR ACTIVITY
                            </span>

                            <h2>My Bookings</h2>

                            <p>
                                View the freelance services you have
                                booked.
                            </p>
                        </div>
                    </div>

                    {loadingBookings && (
                        <div className="client-feature-card">
                            <h3>Loading bookings...</h3>
                            <p>
                                Please wait while we retrieve your
                                bookings.
                            </p>
                        </div>
                    )}

                    {!loadingBookings && bookingListError && (
                        <div className="client-feature-card">
                            <h3>Unable to load bookings</h3>
                            <p>{bookingListError}</p>
                        </div>
                    )}

                    {!loadingBookings &&
                        !bookingListError &&
                        bookings.length === 0 && (
                            <div className="client-feature-card">
                                <h3>No bookings yet</h3>
                                <p>
                                    You have not booked any freelance
                                    services yet.
                                </p>
                            </div>
                        )}

                    {!loadingBookings &&
                        !bookingListError &&
                        bookings.length > 0 && (
                            <div className="client-feature-grid">
                                {bookings.map(bookingItem => (
                                    <article
                                        className="client-feature-card"
                                        key={bookingItem._id}
                                    >
                                        <div className="client-feature-icon teal-icon">
                                            ✓
                                        </div>

                                        <h3>
                                            {bookingItem.gig?.title ||
                                                'Freelance Service'}
                                        </h3>

                                        <p>
                                            <strong>Category:</strong>{' '}
                                            {bookingItem.gig?.category ||
                                                'Unavailable'}
                                        </p>

                                        <p>
                                            <strong>Amount:</strong>{' '}
                                            R
                                            {Number(
                                                bookingItem.amount
                                            ).toFixed(2)}
                                        </p>

                                        <p>
                                            <strong>Delivery:</strong>{' '}
                                            {bookingItem.gig
                                                ?.deliveryDays ||
                                                'Unavailable'}{' '}
                                            day
                                            {bookingItem.gig
                                                ?.deliveryDays === 1
                                                ? ''
                                                : 's'}
                                        </p>

                                        <p>
                                            <strong>Status:</strong>{' '}
                                            {bookingItem.status}
                                        </p>

                                        <p>
                                            <strong>Booked:</strong>{' '}
                                            {formatBookingDate(
                                                bookingItem.createdAt
                                            )}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        )}
                </section>
            </div>

            {selectedGig && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="gig-details-title"
                    className="client-feature-card"
                >
                    <h2 id="gig-details-title">
                        {selectedGig.title}
                    </h2>

                    <p>{selectedGig.description}</p>

                    <p>
                        <strong>Category:</strong>{' '}
                        {selectedGig.category}
                    </p>

                    <p>
                        <strong>Price:</strong>{' '}
                        R{Number(selectedGig.price).toFixed(2)}
                    </p>

                    <p>
                        <strong>Delivery:</strong>{' '}
                        {selectedGig.deliveryDays} day
                        {selectedGig.deliveryDays === 1
                            ? ''
                            : 's'}
                    </p>

                    {bookingError && (
                        <div className="alert error-alert">
                            {bookingError}
                        </div>
                    )}

                    {bookingSuccess && (
                        <div className="alert success-alert">
                            <strong>Booking confirmed.</strong>
                            <br />
                            Booking ID:{' '}
                            {bookingSuccess.booking?._id}
                            <br />
                            Transaction ID:{' '}
                            {bookingSuccess.transaction?._id}
                        </div>
                    )}

                    <div className="gig-actions">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={handleCloseGig}
                            disabled={booking}
                        >
                            Close
                        </button>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={handleBooking}
                            disabled={booking || bookingSuccess}
                        >
                            {booking
                                ? 'Confirming...'
                                : bookingSuccess
                                    ? 'Booking Confirmed'
                                    : 'Book This Gig'}
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}