// src/services/showtimeService.js
// Showtime API calls implementation

import api from './api';

const showtimeService = {
  // Get all showtimes
  getAll: async () => {
    try {
      const response = await api.get('/showtimes');
      return { success: true, data: response.data, error: null };
    } catch (error) {
      console.error('Error fetching showtimes:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Get all showtimes (legacy method name)
  getAllShowtimes: async () => {
    const result = await showtimeService.getAll();
    return result.success ? result.data : [];
  },
  
  // Get showtimes by movie ID
  getByMovieId: async (movieId) => {
    try {
      const response = await api.get(`/showtimes?movie_id=${movieId}`);
      return { success: true, data: response.data, error: null };
    } catch (error) {
      console.error('Error fetching showtimes by movie:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Get showtime by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/showtimes/${id}`);
      return { success: true, data: response.data, error: null };
    } catch (error) {
      console.error('Error fetching showtime:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Get showtime by ID (legacy method name)
  getShowtimeById: async (id) => {
    const result = await showtimeService.getById(id);
    return result.success ? result.data : null;
  },

  // Create new showtime
  create: async (showtimeData) => {
    try {
      const response = await api.post('/showtimes', showtimeData);
      return { success: true, data: response.data, error: null };
    } catch (error) {
      console.error('Error creating showtime:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Create new showtime (legacy method name)
  createShowtime: async (showtimeData) => {
    const result = await showtimeService.create(showtimeData);
    return result.success ? result.data : Promise.reject(new Error(result.error));
  },

  // Update showtime
  update: async (id, showtimeData) => {
    try {
      const response = await api.patch(`/showtimes/${id}`, showtimeData);
      return { success: true, data: response.data, error: null };
    } catch (error) {
      console.error('Error updating showtime:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Update showtime (legacy method name)
  updateShowtime: async (id, showtimeData) => {
    const result = await showtimeService.update(id, showtimeData);
    return result.success ? result.data : Promise.reject(new Error(result.error));
  },

  // Delete showtime
  delete: async (id) => {
    try {
      const response = await api.delete(`/showtimes/${id}`);
      return { success: true, data: response.data, error: null };
    } catch (error) {
      console.error('Error deleting showtime:', error);
      return { success: false, data: null, error: error.message };
    }
  },

  // Delete showtime (legacy method name)
  deleteShowtime: async (id) => {
    const result = await showtimeService.delete(id);
    return result.success ? result.data : Promise.reject(new Error(result.error));
  },

  // Get showtimes by movie
  getShowtimesByMovie: async (movieId) => {
    try {
      const response = await api.get(`/showtimes/movie/${movieId}`);
      return { success: true, data: response.data, error: null };
    } catch (error) {
      console.error('Error fetching showtimes by movie:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Get showtimes by date
  getShowtimesByDate: async (date) => {
    try {
      const response = await api.get(`/showtimes/date/${date}`);
      return { success: true, data: response.data, error: null };
    } catch (error) {
      console.error('Error fetching showtimes by date:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Get available seats for showtime
  getAvailableSeats: async (showtimeId) => {
    try {
      const response = await api.get(`/showtimes/${showtimeId}/seats`);
      return { success: true, data: response.data, error: null };
    } catch (error) {
      console.error('Error fetching available seats:', error);
      return { success: false, data: [], error: error.message };
    }
  }
};

export default showtimeService;
