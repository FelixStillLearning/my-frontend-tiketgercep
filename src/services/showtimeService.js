import api, { apiCall } from './api';

// Showtime Service - Handle semua operasi CRUD untuk showtimes
export const showtimeService = {
  
  // ========== READ OPERATIONS ==========
  
  /**
   * Get all showtimes
   * GET /api/showtimes
   */
  getAll: async () => {
    return await apiCall(() => api.get('/showtimes'));
  },

  /**
   * Get showtime by ID
   * GET /api/showtimes/:id
   */
  getById: async (id) => {
    if (!id) {
      throw new Error('Showtime ID is required');
    }
    return await apiCall(() => api.get(`/showtimes/${id}`));
  },

  /**
   * Get showtimes by movie ID
   * GET /api/showtimes?movie_id=1
   */
  getByMovieId: async (movieId) => {
    if (!movieId) {
      throw new Error('Movie ID is required');
    }
    return await apiCall(() => api.get(`/showtimes?movie_id=${movieId}`));
  },

  /**
   * Get showtimes by studio ID
   * GET /api/showtimes?studio_id=1
   */
  getByStudioId: async (studioId) => {
    if (!studioId) {
      throw new Error('Studio ID is required');
    }
    return await apiCall(() => api.get(`/showtimes?studio_id=${studioId}`));
  },

  /**
   * Get showtimes by date
   * GET /api/showtimes?date=2024-06-09
   */
  getByDate: async (date) => {
    if (!date) {
      throw new Error('Date is required');
    }
    const formattedDate = formatDateForAPI(date);
    return await apiCall(() => api.get(`/showtimes?date=${formattedDate}`));
  },

  /**
   * Get showtimes by movie and date
   * GET /api/showtimes?movie_id=1&date=2024-06-09
   */
  getByMovieAndDate: async (movieId, date) => {
    if (!movieId || !date) {
      throw new Error('Movie ID and date are required');
    }
    const formattedDate = formatDateForAPI(date);
    return await apiCall(() => api.get(`/showtimes?movie_id=${movieId}&date=${formattedDate}`));
  },

  /**
   * Get available showtimes (not full)
   * GET /api/showtimes?available=true
   */
  getAvailable: async () => {
    return await apiCall(() => api.get('/showtimes?available=true'));
  },

  /**
   * Get showtimes with movie and studio details
   * GET /api/showtimes?include=movie,studio
   */
  getWithDetails: async () => {
    return await apiCall(() => api.get('/showtimes?include=movie,studio'));
  },

  // ========== CREATE OPERATION ==========
  
  /**
   * Create new showtime
   * POST /api/showtimes
   */
  create: async (showtimeData) => {
    const validatedData = validateShowtimeData(showtimeData);
    return await apiCall(() => api.post('/showtimes', validatedData));
  },

  // ========== UPDATE OPERATIONS ==========
  
  /**
   * Update showtime by ID
   * PUT /api/showtimes/:id
   */
  update: async (id, showtimeData) => {
    if (!id) {
      throw new Error('Showtime ID is required');
    }
    const validatedData = validateShowtimeData(showtimeData, false);
    return await apiCall(() => api.put(`/showtimes/${id}`, validatedData));
  },

  /**
   * Partial update showtime (patch)
   * PATCH /api/showtimes/:id
   */
  patch: async (id, showtimeData) => {
    if (!id) {
      throw new Error('Showtime ID is required');
    }
    return await apiCall(() => api.patch(`/showtimes/${id}`, showtimeData));
  },

  /**
   * Update showtime price
   * PATCH /api/showtimes/:id
   */
  updatePrice: async (id, price) => {
    if (!id || !price) {
      throw new Error('Showtime ID and price are required');
    }
    if (isNaN(price) || price <= 0) {
      throw new Error('Price must be a positive number');
    }
    return await showtimeService.patch(id, { price: parseFloat(price) });
  },

  // ========== DELETE OPERATION ==========
  
  /**
   * Delete showtime by ID
   * DELETE /api/showtimes/:id
   */
  delete: async (id) => {
    if (!id) {
      throw new Error('Showtime ID is required');
    }
    
    if (window.confirm('Are you sure you want to delete this showtime?')) {
      return await apiCall(() => api.delete(`/showtimes/${id}`));
    }
    
    return { success: false, data: null, error: 'Delete cancelled by user' };
  },

  // ========== SEARCH & FILTER OPERATIONS ==========
  
  /**
   * Get showtimes for today
   */
  getToday: async () => {
    const today = new Date().toISOString().split('T')[0];
    return await showtimeService.getByDate(today);
  },

  /**
   * Get showtimes for tomorrow
   */
  getTomorrow: async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    return await showtimeService.getByDate(tomorrowStr);
  },

  /**
   * Get showtimes for date range
   * GET /api/showtimes?start_date=2024-06-09&end_date=2024-06-15
   */
  getByDateRange: async (startDate, endDate) => {
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required');
    }
    const formattedStart = formatDateForAPI(startDate);
    const formattedEnd = formatDateForAPI(endDate);
    return await apiCall(() => api.get(`/showtimes?start_date=${formattedStart}&end_date=${formattedEnd}`));
  },

  /**
   * Get showtimes by time range (e.g., morning, afternoon, evening)
   * GET /api/showtimes?time_range=morning
   */
  getByTimeRange: async (timeRange) => {
    const validTimeRanges = ['morning', 'afternoon', 'evening', 'night'];
    if (!validTimeRanges.includes(timeRange)) {
      throw new Error(`Invalid time range. Must be one of: ${validTimeRanges.join(', ')}`);
    }
    return await apiCall(() => api.get(`/showtimes?time_range=${timeRange}`));
  },

  // ========== BOOKING OPERATIONS ==========
  
  /**
   * Get available seats for showtime
   * GET /api/showtimes/:id/seats
   */
  getAvailableSeats: async (showtimeId) => {
    if (!showtimeId) {
      throw new Error('Showtime ID is required');
    }
    return await apiCall(() => api.get(`/showtimes/${showtimeId}/seats`));
  },

  /**
   * Check seat availability
   * GET /api/showtimes/:id/seats/:seatNumber
   */
  checkSeatAvailability: async (showtimeId, seatNumber) => {
    if (!showtimeId || !seatNumber) {
      throw new Error('Showtime ID and seat number are required');
    }
    return await apiCall(() => api.get(`/showtimes/${showtimeId}/seats/${seatNumber}`));
  },

  /**
   * Book seats for showtime
   * POST /api/showtimes/:id/book
   */
  bookSeats: async (showtimeId, bookingData) => {
    if (!showtimeId) {
      throw new Error('Showtime ID is required');
    }
    const validatedData = validateBookingData(bookingData);
    return await apiCall(() => api.post(`/showtimes/${showtimeId}/book`, validatedData));
  },

  // ========== UTILITY OPERATIONS ==========
  
  /**
   * Get unique time slots from all showtimes
   */
  getTimeSlots: async () => {
    const result = await showtimeService.getAll();
    if (result.success && result.data) {
      const timeSlots = [...new Set(result.data.map(showtime => showtime.show_time))];
      return { success: true, data: timeSlots.sort(), error: null };
    }
    return result;
  },

  /**
   * Get price range for showtimes
   */
  getPriceRange: async () => {
    const result = await showtimeService.getAll();
    if (result.success && result.data) {
      const prices = result.data.map(showtime => showtime.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return { 
        success: true, 
        data: { min: minPrice, max: maxPrice }, 
        error: null 
      };
    }
    return result;
  },

  // ========== BULK OPERATIONS ==========
  
  /**
   * Bulk create showtimes for multiple dates
   */
  bulkCreateForDates: async (showtimeTemplate, dates) => {
    const results = await Promise.allSettled(
      dates.map(date => {
        const showtimeData = { ...showtimeTemplate, show_date: date };
        return showtimeService.create(showtimeData);
      })
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
   * Bulk update prices for multiple showtimes
   */
  bulkUpdatePrices: async (showtimeIds, newPrice) => {
    const results = await Promise.allSettled(
      showtimeIds.map(id => showtimeService.updatePrice(id, newPrice))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
    const failed = results.filter(r => r.status === 'rejected' || !r.value.success);
    
    return {
      success: failed.length === 0,
      data: { successful: successful.length, failed: failed.length },
      error: failed.length > 0 ? `${failed.length} operations failed` : null
    };
  }
};

// ========== HELPER FUNCTIONS ==========

/**
 * Validate showtime data before sending to API
 */
function validateShowtimeData(showtimeData, requireAll = true) {
  const requiredFields = ['movie_id', 'studio_id', 'show_date', 'show_time', 'price'];

  // Check required fields
  if (requireAll) {
    for (const field of requiredFields) {
      if (!showtimeData[field]) {
        throw new Error(`${field} is required`);
      }
    }
  }

  // Validate price
  if (showtimeData.price && (isNaN(showtimeData.price) || showtimeData.price <= 0)) {
    throw new Error('Price must be a positive number');
  }

  // Validate date format
  if (showtimeData.show_date && !isValidDate(showtimeData.show_date)) {
    throw new Error('Invalid date format. Use YYYY-MM-DD');
  }

  // Validate time format
  if (showtimeData.show_time && !isValidTime(showtimeData.show_time)) {
    throw new Error('Invalid time format. Use HH:MM');
  }

  // Clean and format data
  const cleanData = { ...showtimeData };
  
  // Convert price to number
  if (cleanData.price) cleanData.price = parseFloat(cleanData.price);
  
  // Convert IDs to numbers
  if (cleanData.movie_id) cleanData.movie_id = parseInt(cleanData.movie_id);
  if (cleanData.studio_id) cleanData.studio_id = parseInt(cleanData.studio_id);

  return cleanData;
}

/**
 * Validate booking data
 */
function validateBookingData(bookingData) {
  const requiredFields = ['user_id', 'seats', 'total_price'];

  for (const field of requiredFields) {
    if (!bookingData[field]) {
      throw new Error(`${field} is required`);
    }
  }

  if (!Array.isArray(bookingData.seats) || bookingData.seats.length === 0) {
    throw new Error('At least one seat must be selected');
  }

  if (isNaN(bookingData.total_price) || bookingData.total_price <= 0) {
    throw new Error('Total price must be a positive number');
  }

  return bookingData;
}

/**
 * Format date for API (YYYY-MM-DD)
 */
function formatDateForAPI(date) {
  if (date instanceof Date) {
    return date.toISOString().split('T')[0];
  }
  if (typeof date === 'string') {
    return date.split('T')[0]; // Remove time part if present
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
 * Validate time format (HH:MM)
 */
function isValidTime(timeString) {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(timeString);
}

/**
 * Format showtime data for display
 */
export function formatShowtimeForDisplay(showtime) {
  if (!showtime) return null;
  
  return {
    ...showtime,
    show_date_formatted: new Date(showtime.show_date).toLocaleDateString('id-ID'),
    show_time_formatted: showtime.show_time,
    price_formatted: new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(showtime.price),
    datetime_formatted: `${new Date(showtime.show_date).toLocaleDateString('id-ID')} ${showtime.show_time}`
  };
}

/**
 * Time range options for filtering
 */
export const TIME_RANGE_OPTIONS = [
  { value: 'morning', label: 'Morning (06:00 - 12:00)', start: '06:00', end: '12:00' },
  { value: 'afternoon', label: 'Afternoon (12:00 - 18:00)', start: '12:00', end: '18:00' },
  { value: 'evening', label: 'Evening (18:00 - 21:00)', start: '18:00', end: '21:00' },
  { value: 'night', label: 'Night (21:00 - 00:00)', start: '21:00', end: '00:00' }
];

/**
 * Common time slots for showtimes
 */
export const COMMON_TIME_SLOTS = [
  '10:00', '12:30', '15:00', '17:30', '20:00', '22:30'
];

// Export default
export default showtimeService;