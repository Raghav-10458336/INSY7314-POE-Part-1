import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Restrict access to authenticated users with permitted roles.
export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, loading } = useAuth()
    const location = useLocation()

    // Wait for session validation before checking access.
    if (loading) {
        return <p>Checking authentication...</p>
    }

    // Redirect unauthenticated visitors to login.
    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        )
    }

    // Prevent users from accessing pages outside their role.
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <p>403 — Access denied. You do not have permission to view this page.</p>
    }

    return children
}