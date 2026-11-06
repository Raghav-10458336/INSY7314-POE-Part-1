
const test = require('node:test')
const assert = require('node:assert/strict')

const {
    calculateTax,
    TAX_YEAR
} = require('../services/taxCalculator')

// Verify the configured South African tax year.
test('uses the 2027 South African tax year', () => {
    assert.equal(TAX_YEAR.label, '2026/2027')
    assert.equal(TAX_YEAR.startDate, '2026-03-01')
    assert.equal(TAX_YEAR.endDate, '2027-02-28')
    assert.equal(TAX_YEAR.primaryRebate, 17820)
})

// Verify freelancers with no income owe no estimated tax.
test('returns zero tax for zero annual income', () => {
    const result = calculateTax(0)

    assert.equal(result.annualIncome, 0)
    assert.equal(result.grossTax, 0)
    assert.equal(result.estimatedTax, 0)
    assert.equal(result.netIncome, 0)
    assert.equal(result.marginalTaxRate, 0)
    assert.equal(result.effectiveTaxRate, 0)
})

// Verify the primary rebate eliminates tax at the threshold.
test('returns zero tax at the R99000 threshold', () => {
    const result = calculateTax(99000)

    assert.equal(result.grossTax, 17820)
    assert.equal(result.estimatedTax, 0)
    assert.equal(result.netIncome, 99000)
})

// Verify income just above the tax threshold.
test('calculates tax immediately above the threshold', () => {
    const result = calculateTax(100000)

    assert.equal(result.estimatedTax, 180)
    assert.equal(result.netIncome, 99820)
    assert.equal(result.marginalTaxRate, 18)
})

// Verify the upper boundary of the first tax bracket.
test('calculates tax at the first bracket boundary', () => {
    const result = calculateTax(245100)

    assert.equal(result.grossTax, 44118)
    assert.equal(result.estimatedTax, 26298)
    assert.equal(result.marginalTaxRate, 18)
})

// Verify progressive tax across the first two brackets.
test('calculates progressive tax for R300000', () => {
    const result = calculateTax(300000)

    assert.equal(result.grossTax, 58392)
    assert.equal(result.primaryRebate, 17820)
    assert.equal(result.estimatedTax, 40572)
    assert.equal(result.netIncome, 259428)
    assert.equal(result.marginalTaxRate, 26)
    assert.equal(result.effectiveTaxRate, 13.52)
})

// Verify the upper boundary of the second tax bracket.
test('calculates tax at the second bracket boundary', () => {
    const result = calculateTax(383100)

    assert.equal(result.grossTax, 79998)
    assert.equal(result.estimatedTax, 62178)
    assert.equal(result.marginalTaxRate, 26)
})

// Verify the third progressive tax bracket.
test('calculates tax for R500000', () => {
    const result = calculateTax(500000)

    assert.equal(result.grossTax, 116237)
    assert.equal(result.estimatedTax, 98417)
    assert.equal(result.netIncome, 401583)
    assert.equal(result.marginalTaxRate, 31)
})

// Verify that a negative income is rejected.
test('rejects negative annual income', () => {
    assert.throws(
        () => calculateTax(-1000),
        RangeError
    )
})

// Verify that invalid numeric inputs are rejected.
test('rejects non-finite income values', () => {
    for (const income of [NaN, Infinity, -Infinity]) {
        assert.throws(
            () => calculateTax(income),
            RangeError
        )
    }
})

// Verify that text is not accepted as annual income.
test('rejects income supplied as text', () => {
    assert.throws(
        () => calculateTax('300000'),
        RangeError
    )
})

// Verify that the calculation returns documented assumptions.
test('returns currency and calculation assumptions', () => {
    const result = calculateTax(300000)

    assert.equal(result.currency, 'ZAR')
    assert.equal(result.taxYear, '2026/2027')
    assert.equal(result.assumptions.age, 'Under 65')
    assert.equal(result.assumptions.otherIncomeIncluded, false)
    assert.equal(result.assumptions.deductionsIncluded, false)
    assert.equal(result.assumptions.additionalTaxCreditsIncluded, false)
    assert.ok(result.assumptions.disclaimer)
})
