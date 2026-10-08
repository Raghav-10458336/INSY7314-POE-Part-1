import api from './api'

// Authenticate the user and retrieve their JWT.
export async function loginUser(email, password) {
    const response = await api.post('/auth/login', {
        email,
        password
    })

    return response.data
}

// Register a new client or freelancer account.
export async function registerUser(userData) {
    const response = await api.post('/auth/register', userData)

    return response.data
}

// Retrieve the user associated with the JWT.
export async function getCurrentUser() {
    const response = await api.get('/auth/me')

    return response.data
}