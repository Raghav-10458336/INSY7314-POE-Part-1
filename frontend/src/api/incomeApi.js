import api from './api'

export async function getIncome() {
    const response = await api.get('/income')

    return response.data
}
