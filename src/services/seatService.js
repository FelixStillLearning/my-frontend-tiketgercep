import api from './api';

const seatService = {
    // Get all seats
    getAll: async () => {
        try {
            const response = await api.get('/seats');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get seat by ID
    getById: async (id) => {
        try {
            const response = await api.get(`/seats/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get seats by studio ID
    getByStudioId: async (studioId) => {
        try {
            const response = await api.get(`/seats/studio/${studioId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new seat
    create: async (seatData) => {
        try {
            const response = await api.post('/seats', seatData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update seat
    update: async (id, seatData) => {
        try {
            const response = await api.put(`/seats/${id}`, seatData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete seat
    delete: async (id) => {
        try {
            const response = await api.delete(`/seats/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Bulk create seats for a studio
    createBulk: async (studioId, seatsData) => {
        try {
            const response = await api.post(`/seats/bulk/${studioId}`, seatsData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get booked seats by showtime ID
    getBookedSeatsByShowtimeId: async (showtimeId) => {
        try {
            const response = await api.get(`/showtimes/${showtimeId}/booked-seats`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default seatService;
