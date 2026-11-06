
const TAX_YEAR = {
    label: '2026/2027',
    startDate: '2026-03-01',
    endDate: '2027-02-28',
    primaryRebate: 17820,
    ageAssumption: 'Under 65'
};

// SARS individual income tax brackets for the 2027 tax year.
const TAX_BRACKETS = [
    { limit: 245100, rate: 0.18 },
    { limit: 383100, rate: 0.26 },
    { limit: 530200, rate: 0.31 },
    { limit: 695800, rate: 0.36 },
    { limit: 887000, rate: 0.39 },
    { limit: 1878600, rate: 0.41 },
    { limit: Infinity, rate: 0.45 }
];

function roundMoney(amount) {
    return Math.round((amount + Number.EPSILON) * 100) / 100;
}

function calculateTax(annualIncome) {
    if (
        typeof annualIncome !== 'number' ||
        !Number.isFinite(annualIncome) ||
        annualIncome < 0
    ) {
        throw new RangeError(
            'Annual income must be a finite, non-negative number.'
        );
    }

    let remainingIncome = annualIncome;
    let previousLimit = 0;
    let grossTax = 0;
    let marginalRate = 0;

    for (const bracket of TAX_BRACKETS) {
        if (remainingIncome <= 0) {
            break;
        }

        const bracketSize = bracket.limit - previousLimit;
        const taxableAmount = Math.min(remainingIncome, bracketSize);

        grossTax += taxableAmount * bracket.rate;
        remainingIncome -= taxableAmount;
        marginalRate = bracket.rate;
        previousLimit = bracket.limit;
    }

    // The primary rebate cannot reduce tax below zero.
    const estimatedTax = Math.max(
        0,
        roundMoney(grossTax - TAX_YEAR.primaryRebate)
    );

    const netIncome = roundMoney(annualIncome - estimatedTax);
    const effectiveTaxRate = annualIncome === 0
        ? 0
        : roundMoney((estimatedTax / annualIncome) * 100);

    return {
        taxYear: TAX_YEAR.label,
        annualIncome: roundMoney(annualIncome),
        grossTax: roundMoney(grossTax),
        primaryRebate: TAX_YEAR.primaryRebate,
        estimatedTax,
        netIncome,
        marginalTaxRate: roundMoney(marginalRate * 100),
        effectiveTaxRate,
        currency: 'ZAR',
        assumptions: {
            age: TAX_YEAR.ageAssumption,
            incomeBasis: 'Annual taxable income',
            otherIncomeIncluded: false,
            deductionsIncluded: false,
            additionalTaxCreditsIncluded: false,
            disclaimer: 'Educational estimate only, not a SARS assessment.'
        }
    };
}

module.exports = {
    TAX_YEAR,
    TAX_BRACKETS,
    calculateTax
};
