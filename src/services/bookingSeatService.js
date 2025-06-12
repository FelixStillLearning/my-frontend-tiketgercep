import api from './api';

const bookingSeatService = {
    // Get all booking seats
    getAll: async () => {
        try {
            const response = await api.get('/booking-seats');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get booking seat by ID
    getById: async (id) => {
        try {
            const response = await api.get(`/booking-seats/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get booking seats by booking ID
    getByBookingId: async (bookingId) => {
        try {
            const response = await api.get(`/booking-seats/booking/${bookingId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get booking seats by seat ID
    getBySeatId: async (seatId) => {
        try {
            const response = await api.get(`/booking-seats/seat/${seatId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new booking seat
    create: async (bookingSeatData) => {
        try {
            const response = await api.post('/booking-seats', bookingSeatData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update booking seat
    update: async (id, bookingSeatData) => {
        try {
            const response = await api.put(`/booking-seats/${id}`, bookingSeatData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete booking seat
    delete: async (id) => {
        try {
            const response = await api.delete(`/booking-seats/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Bulk create booking seats
    createBulk: async (bookingSeatsData) => {
        try {
            const response = await api.post('/booking-seats/bulk', bookingSeatsData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Check seat availability for a showtime
    checkAvailability: async (showtimeId, seatIds) => {
        try {
            const response = await api.post('/booking-seats/check-availability', {
                showtime_id: showtimeId,
                seat_ids: seatIds
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default bookingSeatService;
