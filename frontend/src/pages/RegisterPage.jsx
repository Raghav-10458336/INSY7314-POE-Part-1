
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../api/authApi'

export default function RegisterPage() {
    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'client'
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Keep all registration fields in a single form state.
    function handleChange(event) {
        const { name, value } = event.target

        setForm(previous => ({
            ...previous,
            [name]: value
        }))
    }

    // Validate the form before sending registration details.
    async function handleSubmit(event) {
        event.preventDefault()
        setError('')

        if (form.name.trim().length < 2) {
            setError('Please enter your full name.')
            return
        }

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (form.password.length < 8) {
            setError('Password must contain at least 8 characters.')
            return
        }

        // bcrypt only processes the first 72 bytes of a password.
        if (new TextEncoder().encode(form.password).length > 72) {
            setError('Password must not exceed 72 bytes.')
            return
        }

        setLoading(true)

        try {
            await registerUser({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                role: form.role
            })

            // Registration is followed by a separate login.
            navigate('/login', {
                replace: true,
                state: {
                    message: 'Account created successfully. Please sign in.'
                }
            })
        } catch (err) {
            const message = err.response?.data?.error

            setError(
                typeof message === 'string'
                    ? message
                    : 'Registration failed. Please check your details.'
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
                        JOIN THE COMMUNITY
                    </span>

                    <h1>Create your account</h1>

                    <p>
                        Get started with HustleHub+ and connect
                        with new opportunities.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="register-name">
                        Full name
                    </label>

                    <input
                        id="register-name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        minLength={2}
                        maxLength={50}
                        autoComplete="name"
                        required
                    />

                    <label htmlFor="register-email">
                        Email address
                    </label>

                    <input
                        id="register-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        maxLength={254}
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="register-password">
                        Password
                    </label>

                    <div className="auth-password-field">
                        <input
                            id="register-password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            minLength={8}
                            maxLength={128}
                            autoComplete="new-password"
                            aria-describedby="password-help"
                            required
                        />

                        <button
                            type="button"
                            className="auth-password-toggle"
                            onClick={() => setShowPassword(previous => !previous)}
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

                    <p id="password-help" className="auth-field-hint">
                        Use at least 8 characters.
                    </p>

                    <label htmlFor="register-confirm">
                        Confirm password
                    </label>

                    <div className="auth-password-field">
                        <input
                            id="register-confirm"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={form.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            required
                        />

                        <button
                            type="button"
                            className="auth-password-toggle"
                            onClick={() =>
                                setShowConfirmPassword(previous => !previous)
                            }
                            aria-label={
                                showConfirmPassword
                                    ? 'Hide confirmation password'
                                    : 'Show confirmation password'
                            }
                            aria-pressed={showConfirmPassword}
                        >
                            {showConfirmPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>

                    <label htmlFor="register-role">
                        I want to join as a
                    </label>

                    <select
                        id="register-role"
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        required
                    >
                        <option value="client">
                            Client — Hire freelancers
                        </option>
                        <option value="freelancer">
                            Freelancer — Offer services
                        </option>
                    </select>

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
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login">
                        Sign in
                    </Link>
                </p>

                <div className="auth-bottom-note">
                    Your next opportunity starts here.
                </div>
            </section>
        </main>
    )
}
