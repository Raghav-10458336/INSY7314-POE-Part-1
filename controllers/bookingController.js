const mongoose = require('mongoose')
const Gig = require('../models/Gig')
const Booking = require('../models/Booking')
const Transaction = require('../models/Transaction')
const { ApiError } = require('../middleware/errorHandler')

async function createBooking(req, res, next) {
    try {
        const { gigId } = req.body

        // Validate the supplied gig ID before querying MongoDB.
        if (!mongoose.isValidObjectId(gigId)) {
            throw new ApiError(400, 'invalid gig')
        }

        // Only active gigs can be booked.
        const gig = await Gig.findOne({
            _id: gigId,
            active: true
        })

        if (!gig) {
            throw new ApiError(404, 'gig not found or unavailable')
        }

        // Prevent a freelancer from booking their own gig.
        if (gig.freelancer === req.user.id) {
            throw new ApiError(403, 'you cannot book your own gig')
        }

        // Create the booking using only trusted backend values.
        const booking = await Booking.create({
            gig: gig._id,
            client: req.user.id,
            freelancer: gig.freelancer,
            amount: gig.price,
            status: 'confirmed'
        })

        // Create the transaction automatically after a successful booking.
        const transaction = await Transaction.create({
            booking: booking._id,
            gig: gig._id,
            client: req.user.id,
            freelancer: gig.freelancer,
            amount: gig.price,
            status: 'confirmed'
        })

        res.status(201).json({
            message: 'booking confirmed successfully',
            booking,
            transaction
        })
    } catch (err) {
        next(err)
    }
}

async function getMyBookings(req, res, next) {
    try {
        const bookings = await Booking.find({
            client: req.user.id
        })
            .populate('gig', 'title description category price deliveryDays freelancer')
            .sort({ createdAt: -1 })

        res.status(200).json({
            count: bookings.length,
            bookings
        })
    } catch (err) {
        next(err)
    }
}

async function getFreelancerBookings(req, res, next) {
    try {
        const bookings = await Booking.find({
            freelancer: req.user.id
        })
            .populate('gig', 'title description category price deliveryDays')
            .sort({ createdAt: -1 })

        res.status(200).json({
            count: bookings.length,
            bookings
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createBooking,
    getMyBookings,
    getFreelancerBookings
}