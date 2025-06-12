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
    // Alias for compatibility
  getAll: async () => {
    try {
      const response = await api.get('/studios');
      console.log('Raw API response:', response.data);
        // Transform backend data to match frontend expectations
      const studios = Array.isArray(response.data) ? response.data.map(studio => ({
        id: studio.studio_id,
        studio_id: studio.studio_id,
        studio_name: studio.studio_name, // Keep original property name for ShowtimeForm
        name: studio.studio_name, // Also keep this for other components that might expect it
        capacity: studio.total_seats,
        status: 'active', // Default status since not in backend model
        facilities: [], // Default empty facilities since not in backend model
        rows: studio.rows,
        seats_per_row: studio.seats_per_row,
        created_at: studio.created_at,
        updated_at: studio.updated_at
      })) : [];
      
      console.log('Transformed studios:', studios);
      return studios;
    } catch (error) {
      console.error('Error fetching studios:', error);
      return [];
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
    // Alias for compatibility
  getById: async (id) => {
    try {
      const response = await api.get(`/studios/${id}`);
      const studio = response.data;
      
      // Transform backend data to match frontend expectations
      return {
        id: studio.studio_id,
        studio_id: studio.studio_id,
        name: studio.studio_name,
        capacity: studio.total_seats,
        status: 'active',
        facilities: [],
        rows: studio.rows,
        seats_per_row: studio.seats_per_row,
        created_at: studio.created_at,
        updated_at: studio.updated_at
      };
    } catch (error) {
      console.error(`Error getting studio ${id}:`, error);
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
    // Alias for compatibility
  create: async (studioData) => {
    try {
      // Transform frontend data to match backend expectations
      const backendData = {
        studio_name: studioData.name,
        total_seats: studioData.capacity,
        rows: studioData.rows || 5,
        seats_per_row: studioData.seats_per_row || Math.ceil(studioData.capacity / 5)
      };
      
      const response = await api.post('/studios', backendData);
      return response.data;
    } catch (error) {
      console.error('Error creating studio:', error);
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
    // Alias for compatibility
  update: async (id, studioData) => {
    try {
      // Transform frontend data to match backend expectations
      const backendData = {
        studio_name: studioData.name,
        total_seats: studioData.capacity,
        rows: studioData.rows || 5,
        seats_per_row: studioData.seats_per_row || Math.ceil(studioData.capacity / 5)
      };
      
      const response = await api.put(`/studios/${id}`, backendData);
      return response.data;
    } catch (error) {
      console.error(`Error updating studio ${id}:`, error);
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
  
  // Alias for compatibility
  delete: async (id) => {
    try {
      const response = await api.delete(`/studios/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting studio ${id}:`, error);
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
