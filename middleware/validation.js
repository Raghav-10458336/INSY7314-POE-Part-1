
const {
    body,
    validationResult,
    checkExact
} = require('express-validator')

// Validate and normalise registration details.
const registerValidation = [
    body('name')
        .isString().withMessage('name must be text')
        .bail()
        .trim()
        .notEmpty().withMessage('name is required')
        .bail()
        .isLength({ min: 2, max: 50 })
        .withMessage('name must be between 2 and 50 characters'),

    body('email')
        .isString().withMessage('email must be text')
        .bail()
        .trim()
        .notEmpty().withMessage('email is required')
        .bail()
        .isEmail().withMessage('email must be valid')
        .bail()
        .isLength({ max: 254 })
        .withMessage('email must not exceed 254 characters')
        .bail()
        .toLowerCase(),

    // Validate passwords without trimming or escaping their contents.
    body('password')
        .isString().withMessage('password must be text')
        .bail()
        .notEmpty().withMessage('password is required')
        .bail()
        .isLength({ min: 8, max: 128 })
        .withMessage('password must be between 8 and 128 characters')
        .bail()
        .custom(value => Buffer.byteLength(value, 'utf8') <= 72)
        .withMessage('password must not exceed 72 bytes'),

    body('role')
        .isString().withMessage('role must be text')
        .bail()
        .trim()
        .toLowerCase()
        .isIn(['client', 'freelancer'])
        .withMessage('role must be either client or freelancer'),

    // Reject additional fields to prevent unexpected account properties.
    checkExact([], {
        message: 'unexpected registration fields'
    })
]

// Validate login details without modifying the supplied password.
const loginValidation = [
    body('email')
        .isString().withMessage('email must be text')
        .bail()
        .trim()
        .notEmpty().withMessage('email is required')
        .bail()
        .isEmail().withMessage('email must be valid')
        .bail()
        .isLength({ max: 254 })
        .withMessage('email must not exceed 254 characters')
        .bail()
        .toLowerCase(),

    body('password')
        .isString().withMessage('password must be text')
        .bail()
        .notEmpty().withMessage('password is required')
        .bail()
        .isLength({ max: 128 })
        .withMessage('password must not exceed 128 characters')
        .bail()
        .custom(value => Buffer.byteLength(value, 'utf8') <= 72)
        .withMessage('password must not exceed 72 bytes')
]

// Return safe, consistent validation errors.
function handleValidationErrors(req, res, next) {
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
    registerValidation,
    loginValidation,
    handleValidationErrors
}
