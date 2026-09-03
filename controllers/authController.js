const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { ApiError } = require('../middleware/errorHandler')

const usersFilePath = path.join(__dirname, '..', 'data', 'users.json')

function readUsers() {
    const data = fs.readFileSync(usersFilePath, 'utf8')
    return JSON.parse(data)
}

function saveUsers(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2))
}

async function register(req, res, next) {
    try {
        const { name, email, password, role } = req.body

        const users = readUsers()

        const existingUser = users.find(
            user => user.email.toLowerCase() === email.toLowerCase()
        )

        if (existingUser) {
            throw new ApiError(400, 'email already registered')
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            role
        }

        users.push(newUser)
        saveUsers(users)

        res.status(201).json({
            message: 'user registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        })
    } catch (err) {
        next(err)
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body

        const users = readUsers()

        const user = users.find(
            user => user.email.toLowerCase() === email.toLowerCase()
        )

        if (!user) {
            throw new ApiError(401, 'invalid email or password')
        }

        const passwordMatches = await bcrypt.compare(password, user.password)

        if (!passwordMatches) {
            throw new ApiError(401, 'invalid email or password')
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
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


