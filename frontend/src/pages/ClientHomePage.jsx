
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Dashboard displayed to authenticated client accounts.
export default function ClientHomePage() {
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    function handleLogout() {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <main className="client-dashboard">
            <header className="client-navbar">
                <div className="client-navbar-inner">
                    <div className="client-brand">
                        <span className="client-brand-mark">H</span>
                        <span>HustleHub<span className="brand-plus">+</span></span>
                    </div>

                    <div className="client-nav-actions">
                        <span className="client-role-label">Client Account</span>
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
                                GET STARTED
                            </span>
                            <h2>Your HustleHub+ workspace</h2>
                            <p>
                                Everything you need to get started
                                with freelance services.
                            </p>
                        </div>
                    </div>

                    <div className="client-feature-grid">
                        <article className="client-feature-card">
                            <div className="client-feature-icon teal-icon">
                                ✦
                            </div>
                            <h3>Discover Services</h3>
                            <p>
                                Explore freelance services across
                                different categories and specialties.
                            </p>
                            <span className="client-feature-note">
                                Available after integration
                            </span>
                        </article>

                        <article className="client-feature-card">
                            <div className="client-feature-icon orange-icon">
                                ◈
                            </div>
                            <h3>Manage Bookings</h3>
                            <p>
                                Keep track of your service requests
                                and freelance bookings in one place.
                            </p>
                            <span className="client-feature-note">
                                Available after integration
                            </span>
                        </article>

                        <article className="client-feature-card">
                            <div className="client-feature-icon navy-icon">
                                ◎
                            </div>
                            <h3>Your Account</h3>
                            <p>
                                Your account is secured with
                                authenticated access and role-based
                                permissions.
                            </p>
                            <span className="client-feature-note">
                                Signed in as client
                            </span>
                        </article>
                    </div>
                </section>
            </div>
        </main>
    )
}
