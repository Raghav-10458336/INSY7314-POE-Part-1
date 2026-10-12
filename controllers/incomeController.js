const Transaction = require('../models/Transaction')

async function getIncome(req, res, next) {
    try {
        // failed transactions never paid out, so they are left out of income
        const transactions = await Transaction.find({
            freelancer: req.user.id,
            status: 'confirmed'
        })
            .populate('gig', 'title category')
            .sort({ createdAt: -1 })
            .lean()

        const total = transactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        )

        res.status(200).json({
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
            }))
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    getIncome
}
