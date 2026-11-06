
const test = require('node:test')
const assert = require('node:assert/strict')

const Transaction = require('../models/Transaction')
const { getIncome } = require('../controllers/incomeController')

// Create a mock transaction with realistic defaults.
function makeTransaction(overrides = {}) {
    return {
        _id: 'transaction-1',
        booking: 'booking-1',
        gig: {
            title: 'Test Gig',
            category: 'Software Development'
        },
        freelancer: 'freelancer-1',
        amount: 1000,
        status: 'confirmed',
        createdAt: new Date('2026-11-06T10:00:00.000Z'),
        ...overrides
    }
}

// Replace the database query with predictable test transactions.
async function runIncomeController(transactions) {
    const originalFind = Transaction.find

    Transaction.find = () => ({
        populate() {
            return this
        },
        sort() {
            return this
        },
        lean: async () => transactions
    })

    const req = {
        user: {
            id: 'freelancer-1'
        }
    }

    let statusCode = null
    let responseBody = null
    let controllerError = null

    const res = {
        status(code) {
            statusCode = code
            return this
        },
        json(body) {
            responseBody = body
            return this
        }
    }

    try {
        await getIncome(req, res, error => {
            controllerError = error
        })
    } finally {
        Transaction.find = originalFind
    }

    if (controllerError) {
        throw controllerError
    }

    return {
        statusCode,
        body: responseBody
    }
}

test('returns zero income when no transactions exist', async () => {
    const result = await runIncomeController([])

    assert.equal(result.statusCode, 200)
    assert.equal(result.body.totalIncome, 0)
    assert.equal(result.body.transactionCount, 0)
    assert.deepEqual(result.body.transactions, [])
    assert.equal(result.body.financialSummary.estimatedTax, 0)
    assert.deepEqual(result.body.financialSummary.monthlyIncome, [])
})

test('calculates income and tax from a confirmed transaction', async () => {
    const result = await runIncomeController([
        makeTransaction({
            amount: 300000
        })
    ])

    assert.equal(result.statusCode, 200)
    assert.equal(result.body.totalIncome, 300000)
    assert.equal(result.body.transactionCount, 1)
    assert.equal(result.body.financialSummary.taxYearIncome, 300000)
    assert.equal(result.body.financialSummary.estimatedTax, 40572)
    assert.equal(
        result.body.financialSummary.estimatedAfterTaxIncome,
        259428
    )
})

test('excludes previous tax-year transactions from tax estimation', async () => {
    const result = await runIncomeController([
        makeTransaction({
            _id: 'old-transaction',
            amount: 50000,
            createdAt: new Date('2026-02-28T12:00:00.000Z')
        }),
        makeTransaction({
            _id: 'current-transaction',
            amount: 300000,
            createdAt: new Date('2026-11-06T10:00:00.000Z')
        })
    ])

    assert.equal(result.body.totalIncome, 350000)
    assert.equal(result.body.transactionCount, 2)
    assert.equal(result.body.financialSummary.taxYearIncome, 300000)
    assert.equal(result.body.financialSummary.estimatedTax, 40572)
    assert.equal(result.body.financialSummary.taxYearTransactionCount, 1)
})

test('groups transactions correctly by month', async () => {
    const result = await runIncomeController([
        makeTransaction({
            _id: 'transaction-1',
            amount: 10000,
            createdAt: new Date('2026-04-05T10:00:00.000Z')
        }),
        makeTransaction({
            _id: 'transaction-2',
            amount: 15000,
            createdAt: new Date('2026-04-20T10:00:00.000Z')
        }),
        makeTransaction({
            _id: 'transaction-3',
            amount: 20000,
            createdAt: new Date('2026-05-10T10:00:00.000Z')
        })
    ])

    assert.deepEqual(result.body.financialSummary.monthlyIncome, [
        {
            month: '2026-04',
            income: 25000
        },
        {
            month: '2026-05',
            income: 20000
        }
    ])

    assert.equal(result.body.financialSummary.taxYearIncome, 45000)
})

test('excludes transactions after the tax year ends', async () => {
    const result = await runIncomeController([
        makeTransaction({
            amount: 300000,
            createdAt: new Date('2027-03-01T00:00:00.000Z')
        })
    ])

    assert.equal(result.body.totalIncome, 300000)
    assert.equal(result.body.financialSummary.taxYearIncome, 0)
    assert.equal(result.body.financialSummary.estimatedTax, 0)
})

test('preserves existing Part 2 transaction response fields', async () => {
    const result = await runIncomeController([
        makeTransaction({
            amount: 5000
        })
    ])

    const transaction = result.body.transactions[0]

    assert.equal(transaction._id, 'transaction-1')
    assert.equal(transaction.booking, 'booking-1')
    assert.equal(transaction.gig.title, 'Test Gig')
    assert.equal(transaction.gig.category, 'Software Development')
    assert.equal(transaction.amount, 5000)
    assert.equal(transaction.status, 'confirmed')
    assert.ok(transaction.createdAt)
})

test('handles transactions without a populated gig', async () => {
    const result = await runIncomeController([
        makeTransaction({
            gig: null
        })
    ])

    assert.equal(result.statusCode, 200)
    assert.equal(result.body.transactions[0].gig, null)
})
