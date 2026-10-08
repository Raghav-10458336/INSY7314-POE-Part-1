
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Display registration feedback only when arriving from registration.
    const [successMessage, setSuccessMessage] = useState(
        () => location.state?.message ?? ''
    )

    // Authenticate the user and redirect based on their account role.
    async function handleSubmit(event) {
        event.preventDefault()
        setError('')
        setSuccessMessage('')
        setLoading(true)

        // Clear navigation feedback after the user begins signing in.
        if (location.state?.message) {
            navigate(location.pathname, {
                replace: true,
                state: null
            })
        }

        try {
            const user = await login(email.trim(), password)

            // Direct each account type to its authorised dashboard.
            if (user.role === 'freelancer') {
                navigate('/my-gigs', { replace: true })
            } else if (user.role === 'client') {
                navigate('/client', { replace: true })
            } else {
                setError('Your account role is not supported.')
            }
        } catch (err) {
            const message = err.response?.data?.error

            setError(
                typeof message === 'string'
                    ? message
                    : 'Unable to sign in. Please try again.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="auth-brand">
                    <span className="auth-brand-mark">H</span>
                    <span>
                        HustleHub<span className="brand-plus">+</span>
                    </span>
                </div>

                <div className="auth-heading">
                    <span className="auth-kicker">
                        WELCOME BACK
                    </span>

                    <h1>Sign in to your account</h1>

                    <p>
                        Access your workspace and pick up
                        right where you left off.
                    </p>
                </div>

                {successMessage && (
                    <div className="auth-success" role="status">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="login-email">
                        Email address
                    </label>

                    <input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        maxLength={254}
                        required
                    />

                    <div className="auth-label-row">
                        <label htmlFor="login-password">
                            Password
                        </label>
                    </div>

                    <div className="auth-password-field">
                        <input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />

                        <button
                            type="button"
                            className="auth-password-toggle"
                            onClick={() =>
                                setShowPassword(previous => !previous)
                            }
                            aria-label={
                                showPassword
                                    ? 'Hide password'
                                    : 'Show password'
                            }
                            aria-pressed={showPassword}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    {error && (
                        <p className="auth-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className="auth-footer">
                    New to HustleHub+?{' '}
                    <Link to="/register">
                        Create an account
                    </Link>
                </p>

                <div className="auth-bottom-note">
                    A workspace for ideas, talent and opportunity.
                </div>
            </section>
        </main>
    )
}
