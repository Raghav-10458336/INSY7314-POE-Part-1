
const {
    body,
    validationResult,
    checkExact
} = require('express-validator')

// Validate and sanitise gig details before database operations.
const gigValidationRules = [
    body('title')
        .isString().withMessage('title must be text')
        .bail()
        .trim()
        .isLength({ min: 3, max: 80 })
        .withMessage('title must be between 3 and 80 characters')
        .bail()
        .escape(),

    body('description')
        .isString().withMessage('description must be text')
        .bail()
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('description must be between 10 and 1000 characters')
        .bail()
        .escape(),

    body('category')
        .isString().withMessage('category must be text')
        .bail()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('category must be between 2 and 50 characters')
        .bail()
        .escape(),

    body('price')
        .isFloat({ min: 0 })
        .withMessage('price must be a valid number greater than or equal to 0')
        .bail()
        .toFloat(),

    body('deliveryDays')
        .isInt({ min: 1, max: 365 })
        .withMessage('deliveryDays must be between 1 and 365')
        .bail()
        .toInt(),

    body('active')
        .optional()
        .isBoolean()
        .withMessage('active must be true or false')
        .bail()
        .toBoolean(),

    // Reject properties that are not part of the gig form.
    checkExact([], {
        message: 'unexpected gig fields'
    })
]

// Return consistent validation errors to the frontend.
function handleGigValidationErrors(req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'invalid gig data',
            details: errors.array().map(error => ({
                field: error.path || 'request',
                message: error.msg
            }))
        })
    }

    next()
}

module.exports = {
    gigValidationRules,
    handleGigValidationErrors
}
