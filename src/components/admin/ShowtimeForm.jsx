import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ShowtimeForm = () => {
  const [movieId, setMovieId] = useState("");
  const [studioId, setStudioId] = useState("");
  const [showDate, setShowDate] = useState("");
  const [showTime, setShowTime] = useState("");
  const [price, setPrice] = useState("");
  const [movies, setMovies] = useState([]);
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = !!id;

  // ✅ DARK INPUT STYLE
  const darkInputStyle = {
    backgroundColor: '#3a3a3a',
    borderColor: '#4a4a4a',
    color: '#dbdbdb'
  };

  useEffect(() => {
    fetchMovies();
    fetchStudios();
    if (isEditMode) {
      getShowtimeById();
    }
  }, [id, isEditMode]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/movies');
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const fetchStudios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/studios');
      setStudios(response.data);
    } catch (error) {
      console.error('Error fetching studios:', error);
    }
  };

  const getShowtimeById = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/showtimes/${id}`);
      const showtime = response.data;
      setMovieId(showtime.movie_id || "");
      setStudioId(showtime.studio_id || "");
      setShowDate(showtime.show_date || "");
      setShowTime(showtime.show_time || "");
      setPrice(showtime.price || "");
    } catch (error) {
      console.error('Error fetching showtime:', error);
      alert('Failed to load showtime data');
    }
  };

  const saveShowtime = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const showtimeData = {
        movie_id: parseInt(movieId),
        studio_id: parseInt(studioId),
        show_date: showDate,
        show_time: showTime,
        price: parseFloat(price)
      };

      if (isEditMode) {
        await axios.patch(`http://localhost:5000/api/showtimes/${id}`, showtimeData);
      } else {
        await axios.post('http://localhost:5000/api/showtimes', showtimeData);
      }
      
      navigate("/admin/showtimes");
    } catch (error) {
      console.error('Error saving showtime:', error);
      
      if (error.response) {
        alert(`Failed to save showtime: ${error.response.data.message || error.response.data.error || 'Unknown error'}`);
      } else {
        alert('Failed to save showtime: Network error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ backgroundColor: '#1f1f1f', minHeight: '100vh' }}>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-half">
            <div className="box has-background-dark">
              <h2 className="title is-4 has-text-white mb-5">
                {isEditMode ? "Edit Showtime" : "Add New Showtime"}
              </h2>
              
              <form onSubmit={saveShowtime}>
                <div className="field">
                  <label className="label has-text-grey-light">Movie</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select 
                        style={darkInputStyle}
                        value={movieId} 
                        onChange={(e) => setMovieId(e.target.value)}
                        required
                      >
                        <option value="">Select a movie</option>
                        {movies.map((movie) => (
                          <option key={movie.movie_id} value={movie.movie_id}>
                            {movie.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label className="label has-text-grey-light">Studio</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select 
                        style={darkInputStyle}
                        value={studioId} 
                        onChange={(e) => setStudioId(e.target.value)}
                        required
                      >
                        <option value="">Select a studio</option>
                        {studios.map((studio) => (
                          <option key={studio.studio_id} value={studio.studio_id}>
                            {studio.studio_name} (Capacity: {studio.total_seats} seats)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label has-text-grey-light">Show Date</label>
                      <div className="control">
                        <input 
                          type="date" 
                          className="input" 
                          style={darkInputStyle}
                          value={showDate}
                          onChange={(e) => setShowDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label has-text-grey-light">Show Time</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select 
                            style={darkInputStyle}
                            value={showTime} 
                            onChange={(e) => setShowTime(e.target.value)}
                            required
                          >
                            <option value="">Select show time</option>
                            <option value="10:00">10:00</option>
                            <option value="12:30">12:30</option>
                            <option value="15:00">15:00</option>
                            <option value="17:30">17:30</option>
                            <option value="20:00">20:00</option>
                            <option value="22:30">22:30</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label className="label has-text-grey-light">Price (IDR)</label>
                  <div className="control">
                    <input 
                      type="number" 
                      className="input" 
                      style={darkInputStyle}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="50000"
                      min="0"
                      step="any"
                      required 
                    />
                  </div>
                  <p className="help has-text-grey">Enter price in Indonesian Rupiah (IDR)</p>
                </div>

                <div className="field is-grouped is-grouped-right mt-5">
                  <div className="control">
                    <button 
                      type="button" 
                      className="button is-light is-outlined"
                      onClick={() => navigate("/admin/showtimes")}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="control">
                    <button 
                      type="submit" 
                      className={`button is-danger ${loading ? 'is-loading' : ''}`}
                      disabled={loading}
                    >
                      {isEditMode ? "Update Showtime" : "Save Showtime"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowtimeForm;