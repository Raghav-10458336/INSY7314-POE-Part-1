
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'
import { useAuth } from '../context/useAuth'
import { getIncome } from '../api/incomeApi'
import './IncomePage.css'

const CHART_COLORS = {
    earnings: '#12847f',
    tax: '#e6a14b',
    afterTax: '#183a58'
}

function formatDate(date) {
    const parsed = new Date(date)

    if (!date || Number.isNaN(parsed.getTime())) {
        return 'Date unavailable'
    }

    return parsed.toLocaleDateString('en-ZA')
}

function formatAmount(amount) {
    const value = Number(amount)
    const safeValue = Number.isFinite(value) ? value : 0

    return `R${safeValue.toLocaleString('en-ZA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`
}

function formatChartAmount(value) {
    const amount = Number(value) || 0

    if (Math.abs(amount) >= 1000000) {
        return `R${(amount / 1000000).toFixed(1)}m`
    }

    if (Math.abs(amount) >= 1000) {
        return `R${(amount / 1000).toFixed(0)}k`
    }

    return `R${amount}`
}

function getMonthlyEarnings(transactions, taxYearStart, taxYearEnd) {
    const monthlyTotals = new Map()

    // Use UTC dates to keep grouping consistent with API timestamps.
    const start = taxYearStart
        ? new Date(`${taxYearStart}T00:00:00Z`)
        : null
    const end = taxYearEnd
        ? new Date(`${taxYearEnd}T23:59:59.999Z`)
        : null

    if (start && end &&
        !Number.isNaN(start.getTime()) &&
        !Number.isNaN(end.getTime()) &&
        start <= end) {
        const current = new Date(Date.UTC(
            start.getUTCFullYear(),
            start.getUTCMonth(),
            1
        ))

        while (current <= end && monthlyTotals.size < 24) {
            const key = current.toISOString().slice(0, 7)
            monthlyTotals.set(key, 0)
            current.setUTCMonth(current.getUTCMonth() + 1)
        }
    }

    for (const transaction of transactions) {
        if (transaction.status !== 'confirmed') {
            continue
        }

        const date = new Date(transaction.createdAt)
        const amount = Number(transaction.amount)

        if (Number.isNaN(date.getTime()) ||
            !Number.isFinite(amount) ||
            amount < 0) {
            continue
        }

        if (start && date < start) continue
        if (end && date > end) continue

        const key = date.toISOString().slice(0, 7)

        monthlyTotals.set(
            key,
            (monthlyTotals.get(key) || 0) + amount
        )
    }

    return [...monthlyTotals.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, amount]) => {
            const [year, month] = key.split('-').map(Number)

            return {
                month: new Date(Date.UTC(year, month - 1, 1))
                    .toLocaleDateString('en-GB', {
                        month: 'short',
                        year: '2-digit',
                        timeZone: 'UTC'
                    }),
                earnings: Number(amount.toFixed(2))
            }
        })
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

    const financial = income?.financialSummary
    const taxCalculation = financial?.taxCalculation

    const monthlyEarnings = getMonthlyEarnings(
        transactions,
        financial?.taxYearStart,
        financial?.taxYearEnd
    )

    const estimatedTax = Math.max(
        0,
        Number(financial?.estimatedTax) || 0
    )

    const afterTaxIncome = Math.max(
        0,
        Number(financial?.estimatedAfterTaxIncome) || 0
    )

    const taxChartData = [
        {
            name: 'After-tax income',
            value: afterTaxIncome,
            color: CHART_COLORS.afterTax
        },
        {
            name: 'Estimated tax',
            value: estimatedTax,
            color: CHART_COLORS.tax
        }
    ]

    const hasTaxChartData = taxChartData.some(
        item => item.value > 0
    )

    return (
        <main className="page-shell">
            <header className="page-header">
                <p className="eyebrow">HustleHub+</p>
                <h1>Income &amp; Tax Dashboard</h1>
                <p>
                    Track earnings from confirmed bookings and view
                    your estimated South African income tax.
                </p>

                <div className="income-nav">
                    <Link
                        className="income-back-link"
                        to="/my-gigs"
                    >
                        Back to My Gigs
                    </Link>

                    <button
                        className="income-logout-button"
                        type="button"
                        onClick={handleLogout}
                    >
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
                    <section
                        className="income-summary"
                        aria-label="Overall income summary"
                    >
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

                    {financial && (
                        <section
                            className="income-tax-section"
                            aria-label="Tax estimation summary"
                        >
                            <div className="income-section-heading">
                                <div>
                                    <p className="eyebrow">
                                        Financial overview
                                    </p>
                                    <h2>
                                        Tax year {financial.taxYear}
                                    </h2>
                                    <p>
                                        {financial.taxYearStart} to{' '}
                                        {financial.taxYearEnd}
                                    </p>
                                </div>
                            </div>

                            <div className="income-tax-grid">
                                <div className="income-stat">
                                    <span>Tax-year earnings</span>
                                    <strong>
                                        {formatAmount(
                                            financial.taxYearIncome
                                        )}
                                    </strong>
                                </div>

                                <div className="income-stat income-stat-tax">
                                    <span>Estimated income tax</span>
                                    <strong>
                                        {formatAmount(
                                            financial.estimatedTax
                                        )}
                                    </strong>
                                </div>

                                <div className="income-stat income-stat-net">
                                    <span>After-tax estimate</span>
                                    <strong>
                                        {formatAmount(
                                            financial.estimatedAfterTaxIncome
                                        )}
                                    </strong>
                                </div>

                                <div className="income-stat">
                                    <span>Effective tax rate</span>
                                    <strong>
                                        {financial.effectiveTaxRate ?? 0}%
                                    </strong>
                                </div>
                            </div>

                            <section
                                className="income-charts"
                                aria-label="Income visualisations"
                            >
                                <div className="income-chart-card">
                                    <div className="income-chart-heading">
                                        <h3>Monthly Earnings</h3>
                                        <p>
                                            Confirmed income by month
                                            for the selected tax year.
                                        </p>
                                    </div>

                                    <div
                                        className="income-chart-container"
                                        role="img"
                                        aria-label="Bar chart of monthly earnings"
                                    >
                                        <ResponsiveContainer
                                            width="100%"
                                            height={300}
                                        >
                                            <BarChart
                                                data={monthlyEarnings}
                                                margin={{
                                                    top: 12,
                                                    right: 12,
                                                    left: 4,
                                                    bottom: 8
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    vertical={false}
                                                />
                                                <XAxis
                                                    dataKey="month"
                                                    tick={{ fontSize: 11 }}
                                                    interval="preserveStartEnd"
                                                />
                                                <YAxis
                                                    tickFormatter={formatChartAmount}
                                                    tick={{ fontSize: 11 }}
                                                    width={65}
                                                />
                                                <Tooltip
                                                    formatter={value => [
                                                        formatAmount(value),
                                                        'Earnings'
                                                    ]}
                                                />
                                                <Bar
                                                    dataKey="earnings"
                                                    name="Earnings"
                                                    fill={CHART_COLORS.earnings}
                                                    radius={[5, 5, 0, 0]}
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div className="income-chart-card">
                                    <div className="income-chart-heading">
                                        <h3>Income vs Estimated Tax</h3>
                                        <p>
                                            Estimated breakdown of
                                            tax-year earnings.
                                        </p>
                                    </div>

                                    {hasTaxChartData ? (
                                        <div
                                            className="income-chart-container"
                                            role="img"
                                            aria-label="Doughnut chart comparing after-tax income and estimated tax"
                                        >
                                            <ResponsiveContainer
                                                width="100%"
                                                height={300}
                                            >
                                                <PieChart>
                                                    <Pie
                                                        data={taxChartData}
                                                        dataKey="value"
                                                        nameKey="name"
                                                        cx="50%"
                                                        cy="45%"
                                                        innerRadius={65}
                                                        outerRadius={95}
                                                        paddingAngle={3}
                                                    >
                                                        {taxChartData.map(item => (
                                                            <Cell
                                                                key={item.name}
                                                                fill={item.color}
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        formatter={value =>
                                                            formatAmount(value)
                                                        }
                                                    />
                                                    <Legend
                                                        verticalAlign="bottom"
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    ) : (
                                        <div className="income-chart-empty">
                                            No tax-year income to chart yet.
                                        </div>
                                    )}
                                </div>
                            </section>

                            <div className="income-tax-details">
                                <h3>Tax calculation details</h3>

                                <div className="income-tax-detail-grid">
                                    <p>
                                        Marginal tax rate:{' '}
                                        <strong>
                                            {financial.marginalTaxRate ?? 0}%
                                        </strong>
                                    </p>

                                    <p>
                                        Primary rebate:{' '}
                                        <strong>
                                            {formatAmount(
                                                taxCalculation?.primaryRebate
                                            )}
                                        </strong>
                                    </p>

                                    <p>
                                        Tax-year confirmed transactions:{' '}
                                        <strong>
                                            {financial.taxYearTransactionCount ?? 0}
                                        </strong>
                                    </p>
                                </div>

                                <p className="income-tax-disclaimer">
                                    {taxCalculation?.assumptions?.disclaimer ||
                                        'Educational tax estimate only, not a SARS assessment.'}
                                    {' '}This estimate assumes a taxpayer
                                    under 65 and does not account for other
                                    income, deductible expenses or additional
                                    tax credits.
                                </p>
                            </div>
                        </section>
                    )}

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
