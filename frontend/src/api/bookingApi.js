import api from './api'

// Create a booking for the authenticated client.
export async function createBooking(gigId) {
    const response = await api.post('/bookings', {
        gigId
    })

    return response.data
}

// Retrieve bookings belonging to the authenticated client.
export async function getMyBookings() {
    const response = await api.get('/bookings/my')

    return response.data
}

// Retrieve bookings for the authenticated freelancer.
export async function getFreelancerBookings() {
    const response = await api.get('/bookings/freelancer')

    return response.data
}