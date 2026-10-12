import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { getIncome } from '../api/incomeApi'
import './IncomePage.css'

function formatDate(date) {
    const parsed = new Date(date)

    if (!date || Number.isNaN(parsed.getTime())) {
        return 'Date unavailable'
    }

    return parsed.toLocaleDateString()
}

function formatAmount(amount) {
    return `R${Number(amount).toFixed(2)}`
}

function IncomePage() {
    const navigate = useNavigate()
    const { logout } = useAuth()

    const [income, setIncome] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let cancelled = false

        async function loadIncome() {
            try {
                const data = await getIncome()

                if (!cancelled) {
                    setIncome(data)
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.response?.data?.error ||
                        'Unable to load your income.'
                    )
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadIncome()

        return () => {
            cancelled = true
        }
    }, [])

    function handleLogout() {
        logout()
        navigate('/login', { replace: true })
    }

    const transactions = income?.transactions ?? []
    const count = income?.transactionCount ?? 0
    const total = income?.totalIncome ?? 0
    const average = count > 0 ? total / count : 0

    return (
        <main className="page-shell">
            <header className="page-header">
                <p className="eyebrow">HustleHub+</p>
                <h1>Income</h1>
                <p>
                    Earnings from confirmed bookings on your gigs.
                </p>

                <div className="income-nav">
                    <Link to="/my-gigs">Back to My Gigs</Link>

                    <button type="button" onClick={handleLogout}>
                        Log Out
                    </button>
                </div>
            </header>

            {error && (
                <div className="alert error-alert" role="alert">
                    {error}
                </div>
            )}

            {loading && <p>Loading income...</p>}

            {!loading && !error && (
                <>
                    <section className="income-summary">
                        <div className="income-stat">
                            <span>Total income</span>
                            <strong>{formatAmount(total)}</strong>
                        </div>

                        <div className="income-stat">
                            <span>Confirmed bookings</span>
                            <strong>{count}</strong>
                        </div>

                        <div className="income-stat">
                            <span>Average per booking</span>
                            <strong>{formatAmount(average)}</strong>
                        </div>
                    </section>

                    {transactions.length === 0 ? (
                        <div className="empty-state">
                            <h3>No income yet</h3>
                            <p>
                                Income appears here once a client books
                                one of your gigs.
                            </p>
                        </div>
                    ) : (
                        <div className="income-table-wrap">
                            <table className="income-table">
                                <thead>
                                    <tr>
                                        <th scope="col">Date</th>
                                        <th scope="col">Gig</th>
                                        <th scope="col">Booking</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Amount</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {transactions.map(transaction => (
                                        <tr key={transaction._id}>
                                            <td>
                                                {formatDate(
                                                    transaction.createdAt
                                                )}
                                            </td>
                                            <td>
                                                {transaction.gig?.title ||
                                                    'Gig removed'}
                                                {transaction.gig?.category && (
                                                    <span className="income-category">
                                                        {transaction.gig.category}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="income-ref">
                                                {transaction.booking}
                                            </td>
                                            <td className="income-status">
                                                {transaction.status}
                                            </td>
                                            <td className="income-amount">
                                                {formatAmount(
                                                    transaction.amount
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </main>
    )
}

export default IncomePage
