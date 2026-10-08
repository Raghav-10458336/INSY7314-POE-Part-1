
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/User')

// Verify the JWT and confirm the authenticated user still exists.
async function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization

    // Require a properly formatted Bearer token.
    if (
        typeof authHeader !== 'string' ||
        !/^Bearer \S+$/i.test(authHeader)
    ) {
        return res.status(401).json({ error: 'unauthorized' })
    }

    const token = authHeader.slice(7)

    let decoded

    try {
        // Verify signature, expiration and expected signing algorithm.
        decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256']
        })
    } catch (err) {
        return res.status(401).json({ error: 'unauthorized' })
    }

    // Reject malformed payloads before querying MongoDB.
    if (
        !decoded ||
        typeof decoded !== 'object' ||
        typeof decoded.id !== 'string' ||
        !mongoose.isValidObjectId(decoded.id)
    ) {
        return res.status(401).json({ error: 'unauthorized' })
    }

    try {
        // Always retrieve the current role from the database.
        const user = await User.findById(decoded.id).select('_id role')

        if (!user) {
            return res.status(401).json({ error: 'unauthorized' })
        }

        // Attach trusted user information to the request.
        req.user = {
            id: user._id.toString(),
            role: user.role
        }

        next()
    } catch (err) {
        next(err)
    }
}

module.exports = authenticateToken
