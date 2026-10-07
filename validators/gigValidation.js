const { body, validationResult } = require('express-validator')

const gigValidationRules = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 80 })
        .withMessage('title must be between 3 and 80 characters')
        .escape(),

    body('description')
        .trim()
        .isLength({ min: 10, max: 1000 })
        .withMessage('description must be between 10 and 1000 characters')
        .escape(),

    body('category')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('category must be between 2 and 50 characters')
        .escape(),

    body('price')
        .isFloat({ min: 0 })
        .withMessage('price must be a valid number greater than or equal to 0')
        .toFloat(),

    body('deliveryDays')
        .isInt({ min: 1, max: 365 })
        .withMessage('deliveryDays must be between 1 and 365')
        .toInt(),

    body('active')
        .optional()
        .isBoolean()
        .withMessage('active must be true or false')
        .toBoolean()
]

function handleGigValidationErrors(req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'invalid gig data',
            details: errors.array().map(error => ({
                field: error.path,
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
