const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { ApiError } = require('../middleware/errorHandler')
const logger = require('../services/logger')

const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000

async function register(req, res, next) {
    try {
        const { name, email, password, role } = req.body
        const normalizedEmail = email.trim().toLowerCase()

        const existingUser = await User.findOne({
            email: normalizedEmail
        })

        if (existingUser) {
            throw new ApiError(400, 'email already registered')
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role
        })

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
        if (err.code === 11000) {
            return next(new ApiError(400, 'email already registered'))
        }

        next(err)
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body
        const normalizedEmail = email.trim().toLowerCase()

        const user = await User.findOne({
            email: normalizedEmail
        }).select('+password')

        if (!user) {
            logger.warn('login_failed', {
                reason: 'invalid_credentials',
                emailHash: logger.hashValue(normalizedEmail),
                ipHash: logger.hashValue(req.ip)
            })
            throw new ApiError(401, 'invalid email or password')
        }

        const now = new Date()

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
            logger.warn('login_failed', {
                reason: 'invalid_credentials',
                emailHash: logger.hashValue(normalizedEmail),
                userId: user._id.toString(),
                ipHash: logger.hashValue(req.ip)
            })
            // Start a new sequence if the previous lockout expired.
            if (user.lockUntil && user.lockUntil <= now) {
                user.failedLoginAttempts = 0
                user.lockUntil = null
            }

            user.failedLoginAttempts =
                (user.failedLoginAttempts || 0) + 1

            if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
                user.lockUntil = new Date(
                    Date.now() + LOCKOUT_DURATION_MS
                )
            }

            await user.save()

            throw new ApiError(401, 'invalid email or password')
        }

        // Reset the failed-login counter after successful authentication.
        user.failedLoginAttempts = 0
        user.lockUntil = null
        await user.save()

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

        logger.info('login_succeeded', {
            userId: user._id.toString(),
            role: user.role,
            ipHash: logger.hashValue(req.ip)
        })

        res.status(200).json({
            message: 'login successful',
            token
        })
    } catch (err) {
        next(err)
    }
}

async function changePassword(req, res, next) {
    try {
        const { currentPassword, newPassword } = req.body

        const user = await User.findById(req.user.id)
            .select('+password')

        if (!user) {
            throw new ApiError(401, 'unauthorized')
        }

        const passwordMatches = await bcrypt.compare(
            currentPassword,
            user.password
        )

        if (!passwordMatches) {
            throw new ApiError(400, 'current password is incorrect')
        }

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

        user.password = await bcrypt.hash(newPassword, 10)
        user.failedLoginAttempts = 0
        user.lockUntil = null
        user.tokenVersion = (user.tokenVersion || 0) + 1

        await user.save()

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
