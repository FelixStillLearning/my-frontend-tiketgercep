import api, { apiCall } from './api';

// Studio Service - Handle semua operasi CRUD untuk studios
export const studioService = {
  
  // ========== READ OPERATIONS ==========
  
  /**
   * Get all studios
   * GET /api/studios
   */
  getAll: async () => {
    return await apiCall(() => api.get('/studios'));
  },

  /**
   * Get studio by ID
   * GET /api/studios/:id
   */
  getById: async (id) => {
    if (!id) {
      throw new Error('Studio ID is required');
    }
    return await apiCall(() => api.get(`/studios/${id}`));
  },

  /**
   * Get studios by type (regular, premium, IMAX, etc.)
   * GET /api/studios?type=premium
   */
  getByType: async (type) => {
    return await apiCall(() => api.get(`/studios?type=${type}`));
  },

  /**
   * Get available studios (not in maintenance)
   * GET /api/studios?status=available
   */
  getAvailable: async () => {
    return await apiCall(() => api.get('/studios?status=available'));
  },

  /**
   * Get studios with capacity filter
   * GET /api/studios?min_capacity=50&max_capacity=200
   */
  getByCapacityRange: async (minCapacity, maxCapacity) => {
    let url = '/studios?';
    if (minCapacity) url += `min_capacity=${minCapacity}&`;
    if (maxCapacity) url += `max_capacity=${maxCapacity}&`;
    return await apiCall(() => api.get(url));
  },

  // ========== CREATE OPERATION ==========
  
  /**
   * Create new studio
   * POST /api/studios
   */
  create: async (studioData) => {
    const validatedData = validateStudioData(studioData);
    return await apiCall(() => api.post('/studios', validatedData));
  },

  // ========== UPDATE OPERATIONS ==========
  
  /**
   * Update studio by ID
   * PUT /api/studios/:id
   */
  update: async (id, studioData) => {
    if (!id) {
      throw new Error('Studio ID is required');
    }
    const validatedData = validateStudioData(studioData, false);
    return await apiCall(() => api.put(`/studios/${id}`, validatedData));
  },

  /**
   * Partial update studio (patch)
   * PATCH /api/studios/:id
   */
  patch: async (id, studioData) => {
    if (!id) {
      throw new Error('Studio ID is required');
    }
    return await apiCall(() => api.patch(`/studios/${id}`, studioData));
  },

  /**
   * Update studio status only
   * PATCH /api/studios/:id
   */
  updateStatus: async (id, status) => {
    const validStatuses = ['available', 'maintenance', 'closed'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    return await studioService.patch(id, { status });
  },

  /**
   * Update studio capacity
   * PATCH /api/studios/:id
   */
  updateCapacity: async (id, capacity) => {
    if (!id || !capacity) {
      throw new Error('Studio ID and capacity are required');
    }
    if (isNaN(capacity) || capacity <= 0) {
      throw new Error('Capacity must be a positive number');
    }
    return await studioService.patch(id, { capacity: parseInt(capacity) });
  },

  // ========== DELETE OPERATION ==========
  
  /**
   * Delete studio by ID
   * DELETE /api/studios/:id
   */
  delete: async (id) => {
    if (!id) {
      throw new Error('Studio ID is required');
    }
    
    if (window.confirm('Are you sure you want to delete this studio? This will also delete all associated showtimes.')) {
      return await apiCall(() => api.delete(`/studios/${id}`));
    }
    
    return { success: false, data: null, error: 'Delete cancelled by user' };
  },

  /**
   * Soft delete - change status to 'closed'
   * PATCH /api/studios/:id
   */
  softDelete: async (id) => {
    return await studioService.updateStatus(id, 'closed');
  },

  // ========== SEARCH & FILTER OPERATIONS ==========
  
  /**
   * Search studios by name
   * GET /api/studios?search=studio
   */
  searchByName: async (name) => {
    if (!name || name.trim() === '') {
      return await studioService.getAll();
    }
    return await apiCall(() => api.get(`/studios?search=${encodeURIComponent(name)}`));
  },

  /**
   * Filter studios by features (AC, Sound System, etc.)
   * GET /api/studios?features=AC,Dolby
   */
  filterByFeatures: async (features) => {
    if (Array.isArray(features)) {
      features = features.join(',');
    }
    return await apiCall(() => api.get(`/studios?features=${encodeURIComponent(features)}`));
  },

  // ========== SCHEDULE OPERATIONS ==========
  
  /**
   * Get studio schedule for specific date
   * GET /api/studios/:id/schedule?date=2024-06-09
   */
  getSchedule: async (id, date) => {
    if (!id || !date) {
      throw new Error('Studio ID and date are required');
    }
    const formattedDate = formatDateForAPI(date);
    return await apiCall(() => api.get(`/studios/${id}/schedule?date=${formattedDate}`));
  },

  /**
   * Get available time slots for studio on specific date
   * GET /api/studios/:id/available-slots?date=2024-06-09
   */
  getAvailableTimeSlots: async (id, date) => {
    if (!id || !date) {
      throw new Error('Studio ID and date are required');
    }
    const formattedDate = formatDateForAPI(date);
    return await apiCall(() => api.get(`/studios/${id}/available-slots?date=${formattedDate}`));
  },

  /**
   * Check if studio is available for specific time slot
   * GET /api/studios/:id/check-availability?date=2024-06-09&time=14:30
   */
  checkAvailability: async (id, date, time) => {
    if (!id || !date || !time) {
      throw new Error('Studio ID, date, and time are required');
    }
    const formattedDate = formatDateForAPI(date);
    return await apiCall(() => api.get(`/studios/${id}/check-availability?date=${formattedDate}&time=${time}`));
  },

  // ========== STATISTICS OPERATIONS ==========
  
  /**
   * Get studio utilization statistics
   * GET /api/studios/:id/stats?period=monthly
   */
  getUtilizationStats: async (id, period = 'monthly') => {
    if (!id) {
      throw new Error('Studio ID is required');
    }
    return await apiCall(() => api.get(`/studios/${id}/stats?period=${period}`));
  },

  /**
   * Get revenue statistics for studio
   * GET /api/studios/:id/revenue?start_date=2024-01-01&end_date=2024-12-31
   */
  getRevenueStats: async (id, startDate, endDate) => {
    if (!id) {
      throw new Error('Studio ID is required');
    }
    let url = `/studios/${id}/revenue?`;
    if (startDate) url += `start_date=${formatDateForAPI(startDate)}&`;
    if (endDate) url += `end_date=${formatDateForAPI(endDate)}&`;
    return await apiCall(() => api.get(url));
  },

  // ========== UTILITY OPERATIONS ==========
  
  /**
   * Get unique studio types
   */
  getStudioTypes: async () => {
    const result = await studioService.getAll();
    if (result.success && result.data) {
      const types = [...new Set(result.data.map(studio => studio.type))];
      return { success: true, data: types, error: null };
    }
    return result;
  },

  /**
   * Get studios capacity summary
   */
  getCapacitySummary: async () => {
    const result = await studioService.getAll();
    if (result.success && result.data) {
      const capacities = result.data.map(studio => studio.capacity);
      const totalCapacity = capacities.reduce((sum, cap) => sum + cap, 0);
      const avgCapacity = Math.round(totalCapacity / capacities.length);
      const minCapacity = Math.min(...capacities);
      const maxCapacity = Math.max(...capacities);
      
      return { 
        success: true, 
        data: { 
          total: totalCapacity, 
          average: avgCapacity, 
          min: minCapacity, 
          max: maxCapacity,
          studioCount: capacities.length
        }, 
        error: null 
      };
    }
    return result;
  },

  // ========== BULK OPERATIONS ==========
  
  /**
   * Bulk update status for multiple studios
   */
  bulkUpdateStatus: async (studioIds, status) => {
    const results = await Promise.allSettled(
      studioIds.map(id => studioService.updateStatus(id, status))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
    const failed = results.filter(r => r.status === 'rejected' || !r.value.success);
    
    return {
      success: failed.length === 0,
      data: { successful: successful.length, failed: failed.length },
      error: failed.length > 0 ? `${failed.length} operations failed` : null
    };
  },

  /**
   * Bulk update features for multiple studios
   */
  bulkUpdateFeatures: async (studioIds, features) => {
    const results = await Promise.allSettled(
      studioIds.map(id => studioService.patch(id, { features }))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
    const failed = results.filter(r => r.status === 'rejected' || !r.value.success);
    
    return {
      success: failed.length === 0,
      data: { successful: successful.length, failed: failed.length },
      error: failed.length > 0 ? `${failed.length} operations failed` : null
    };
  },

  // ========== MAINTENANCE OPERATIONS ==========
  
  /**
   * Schedule maintenance for studio
   * POST /api/studios/:id/maintenance
   */
  scheduleMaintenance: async (id, maintenanceData) => {
    if (!id) {
      throw new Error('Studio ID is required');
    }
    const validatedData = validateMaintenanceData(maintenanceData);
    return await apiCall(() => api.post(`/studios/${id}/maintenance`, validatedData));
  },

  /**
   * Get maintenance history for studio
   * GET /api/studios/:id/maintenance-history
   */
  getMaintenanceHistory: async (id) => {
    if (!id) {
      throw new Error('Studio ID is required');
    }
    return await apiCall(() => api.get(`/studios/${id}/maintenance-history`));
  }
};

// ========== HELPER FUNCTIONS ==========

/**
 * Validate studio data before sending to API
 */
function validateStudioData(studioData, requireAll = true) {
  const requiredFields = ['name', 'type', 'capacity'];
  const validTypes = ['regular', 'premium', 'IMAX', '4DX', 'VIP'];
  const validStatuses = ['available', 'maintenance', 'closed'];

  // Check required fields
  if (requireAll) {
    for (const field of requiredFields) {
      if (!studioData[field] || studioData[field].toString().trim() === '') {
        throw new Error(`${field} is required`);
      }
    }
  }

  // Validate type
  if (studioData.type && !validTypes.includes(studioData.type)) {
    throw new Error(`Invalid type. Must be one of: ${validTypes.join(', ')}`);
  }

  // Validate status
  if (studioData.status && !validStatuses.includes(studioData.status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  // Validate capacity (must be positive number)
  if (studioData.capacity && (isNaN(studioData.capacity) || studioData.capacity <= 0)) {
    throw new Error('Capacity must be a positive number');
  }

  // Clean and format data
  const cleanData = { ...studioData };
  
  // Trim string fields
  if (cleanData.name) cleanData.name = cleanData.name.trim();
  if (cleanData.type) cleanData.type = cleanData.type.trim();
  if (cleanData.description) cleanData.description = cleanData.description.trim();
  
  // Convert capacity to number
  if (cleanData.capacity) cleanData.capacity = parseInt(cleanData.capacity);

  return cleanData;
}

/**
 * Validate maintenance data
 */
function validateMaintenanceData(maintenanceData) {
  const requiredFields = ['start_date', 'end_date', 'description'];

  for (const field of requiredFields) {
    if (!maintenanceData[field]) {
      throw new Error(`${field} is required`);
    }
  }

  // Validate dates
  if (!isValidDate(maintenanceData.start_date) || !isValidDate(maintenanceData.end_date)) {
    throw new Error('Invalid date format. Use YYYY-MM-DD');
  }

  const startDate = new Date(maintenanceData.start_date);
  const endDate = new Date(maintenanceData.end_date);

  if (endDate <= startDate) {
    throw new Error('End date must be after start date');
  }

  return maintenanceData;
}

/**
 * Format date for API (YYYY-MM-DD)
 */
function formatDateForAPI(date) {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  if (typeof date === 'string') {
    return date.split('T')[0];
  }
  throw new Error('Invalid date format');
}

/**
 * Validate date format (YYYY-MM-DD)
 */
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * Format studio data for display
 */
export function formatStudioForDisplay(studio) {
  if (!studio) return null;
  
  return {
    ...studio,
    typeFormatted: studio.type.toUpperCase(),
    statusFormatted: studio.status.replace('_', ' ').toUpperCase(),
    capacityFormatted: `${studio.capacity} seats`,
    featuresFormatted: Array.isArray(studio.features) ? studio.features.join(', ') : studio.features || 'N/A',
    createdAtFormatted: new Date(studio.createdAt).toLocaleDateString('id-ID'),
    updatedAtFormatted: new Date(studio.updatedAt).toLocaleDateString('id-ID')
  };
}

/**
 * Studio type options for forms
 */
export const STUDIO_TYPE_OPTIONS = [
  { value: 'regular', label: 'Regular', description: 'Standard cinema experience' },
  { value: 'premium', label: 'Premium', description: 'Enhanced comfort and service' },
  { value: 'IMAX', label: 'IMAX', description: 'Large format immersive experience' },
  { value: '4DX', label: '4DX', description: 'Motion seats and environmental effects' },
  { value: 'VIP', label: 'VIP', description: 'Luxury reclining seats and service' }
];

/**
 * Studio status options for forms
 */
export const STUDIO_STATUS_OPTIONS = [
  { value: 'available', label: 'Available', color: 'is-success' },
  { value: 'maintenance', label: 'Under Maintenance', color: 'is-warning' },
  { value: 'closed', label: 'Closed', color: 'is-danger' }
];

/**
 * Common studio features
 */
export const STUDIO_FEATURES = [
  'Air Conditioning',
  'Dolby Atmos',
  'Digital Projection',
  'Reclining Seats',
  'Cup Holders',
  'Wheelchair Accessible',
  'Premium Sound',
  '3D Capable',
  'Reserved Seating',
  'Food Service'
];

/**
 * Studio capacity ranges for filtering
 */
export const CAPACITY_RANGES = [
  { label: 'Small (1-50 seats)', min: 1, max: 50 },
  { label: 'Medium (51-100 seats)', min: 51, max: 100 },
  { label: 'Large (101-200 seats)', min: 101, max: 200 },
  { label: 'Extra Large (200+ seats)', min: 200, max: 999 }
];

// Export default
export default studioService;