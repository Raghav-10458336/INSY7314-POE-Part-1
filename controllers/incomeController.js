
const Transaction = require('../models/Transaction')
const { calculateTax, TAX_YEAR } = require('../services/taxCalculator')

async function getIncome(req, res, next) {
    try {
        // Only confirmed transactions count towards freelancer earnings.
        const transactions = await Transaction.find({
            freelancer: req.user.id,
            status: 'confirmed'
        })
            .populate('gig', 'title category')
            .sort({ createdAt: -1 })
            .lean()

        // Preserve the existing all-time income calculations.
        const total = transactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        )

        // Use UTC boundaries to include the complete 2027 tax year.
        const taxYearStart = new Date('2026-03-01T00:00:00.000Z')
        const taxYearEndExclusive = new Date('2027-03-01T00:00:00.000Z')

        const taxYearTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.createdAt)

            return (
                Number.isFinite(transactionDate.getTime()) &&
                transactionDate >= taxYearStart &&
                transactionDate < taxYearEndExclusive
            )
        })

        const taxYearIncome = taxYearTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        )

        // Estimate tax using recorded marketplace earnings only.
        const taxEstimate = calculateTax(taxYearIncome)

        // Group confirmed transactions by month for dashboard charts.
        const monthlyIncomeMap = new Map()

        for (const transaction of taxYearTransactions) {
            const date = new Date(transaction.createdAt)
            const month = date.toISOString().slice(0, 7)

            const currentAmount = monthlyIncomeMap.get(month) || 0

            monthlyIncomeMap.set(
                month,
                currentAmount + transaction.amount
            )
        }

        const monthlyIncome = Array.from(monthlyIncomeMap.entries())
            .sort(([monthA], [monthB]) => monthA.localeCompare(monthB))
            .map(([month, income]) => ({
                month,
                income: Math.round(income * 100) / 100
            }))

        res.status(200).json({
            // Existing Part 2 response fields.
            totalIncome: Math.round(total * 100) / 100,
            transactionCount: transactions.length,
            transactions: transactions.map(transaction => ({
                _id: transaction._id,
                booking: transaction.booking,
                gig: transaction.gig
                    ? {
                        title: transaction.gig.title,
                        category: transaction.gig.category
                    }
                    : null,
                amount: transaction.amount,
                status: transaction.status,
                createdAt: transaction.createdAt
            })),

            // New Part 3 financial dashboard fields.
            financialSummary: {
                taxYear: TAX_YEAR.label,
                taxYearStart: TAX_YEAR.startDate,
                taxYearEnd: TAX_YEAR.endDate,
                taxYearIncome: Math.round(taxYearIncome * 100) / 100,
                taxYearTransactionCount: taxYearTransactions.length,
                estimatedTax: taxEstimate.estimatedTax,
                estimatedAfterTaxIncome: taxEstimate.netIncome,
                marginalTaxRate: taxEstimate.marginalTaxRate,
                effectiveTaxRate: taxEstimate.effectiveTaxRate,
                taxCalculation: taxEstimate,
                monthlyIncome,
                disclaimer:
                    'This is an educational estimate based on confirmed ' +
                    'HustleHub+ earnings recorded during the tax year. ' +
                    'It assumes these earnings represent annual taxable income. ' +
                    'Other income, business expenses, deductions and additional ' +
                    'tax credits are excluded. This is not a SARS assessment.'
            }
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getIncome
}
