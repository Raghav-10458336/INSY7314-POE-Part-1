const { body, validationResult } = require('express-validator')

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('name is required')
    .isLength({ min: 2, max: 50 }).withMessage('name must be between 2 and 50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('email must be valid')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('password is required')
    .isLength({ min: 8, max: 128 }).withMessage('password must be between 8 and 128 characters'),

  body('role')
    .trim()
    .notEmpty().withMessage('role is required')
    .customSanitizer(value => typeof value === 'string' ? value.toLowerCase() : value)
    .isIn(['client', 'freelancer']).withMessage('role must be either client or freelancer')
]

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('email must be valid')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('password is required')
]

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'validation failed',
      details: errors.array().map(error => ({
        field: error.path,
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
