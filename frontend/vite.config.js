import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import process from 'node:process'

// Shared security headers for the frontend.
const baseHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
}

// Build a CSP appropriate for development or production preview.
function createCsp(isDevelopment, backendOrigin) {
    return [
        "default-src 'self'",

        // React Refresh requires inline scripts during development.
        isDevelopment
            ? "script-src 'self' 'unsafe-inline'"
            : "script-src 'self'",

        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self' data:",

        // Permit API requests to the configured backend.
        isDevelopment
            ? `connect-src 'self' ${backendOrigin} ws://localhost:5173`
            : `connect-src 'self' ${backendOrigin}`,

        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'"
    ].join('; ')
}

export default defineConfig(({ mode }) => {
    // Read frontend environment variables.
    const env = loadEnv(mode, process.cwd(), 'VITE_')

    const backendUrl =
        env.VITE_API_URL || 'https://localhost:5000'

    const backendOrigin = new URL(backendUrl).origin

    return {
        plugins: [react()],

        server: {
            headers: {
                ...baseHeaders,
                'Content-Security-Policy':
                    createCsp(true, backendOrigin)
            }
        },

        preview: {
            headers: {
                ...baseHeaders,
                'Content-Security-Policy':
                    createCsp(false, backendOrigin)
            }
        }
    }
})