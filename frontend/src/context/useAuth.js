import { useContext } from 'react'
import { AuthContext } from './authContext'

// Access authentication state from any component.
export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }

    return context
}