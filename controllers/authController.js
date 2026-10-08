
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { ApiError } = require('../middleware/errorHandler')

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

// Authenticate a user and generate a signed JWT.
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

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        )

        if (!passwordMatches) {
            throw new ApiError(401, 'invalid email or password')
        }

        // Sign the token using the approved algorithm and expiry.
        const token = jwt.sign(
            {
                id: user._id.toString(),
                role: user.role
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

module.exports = {
    register,
    login
}
