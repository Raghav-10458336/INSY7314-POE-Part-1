const express = require('express')
const router = express.Router()

const {
    register,
    login
} = require('../controllers/authController')

const authenticateToken = require('../middleware/authMiddleware')
const {
    registerValidation,
    loginValidation,
    handleValidationErrors
} = require('../middleware/validation')

router.post(
    '/register',
    registerValidation,
    handleValidationErrors,
    register
)

router.post(
    '/login',
    loginValidation,
    handleValidationErrors,
    login
)

router.get('/me', authenticateToken, (req, res) => {
    res.status(200).json({
        message: 'protected route accessed successfully',
        user: req.user
    })
})

module.exports = router
