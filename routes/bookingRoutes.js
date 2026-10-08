const express = require('express')
const router = express.Router()

const {
    createBooking,
    getMyBookings,
    getFreelancerBookings
} = require('../controllers/bookingController')

const authenticateToken = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')
const {
    bookingLimiter
} = require('../middleware/rateLimiters')

const {
    bookingValidationRules,
    handleBookingValidationErrors
} = require('../validators/bookingValidation')

// Create a booking as an authenticated client.
router.post(
    '/',
    authenticateToken,
    authorizeRoles('client'),
    bookingLimiter,
    bookingValidationRules,
    handleBookingValidationErrors,
    createBooking
)

// View bookings belonging to the authenticated client.
router.get(
    '/my',
    authenticateToken,
    authorizeRoles('client'),
    getMyBookings
)

// View bookings for gigs belonging to the authenticated freelancer.
router.get(
    '/freelancer',
    authenticateToken,
    authorizeRoles('freelancer'),
    getFreelancerBookings
)

module.exports = router