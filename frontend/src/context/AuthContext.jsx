
import { useEffect, useState } from 'react'
import { AuthContext } from './authContext'
import { getCurrentUser, loginUser } from '../api/authApi'

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        () => sessionStorage.getItem('authToken')
    )
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Restore the authenticated session after a browser refresh.
    useEffect(() => {
        let cancelled = false

        async function restoreSession() {
            if (!token) {
                setUser(null)
                setLoading(false)
                return
            }

            setLoading(true)

            try {
                const response = await getCurrentUser()

                if (!cancelled) {
                    setUser(response.user ?? response)
                }
            } catch (error) {
                if (!cancelled) {
                    // Clear invalid tokens, but preserve sessions during network outages.
                    if (error.response?.status === 401) {
                        sessionStorage.removeItem('authToken')
                        setToken(null)
                    }

                    setUser(null)
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        restoreSession()

        return () => {
            cancelled = true
        }
    }, [token])

    // Respond when Axios detects an expired or invalid JWT.
    useEffect(() => {
        function handleSessionExpired() {
            sessionStorage.removeItem('authToken')
            setToken(null)
            setUser(null)
            setLoading(false)
        }

        window.addEventListener('auth:expired', handleSessionExpired)

        return () => {
            window.removeEventListener('auth:expired', handleSessionExpired)
        }
    }, [])

    // Authenticate with the backend and retrieve user details.
    async function login(email, password) {
        const response = await loginUser(email, password)

        sessionStorage.setItem('authToken', response.token)

        try {
            const userResponse = await getCurrentUser()
            const authenticatedUser = userResponse.user ?? userResponse

            setUser(authenticatedUser)
            setToken(response.token)

            return authenticatedUser
        } catch (error) {
            sessionStorage.removeItem('authToken')
            setToken(null)
            setUser(null)
            throw error
        }
    }

    // Clear the current session when the user logs out.
    function logout() {
        sessionStorage.removeItem('authToken')
        setToken(null)
        setUser(null)
        setLoading(false)
    }

    return (
        <AuthContext.Provider
            value={{ token, user, loading, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    )
}
