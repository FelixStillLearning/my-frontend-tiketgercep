import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const StudioForm = () => {
  const [studioName, setStudioName] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [rows, setRows] = useState("");
  const [seatsPerRow, setSeatsPerRow] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // ✅ FETCH DATA JIKA EDIT MODE
  useEffect(() => {
    if (isEditMode) {
      fetchStudioData();
    }
  }, [id, isEditMode]);

  const fetchStudioData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/studios/${id}`);
      const studio = response.data;
      setStudioName(studio.studio_name);
      setTotalSeats(studio.total_seats);
      setRows(studio.rows);
      setSeatsPerRow(studio.seats_per_row);
    } catch (error) {
      console.error('Error fetching studio:', error);
      alert('Failed to fetch studio data');
    }
  };

  const saveStudio = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const studioData = {
        studio_name: studioName,
        total_seats: parseInt(totalSeats),
        rows: parseInt(rows),
        seats_per_row: parseInt(seatsPerRow)
      };

      if (isEditMode) {
        // ✅ UPDATE STUDIO
        await axios.patch(`http://localhost:5000/api/studios/${id}`, studioData);
        alert('Studio updated successfully!');
      } else {
        // ✅ CREATE STUDIO
        await axios.post('http://localhost:5000/api/studios', studioData);
        alert('Studio created successfully!');
      }
      
      navigate('/admin/studios');
    } catch (error) {
      console.error('Error saving studio:', error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} studio`);
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
                {isEditMode ? "Edit Studio" : "Add New Studio"}
              </h2>
              
              <form onSubmit={saveStudio}>
                <div className="field">
                  <label className="label has-text-grey-light">Studio Name</label>
                  <div className="control">
                    <input 
                      type="text" 
                      className="input" 
                      style={{ backgroundColor: '#3a3a3a', borderColor: '#4a4a4a', color: '#dbdbdb' }}
                      value={studioName}
                      onChange={(e) => setStudioName(e.target.value)}
                      placeholder="Studio A, Theater 1, etc."
                      required 
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label has-text-grey-light">Total Seats</label>
                  <div className="control">
                    <input 
                      type="number" 
                      className="input" 
                      style={{ backgroundColor: '#3a3a3a', borderColor: '#4a4a4a', color: '#dbdbdb' }}
                      value={totalSeats}
                      onChange={(e) => setTotalSeats(e.target.value)}
                      placeholder="150"
                      min="1"
                      required 
                    />
                  </div>
                </div>

                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label has-text-grey-light">Number of Rows</label>
                      <div className="control">
                        <input 
                          type="number" 
                          className="input" 
                          style={{ backgroundColor: '#3a3a3a', borderColor: '#4a4a4a', color: '#dbdbdb' }}
                          value={rows}
                          onChange={(e) => setRows(e.target.value)}
                          placeholder="10"
                          min="1"
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label has-text-grey-light">Seats per Row</label>
                      <div className="control">
                        <input 
                          type="number" 
                          className="input" 
                          style={{ backgroundColor: '#3a3a3a', borderColor: '#4a4a4a', color: '#dbdbdb' }}
                          value={seatsPerRow}
                          onChange={(e) => setSeatsPerRow(e.target.value)}
                          placeholder="15"
                          min="1"
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Layout */}
                {rows && seatsPerRow && (
                  <div className="field">
                    <label className="label has-text-grey-light">Layout Preview:</label>
                    <div className="notification has-background-grey-dark">
                      <p className="has-text-light">
                        <strong>{rows} rows</strong> × <strong>{seatsPerRow} seats per row</strong> = 
                        <strong className="has-text-success"> {rows * seatsPerRow} total seats</strong>
                      </p>
                      {totalSeats && (parseInt(rows) * parseInt(seatsPerRow)) !== parseInt(totalSeats) && (
                        <p className="has-text-danger">
                          ⚠️ Warning: Calculated seats ({rows * seatsPerRow}) doesn't match total seats ({totalSeats})
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="field is-grouped is-grouped-right mt-5">
                  <div className="control">
                    <button 
                      type="button" 
                      className="button is-light is-outlined"
                      onClick={() => navigate("/admin/studios")}
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
                      {isEditMode ? "Update Studio" : "Save Studio"}
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

export default StudioForm;