
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/useAuth'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ClientHomePage from './pages/ClientHomePage'
import MyGigsPage from './pages/MyGigsPage'
import IncomePage from './pages/IncomePage'
import ProtectedRoute from './components/ProtectedRoute'

// Direct authenticated users to their appropriate dashboard.
function HomeRedirect() {
    const { user, loading } = useAuth()

    if (loading) {
        return <p>Checking authentication...</p>
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return (
        <Navigate
            to={user.role === 'freelancer' ? '/my-gigs' : '/client'}
            replace
        />
    )
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public authentication pages */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Client-only dashboard */}
                <Route
                    path="/client"
                    element={
                        <ProtectedRoute allowedRoles={['client']}>
                            <ClientHomePage />
                        </ProtectedRoute>
                    }
                />

                {/* Freelancer-only gig management */}
                <Route
                    path="/my-gigs"
                    element={
                        <ProtectedRoute allowedRoles={['freelancer']}>
                            <MyGigsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/income"
                    element={
                        <ProtectedRoute allowedRoles={['freelancer']}>
                            <IncomePage />
                        </ProtectedRoute>
                    }
                />

                {/* Default navigation */}
                <Route path="/" element={<HomeRedirect />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
