import axios from 'axios'

// Use the configured backend address for all API requests.
const backendUrl = (
    import.meta.env.VITE_API_URL || 'https://localhost:5000'
).replace(/\/+$/, '')

const api = axios.create({
    baseURL: `${backendUrl}/api`
})

// Attach the JWT to authenticated API requests.
api.interceptors.request.use(config => {
    const token = sessionStorage.getItem('authToken')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

// Detect expired or invalid authentication sessions.
api.interceptors.response.use(
    response => response,
    error => {
        const token = sessionStorage.getItem('authToken')

        // Only clear sessions rejected by an authenticated request.
        if (
            error.response?.status === 401 &&
            token &&
            error.config?.headers?.Authorization
        ) {
            sessionStorage.removeItem('authToken')

            // Notify React that the current session is no longer valid.
            window.dispatchEvent(new Event('auth:expired'))
        }

        return Promise.reject(error)
    }
)

export default api