import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const MovieForm = () => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [duration, setDuration] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [rating, setRating] = useState("PG");
  const [status, setStatus] = useState("now_playing");
  const [posterUrl, setPosterUrl] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // Jika ada ID = edit mode, jika tidak = create mode

  const isEditMode = !!id; // true jika ada ID (edit), false jika tidak ada (create)

  useEffect(() => {
    if (isEditMode) {
      getMovieById();
    }
  }, [id]);

  async function saveMovie(e) {
    e.preventDefault();
    try {
      const movieData = {
        title,
        genre,
        duration,
        synopsis,
        rating,
        status,
        poster_url: posterUrl
      };

      if (isEditMode) {
        // Update movie
        await axios.patch(`http://localhost:5000/api/movies/${id}`, movieData);
      } else {
        // Create new movie
        await axios.post('http://localhost:5000/api/movies', movieData);
      }
      
      navigate("/admin/movies");
    } catch (error) {
      console.log(error);
    }
  }

  const getMovieById = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/movies/${id}`);
      setTitle(response.data.title);
      setGenre(response.data.genre);
      setDuration(response.data.duration);
      setSynopsis(response.data.synopsis);
      setRating(response.data.rating);
      setStatus(response.data.status);
      setPosterUrl(response.data.poster_url || "");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <h2 className="title is-4">
          {isEditMode ? "Edit Movie" : "Add New Movie"}
        </h2>
        <form onSubmit={saveMovie}>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input 
                type="text" 
                className="input" 
                value={title}
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Movie title"
                required 
              />
            </div>
          </div>
          
          <div className="field">
            <label className="label">Genre</label>
            <div className="control">
              <input 
                type="text" 
                className="input" 
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Action, Drama, Comedy"
                required 
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Duration (minutes)</label>
            <div className="control">
              <input 
                type="number" 
                className="input" 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="120"
                required 
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Synopsis</label>
            <div className="control">
              <textarea 
                className="textarea" 
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Movie synopsis..."
                required 
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Rating</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option value="G">G</option>
                  <option value="PG">PG</option>
                  <option value="PG-13">PG-13</option>
                  <option value="R">R</option>
                  <option value="NC-17">NC-17</option>
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Status</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="now_playing">Now Playing</option>
                  <option value="coming_soon">Coming Soon</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label">Poster URL</label>
            <div className="control">
              <input 
                type="url" 
                className="input" 
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="https://example.com/poster.jpg"
              />
            </div>
          </div>

          <div className="field">
            <button type="submit" className="button is-success">
              {isEditMode ? "Update Movie" : "Save Movie"}
            </button>
            <button 
              type="button" 
              className="button is-light ml-2"
              onClick={() => navigate("/admin/movies")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovieForm;