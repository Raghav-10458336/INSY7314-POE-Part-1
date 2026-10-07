const mongoose = require('mongoose')

const gigSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 80
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 1000
        },
        category: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        deliveryDays: {
            type: Number,
            required: true,
            min: 1,
            max: 365
        },
        freelancer: {
            type: String,
            required: true,
            index: true
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Gig', gigSchema)
