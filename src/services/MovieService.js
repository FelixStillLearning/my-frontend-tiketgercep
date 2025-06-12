import api, { apiCall } from './api';

// Movie Service - Handle semua operasi CRUD untuk movies
export const movieService = {
  
  // ========== READ OPERATIONS ==========
  
  /**
   * Get all movies
   * GET /api/movies
   */
  getAll: async () => {
    return await apiCall(() => api.get('/movies'));
  },

  /**
   * Get movie by ID
   * GET /api/movies/:id
   */
  getById: async (id) => {
    if (!id) {
      throw new Error('Movie ID is required');
    }
    return await apiCall(() => api.get(`/movies/${id}`));
  },

  /**
   * Get movies by status (now_playing, coming_soon, ended)
   * GET /api/movies?status=now_playing
   */
  getByStatus: async (status) => {
    return await apiCall(() => api.get(`/movies?status=${status}`));
  },

  /**
   * Get now playing movies (shortcut)
   */
  getNowPlaying: async () => {
    return await movieService.getByStatus('now_playing');
  },

  /**
   * Get coming soon movies (shortcut)
   */
  getComingSoon: async () => {
    return await movieService.getByStatus('coming_soon');
  },

  // ========== CREATE OPERATION ==========
  
  /**
   * Create new movie
   * POST /api/movies
   */
  create: async (movieData) => {
    // Validasi data sebelum kirim ke server
    const validatedData = validateMovieData(movieData);
    return await apiCall(() => api.post('/movies', validatedData));
  },

  // ========== UPDATE OPERATIONS ==========
  
  /**
   * Update movie by ID
   * PUT /api/movies/:id
   */
  update: async (id, movieData) => {
    if (!id) {
      throw new Error('Movie ID is required');
    }
    const validatedData = validateMovieData(movieData, false); // false = not required all fields
    return await apiCall(() => api.put(`/movies/${id}`, validatedData));
  },

  /**
   * Partial update movie (patch)
   * PATCH /api/movies/:id
   */
  patch: async (id, movieData) => {
    if (!id) {
      throw new Error('Movie ID is required');
    }
    return await apiCall(() => api.patch(`/movies/${id}`, movieData));
  },

  /**
   * Update movie status only
   * PATCH /api/movies/:id
   */
  updateStatus: async (id, status) => {
    const validStatuses = ['now_playing', 'coming_soon', 'ended'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    return await movieService.patch(id, { status });
  },

  // ========== DELETE OPERATION ==========
  
  /**
   * Delete movie by ID
   * DELETE /api/movies/:id
   */
  delete: async (id) => {
    if (!id) {
      throw new Error('Movie ID is required');
    }
    
    // Konfirmasi sebelum delete (opsional)
    if (window.confirm('Are you sure you want to delete this movie?')) {
      return await apiCall(() => api.delete(`/movies/${id}`));
    }
    
    return { success: false, data: null, error: 'Delete cancelled by user' };
  },

  /**
   * Soft delete - change status to 'ended'
   * PATCH /api/movies/:id
   */
  softDelete: async (id) => {
    return await movieService.updateStatus(id, 'ended');
  },

  // ========== SEARCH & FILTER OPERATIONS ==========
  
  /**
   * Search movies by title
   * GET /api/movies?search=title
   */
  searchByTitle: async (title) => {
    if (!title || title.trim() === '') {
      return await movieService.getAll();
    }
    return await apiCall(() => api.get(`/movies?search=${encodeURIComponent(title)}`));
  },

  /**
   * Filter movies by genre
   * GET /api/movies?genre=Action
   */
  filterByGenre: async (genre) => {
    return await apiCall(() => api.get(`/movies?genre=${encodeURIComponent(genre)}`));
  },

  /**
   * Filter movies by rating
   * GET /api/movies?rating=PG-13
   */
  filterByRating: async (rating) => {
    return await apiCall(() => api.get(`/movies?rating=${encodeURIComponent(rating)}`));
  },

  // ========== UTILITY OPERATIONS ==========
  
  /**
   * Get unique genres from all movies
   */
  getGenres: async () => {
    const result = await movieService.getAll();
    if (result.success && result.data) {
      const genres = [...new Set(result.data.map(movie => movie.genre))];
      return { success: true, data: genres, error: null };
    }
    return result;
  },

  /**
   * Get unique ratings from all movies
   */
  getRatings: async () => {
    const result = await movieService.getAll();
    if (result.success && result.data) {
      const ratings = [...new Set(result.data.map(movie => movie.rating))];
      return { success: true, data: ratings, error: null };
    }
    return result;
  },

  // ========== BULK OPERATIONS ==========
  
  /**
   * Bulk update status for multiple movies
   */
  bulkUpdateStatus: async (movieIds, status) => {
    const results = await Promise.allSettled(
      movieIds.map(id => movieService.updateStatus(id, status))
    );
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success);
    const failed = results.filter(r => r.status === 'rejected' || !r.value.success);
    
    return {
      success: failed.length === 0,
      data: { successful: successful.length, failed: failed.length },
      error: failed.length > 0 ? `${failed.length} operations failed` : null
    };
  },

  // ========== ADDITIONAL OPERATIONS ==========
  
  /**
   * Get movies with showtimes
   * GET /api/movies?include=showtimes
   */
  getMoviesWithShowtimes: async () => {
    return await apiCall(() => api.get('/movies?include=showtimes'));
  },

  // ========== NEW OPERATIONS ==========
  
  /**
   * Get current movies (now showing)
   * GET /api/movies/current
   */
  getCurrentMovies: async () => {
    try {
      const response = await api.get('/movies/current');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get upcoming movies
   * GET /api/movies/upcoming
   */
  getUpcomingMovies: async () => {
    try {
      const response = await api.get('/movies/upcoming');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// ========== HELPER FUNCTIONS ==========

/**
 * Validate movie data before sending to API
 */
function validateMovieData(movieData, requireAll = true) {
  const requiredFields = ['title', 'genre', 'duration', 'synopsis', 'rating'];
  const validStatuses = ['now_playing', 'coming_soon', 'ended'];

  // Check required fields
  if (requireAll) {
    for (const field of requiredFields) {
      if (!movieData[field] || movieData[field].toString().trim() === '') {
        throw new Error(`${field} is required`);
      }
    }
  }

  // Validate rating (should be a number between 0 and 5)
  if (movieData.rating) {
    const rating = parseFloat(movieData.rating);
    if (isNaN(rating) || rating < 0 || rating > 5) {
      throw new Error('Rating must be a number between 0 and 5');
    }
  }

  // Validate status
  if (movieData.status && !validStatuses.includes(movieData.status)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  // Validate duration (must be positive number)
  if (movieData.duration && (isNaN(movieData.duration) || movieData.duration <= 0)) {
    throw new Error('Duration must be a positive number');
  }

  // Clean and format data
  const cleanData = { ...movieData };
  
  // Trim string fields
  if (cleanData.title) cleanData.title = cleanData.title.trim();
  if (cleanData.genre) cleanData.genre = cleanData.genre.trim();
  if (cleanData.synopsis) cleanData.synopsis = cleanData.synopsis.trim();
  
  // Convert duration to number
  if (cleanData.duration) cleanData.duration = parseInt(cleanData.duration);

  return cleanData;
}

/**
 * Format movie data for display
 */
export function formatMovieForDisplay(movie) {
  if (!movie) return null;
  
  return {
    ...movie,
    durationFormatted: `${movie.duration} minutes`,
    statusFormatted: movie.status.replace('_', ' ').toUpperCase(),
    createdAtFormatted: new Date(movie.createdAt).toLocaleDateString('id-ID'),
    updatedAtFormatted: new Date(movie.updatedAt).toLocaleDateString('id-ID')
  };
}

/**
 * Movie status options for forms
 */
export const MOVIE_STATUS_OPTIONS = [
  { value: 'now_playing', label: 'Now Playing', color: 'is-success' },
  { value: 'coming_soon', label: 'Coming Soon', color: 'is-warning' },
  { value: 'ended', label: 'Ended', color: 'is-danger' }
];

/**
 * Movie rating options for forms
 */
export const MOVIE_RATING_OPTIONS = [
  { value: 'G', label: 'G - General Audiences' },
  { value: 'PG', label: 'PG - Parental Guidance' },
  { value: 'PG-13', label: 'PG-13 - Parents Strongly Cautioned' },
  { value: 'R', label: 'R - Restricted' },
  { value: 'NC-17', label: 'NC-17 - Adults Only' }
];

// Export default
export default movieService;