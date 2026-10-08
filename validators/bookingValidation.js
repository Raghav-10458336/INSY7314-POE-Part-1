const {
    body,
    validationResult,
    checkExact
} = require('express-validator')

// Validate booking creation requests.
const bookingValidationRules = [
    body('gigId')
        .isString().withMessage('gigId must be text')
        .bail()
        .trim()
        .notEmpty().withMessage('gigId is required'),

    // Reject additional fields so the client cannot submit
    // client, freelancer, price, amount or other booking properties.
    checkExact([], {
        message: 'unexpected booking fields'
    })
]

// Return safe, consistent validation errors.
function handleBookingValidationErrors(req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'validation failed',
            details: errors.array().map(error => ({
                field: error.path || 'request',
                message: error.msg
            }))
        })
    }

    next()
}

module.exports = {
    bookingValidationRules,
    handleBookingValidationErrors
}