// src/services/studioService.js
// TODO: Implement Studio API calls

import api from './api';

const studioService = {
  // Get all studios
  getAllStudios: async () => {
    try {
      const response = await api.get('/studios');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get studio by ID
  getStudioById: async (id) => {
    try {
      const response = await api.get(`/studios/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new studio
  createStudio: async (studioData) => {
    try {
      const response = await api.post('/studios', studioData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update studio
  updateStudio: async (id, studioData) => {
    try {
      const response = await api.patch(`/studios/${id}`, studioData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete studio
  deleteStudio: async (id) => {
    try {
      const response = await api.delete(`/studios/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get studio seats
  getStudioSeats: async (id) => {
    try {
      const response = await api.get(`/studios/${id}/seats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update studio seats
  updateStudioSeats: async (id, seatsData) => {
    try {
      const response = await api.patch(`/studios/${id}/seats`, seatsData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default studioService;
