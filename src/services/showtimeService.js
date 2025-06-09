// src/services/showtimeService.js
// TODO: Implement Showtime API calls

import api from './api';

const showtimeService = {
  // Get all showtimes
  getAllShowtimes: async () => {
    try {
      const response = await api.get('/showtimes');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get showtime by ID
  getShowtimeById: async (id) => {
    try {
      const response = await api.get(`/showtimes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new showtime
  createShowtime: async (showtimeData) => {
    try {
      const response = await api.post('/showtimes', showtimeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update showtime
  updateShowtime: async (id, showtimeData) => {
    try {
      const response = await api.patch(`/showtimes/${id}`, showtimeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete showtime
  deleteShowtime: async (id) => {
    try {
      const response = await api.delete(`/showtimes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get showtimes by movie
  getShowtimesByMovie: async (movieId) => {
    try {
      const response = await api.get(`/showtimes/movie/${movieId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get showtimes by date
  getShowtimesByDate: async (date) => {
    try {
      const response = await api.get(`/showtimes/date/${date}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get available seats for showtime
  getAvailableSeats: async (showtimeId) => {
    try {
      const response = await api.get(`/showtimes/${showtimeId}/seats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default showtimeService;
