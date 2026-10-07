function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'unauthorized' })
        }

        const userRole = String(req.user.role || '').toLowerCase()

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ error: 'forbidden' })
        }

        next()
    }
}

module.exports = authorizeRoles
