const express = require('express')
const router = express.Router()

const { getIncome } = require('../controllers/incomeController')

const authenticateToken = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')

router.get(
    '/',
    authenticateToken,
    authorizeRoles('freelancer'),
    getIncome
)

module.exports = router
