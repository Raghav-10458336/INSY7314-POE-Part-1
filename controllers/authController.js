
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { ApiError } = require('../middleware/errorHandler')

// Member 4 security configuration.
const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000

// Register a new user and securely store their details in MongoDB.
async function register(req, res, next) {
    try {
        const { name, email, password, role } = req.body

        const normalizedEmail = email.trim().toLowerCase()

        // Prevent duplicate account registration.
        const existingUser = await User.findOne({
            email: normalizedEmail
        })

        if (existingUser) {
            throw new ApiError(400, 'email already registered')
        }

        // Hash the password before storing it.
        const hashedPassword = await bcrypt.hash(password, 10)

        // Include all required fields when creating the account.
        const newUser = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role
        })

        // Return only safe account details.
        res.status(201).json({
            message: 'user registered successfully',
            user: {
                id: newUser._id.toString(),
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        })
    } catch (err) {
        // Handle duplicate emails caused by concurrent registrations.
        if (err.code === 11000) {
            return next(new ApiError(400, 'email already registered'))
        }

        next(err)
    }
}

// Authenticate a user with account-based lockout protection.
async function login(req, res, next) {
    try {
        const { email, password } = req.body

        const normalizedEmail = email.trim().toLowerCase()

        // Explicitly retrieve the stored password hash.
        const user = await User.findOne({
            email: normalizedEmail
        }).select('+password')

        // Use the same response for unknown emails and incorrect passwords.
        if (!user) {
            throw new ApiError(401, 'invalid email or password')
        }

        const now = new Date()

        // Reject login attempts while the account is locked.
        if (user.lockUntil && user.lockUntil > now) {
            throw new ApiError(
                423,
                'account temporarily locked. Please try again later.'
            )
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        )

        if (!passwordMatches) {
            const lockExpiry = new Date(
                Date.now() + LOCKOUT_DURATION_MS
            )

            // Atomically increment failed attempts.
            // If a previous lockout has expired, start a new sequence.
            await User.findByIdAndUpdate(
                user._id,
                [
                    {
                        $set: {
                            failedLoginAttempts: {
                                $cond: [
                                    {
                                        $and: [
                                            {
                                                $ne: [
                                                    {
                                                        $ifNull: [
                                                            '$lockUntil',
                                                            null
                                                        ]
                                                    },
                                                    null
                                                ]
                                            },
                                            {
                                                $lte: [
                                                    '$lockUntil',
                                                    now
                                                ]
                                            }
                                        ]
                                    },
                                    1,
                                    {
                                        $add: [
                                            {
                                                $ifNull: [
                                                    '$failedLoginAttempts',
                                                    0
                                                ]
                                            },
                                            1
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        $set: {
                            lockUntil: {
                                $cond: [
                                    {
                                        $gte: [
                                            '$failedLoginAttempts',
                                            MAX_FAILED_ATTEMPTS
                                        ]
                                    },
                                    lockExpiry,
                                    null
                                ]
                            }
                        }
                    }
                ]
            )

            throw new ApiError(401, 'invalid email or password')
        }

        // Successful login resets the failed-attempt counter and lockout.
        await User.findByIdAndUpdate(user._id, {
            $set: {
                failedLoginAttempts: 0,
                lockUntil: null
            }
        })

        // Sign the token using the approved algorithm and expiry.
        const token = jwt.sign(
            {
                id: user._id.toString(),
                role: user.role,
                tokenVersion: user.tokenVersion || 0
            },
            process.env.JWT_SECRET,
            {
                algorithm: 'HS256',
                expiresIn: '1h'
            }
        )

        res.status(200).json({
            message: 'login successful',
            token
        })
    } catch (err) {
        next(err)
    }
}

// Change a user's password and invalidate existing sessions.
async function changePassword(req, res, next) {
    try {
        const { currentPassword, newPassword } = req.body

        // Retrieve the authenticated user's password hash.
        const user = await User.findById(req.user.id)
            .select('+password')

        if (!user) {
            throw new ApiError(401, 'unauthorized')
        }

        // Verify the existing password.
        const passwordMatches = await bcrypt.compare(
            currentPassword,
            user.password
        )

        if (!passwordMatches) {
            throw new ApiError(400, 'current password is incorrect')
        }

        // Prevent setting the same password again.
        const samePassword = await bcrypt.compare(
            newPassword,
            user.password
        )

        if (samePassword) {
            throw new ApiError(
                400,
                'new password must be different from the current password'
            )
        }

        // Hash the new password before updating MongoDB.
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update the password and increment the token version.
        // Previously issued JWTs will no longer be accepted.
        await User.findByIdAndUpdate(user._id, {
            $set: {
                password: hashedPassword,
                failedLoginAttempts: 0,
                lockUntil: null
            },
            $inc: {
                tokenVersion: 1
            }
        })

        res.status(200).json({
            message: 'password changed successfully. Please log in again.'
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    register,
    login,
    changePassword
}
