
const mongoose = require('mongoose')

// Define the user structure for authentication and access control.
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        role: {
            type: String,
            enum: ['client', 'freelancer'],
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema)
