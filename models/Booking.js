const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema(
    {
        gig: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Gig',
            required: true,
            index: true
        },
        client: {
            type: String,
            required: true,
            index: true
        },
        freelancer: {
            type: String,
            required: true,
            index: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        status: {
            type: String,
            enum: ['confirmed', 'cancelled'],
            default: 'confirmed',
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Booking', bookingSchema)