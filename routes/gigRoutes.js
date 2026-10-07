const express = require('express')
const router = express.Router()

const {
    getAllGigs,
    getMyGigs,
    createGig,
    updateGig,
    deleteGig
} = require('../controllers/gigController')

const authenticateToken = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')

const {
    gigValidationRules,
    handleGigValidationErrors
} = require('../validators/gigValidation')

router.get('/', getAllGigs)

router.get(
    '/my',
    authenticateToken,
    authorizeRoles('freelancer'),
    getMyGigs
)

router.post(
    '/',
    authenticateToken,
    authorizeRoles('freelancer'),
    gigValidationRules,
    handleGigValidationErrors,
    createGig
)

router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('freelancer'),
    gigValidationRules,
    handleGigValidationErrors,
    updateGig
)

router.delete(
    '/:id',
    authenticateToken,
    authorizeRoles('freelancer'),
    deleteGig
)

module.exports = router
