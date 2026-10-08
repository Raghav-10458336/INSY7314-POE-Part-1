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

        try {
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
        } catch (transactionError) {
            // Prevent a booking from remaining without its required transaction.
            try {
                await Booking.deleteOne({
                    _id: booking._id
                })
            } catch (rollbackError) {
                console.error(
                    'Booking rollback failed after transaction error:',
                    rollbackError.message
                )
            }

            throw transactionError
        }
    } catch (err) {
        next(err)
    }
}

async function getMyBookings(req, res, next) {
    try {
        const bookings = await Booking.find({
            client: req.user.id
        })
            .populate(
                'gig',
                'title description category price deliveryDays freelancer'
            )
            .sort({ createdAt: -1 })
            .lean()

        const bookingIds = bookings.map(booking => booking._id)

        const transactions = await Transaction.find({
            booking: {
                $in: bookingIds
            }
        })
            .select('booking _id status amount')
            .lean()

        const transactionMap = new Map(
            transactions.map(transaction => [
                transaction.booking.toString(),
                transaction
            ])
        )

        const bookingsWithTransactions = bookings.map(booking => {
            const transaction = transactionMap.get(
                booking._id.toString()
            )

            return {
                ...booking,
                transactionId: transaction?._id || null,
                transactionStatus: transaction?.status || null
            }
        })

        res.status(200).json({
            count: bookingsWithTransactions.length,
            bookings: bookingsWithTransactions
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
            .populate(
                'gig',
                'title description category price deliveryDays'
            )
            .sort({ createdAt: -1 })
            .lean()

        const bookingIds = bookings.map(booking => booking._id)

        const transactions = await Transaction.find({
            booking: {
                $in: bookingIds
            }
        })
            .select('booking _id status amount')
            .lean()

        const transactionMap = new Map(
            transactions.map(transaction => [
                transaction.booking.toString(),
                transaction
            ])
        )

        const bookingsWithTransactions = bookings.map(booking => {
            const transaction = transactionMap.get(
                booking._id.toString()
            )

            return {
                ...booking,
                transactionId: transaction?._id || null,
                transactionStatus: transaction?.status || null
            }
        })

        res.status(200).json({
            count: bookingsWithTransactions.length,
            bookings: bookingsWithTransactions
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