import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';

const MovieForm = () => {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [duration, setDuration] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [rating, setRating] = useState("PG");
  const [status, setStatus] = useState("now_playing");
  const [releaseDate, setReleaseDate] = useState(""); // ✅ TAMBAH INI
  const [posterFile, setPosterFile] = useState(null);
  const [currentPoster, setCurrentPoster] = useState("");
  const [posterPreview, setPosterPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      getMovieById();
    }
  }, [id]);

  const getMovieById = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/movies/${id}`);
      const movie = response.data;
      setTitle(movie.title);
      setGenre(movie.genre);
      setDuration(movie.duration);
      setSynopsis(movie.synopsis);
      setRating(movie.rating);
      setStatus(movie.status);
      setReleaseDate(movie.release_date || ""); // ✅ TAMBAH INI
      setCurrentPoster(movie.poster_url || "");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      const previewURL = URL.createObjectURL(file);
      setPosterPreview(previewURL);
    }
  };

  const saveMovie = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      try {
          const formData = new FormData();
          formData.append('title', title);
          formData.append('genre', genre);
          formData.append('duration', duration);
          formData.append('synopsis', synopsis);
          formData.append('rating', rating);
          formData.append('status', status);
          formData.append('release_date', releaseDate); // ✅ TAMBAH INI
          
          // ✅ TAMBAH FIELD YANG MISSING
          formData.append('trailer_url', ''); // Atau buat state baru jika ada
          
          if (posterFile) {
              formData.append('poster', posterFile);
          }

          // ✅ DEBUG: Lihat apa yang dikirim
          console.log('=== FORM DATA DEBUG ===');
          for (let [key, value] of formData.entries()) {
              console.log(`${key}:`, value);
          }
          console.log('Movie ID:', id);
          console.log('======================');

          if (isEditMode) {
              const response = await axios.patch(`http://localhost:5000/api/movies/${id}`, formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
              });
              console.log('Update response:', response.data); // ✅ Debug response
          } else {
              const response = await axios.post('http://localhost:5000/api/movies', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
              });
              console.log('Create response:', response.data); // ✅ Debug response
          }
          
          navigate("/admin/movies");
      } catch (error) {
          console.error('Error saving movie:', error.response?.data || error.message); // ✅ Better error logging
          alert(`Failed to ${isEditMode ? 'update' : 'create'} movie: ${error.response?.data?.message || error.message}`);
      } finally {
          setLoading(false);
      }
  };

  const darkInputStyle = {
    backgroundColor: '#2d2d2d',
    borderColor: '#4a4a4a',
    color: '#fff'
  };

  return (
    <section className="section" style={{ backgroundColor: '#1f1f1f', minHeight: '100vh' }}>
      <div className="container">
        <div className="box has-background-dark">
          <h2 className="title is-4 has-text-white mb-5">
            {isEditMode ? "Edit Movie" : "Add New Movie"}
          </h2>
          <form onSubmit={saveMovie}>
            <div className="columns">
              {/* Kolom Kiri: Poster */}
              <div className="column is-one-third">
                 <div className="field">
                    <label className="label has-text-grey-light">Movie Poster</label>
                    <div className="mb-4">
                        {(posterPreview || currentPoster) ? (
                            <figure className="image is-2by3">
                                <img src={posterPreview || currentPoster} alt="Poster preview" style={{ borderRadius: '8px', border: '2px solid #4a4a4a', objectFit: 'cover' }} />
                            </figure>
                        ) : (
                             <div className="is-flex is-justify-content-center is-align-items-center has-background-dark-light" style={{ height: '100%', minHeight: '300px', border: '2px dashed #4a4a4a', borderRadius: '8px' }}>
                                <p className="has-text-grey">Image Preview</p>
                            </div>
                        )}
                    </div>
                    {/* PERUBAHAN DI SINI: Menggunakan .file.has-name yang lebih compact */}
                    <div className="file is-fullwidth has-name">
                        <label className="file-label">
                            <input className="file-input" type="file" accept="image/jpeg,image/png" onChange={handlePosterChange} />
                            <span className="file-cta">
                                <span className="file-icon"><FontAwesomeIcon icon={faUpload} /></span>
                                <span className="file-label">Choose a file…</span>
                            </span>
                            <span className="file-name" style={{ color: '#dbdbdb', backgroundColor: '#3a3a3a', borderColor: '#4a4a4a' }}>
                                {posterFile ? posterFile.name : "No file selected"}
                            </span>
                        </label>
                    </div>
                 </div>
              </div>

              {/* Kolom Kanan: Informasi Utama */}
              <div className="column is-two-thirds">
                <div className="field">
                  <label className="label has-text-grey-light">Title</label>
                  <div className="control">
                    <input type="text" className="input" style={darkInputStyle} value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                </div>
                
                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <label className="label has-text-grey-light">Genre</label>
                            <div className="control">
                                <input type="text" className="input" style={darkInputStyle} value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Action, Drama" required />
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="field">
                            <label className="label has-text-grey-light">Duration (minutes)</label>
                            <div className="control">
                                <input type="number" className="input" style={darkInputStyle} value={duration} onChange={(e) => setDuration(e.target.value)} required />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <label className="label has-text-grey-light">Rating</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select style={darkInputStyle} value={rating} onChange={(e) => setRating(e.target.value)}>
                                        <option value="G">G</option>
                                        <option value="PG">PG</option>
                                        <option value="PG-13">PG-13</option>
                                        <option value="R">R</option>
                                        <option value="NC-17">NC-17</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="field">
                            <label className="label has-text-grey-light">Status</label>
                            <div className="control">
                                <div className="select is-fullwidth">
                                    <select style={darkInputStyle} value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="now_playing">Now Playing</option>
                                        <option value="coming_soon">Coming Soon</option>
                                        <option value="ended">Ended</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ✅ TAMBAH FIELD RELEASE DATE */}
                <div className="field">
                  <label className="label has-text-grey-light">Release Date</label>
                  <div className="control">
                    <input 
                      type="date" 
                      className="input" 
                      style={darkInputStyle} 
                      value={releaseDate} 
                      onChange={(e) => setReleaseDate(e.target.value)} 
                    />
                  </div>
                </div>                

                <div className="field">
                  <label className="label has-text-grey-light">Synopsis</label>
                  <div className="control">
                    <textarea className="textarea" style={darkInputStyle} value={synopsis} onChange={(e) => setSynopsis(e.target.value)} rows="5" required />
                  </div>
                </div>
                
                {/* Tombol Aksi */}
                <div className="field is-grouped is-grouped-right mt-5">
                  <div className="control">
                    <button type="button" className="button is-light is-outlined" onClick={() => navigate("/admin/movies")}>Cancel</button>
                  </div>
                  <div className="control">
                    <button type="submit" className={`button is-danger ${loading ? 'is-loading' : ''}`} disabled={loading}>
                      {isEditMode ? "Update" : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default MovieForm;