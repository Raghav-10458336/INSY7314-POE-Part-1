
const express = require('express')
const router = express.Router()

const {
    register,
    login,
    changePassword
} = require('../controllers/authController')

const authenticateToken = require('../middleware/authMiddleware')

const {
    registerValidation,
    loginValidation,
    changePasswordValidation,
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

// Change password and invalidate all previously issued JWTs.
router.patch(
    '/change-password',
    authenticateToken,
    changePasswordValidation,
    handleValidationErrors,
    changePassword
)

module.exports = router
