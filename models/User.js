
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
        },

        
        failedLoginAttempts: {
            type: Number,
            default: 0,
            min: 0
        },

        // Store the temporary account lockout expiry.
        lockUntil: {
            type: Date,
            default: null
        },

        // Invalidate previously issued JWT sessions.
        tokenVersion: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', userSchema)
