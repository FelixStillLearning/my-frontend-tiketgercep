import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const StudioForm = () => {
  const [studioName, setStudioName] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [rows, setRows] = useState("");
  const [seatsPerRow, setSeatsPerRow] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      getStudioById();
    }
  }, [id]);

  const getStudioById = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/studios/${id}`);
      const studio = response.data;
      setStudioName(studio.studio_name || "");
      setTotalSeats(studio.total_seats || "");
      setRows(studio.rows || "");
      setSeatsPerRow(studio.seats_per_row || "");
    } catch (error) {
      console.error('Error fetching studio:', error);
      alert('Failed to load studio data');
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
        await axios.patch(`http://localhost:5000/api/studios/${id}`, studioData);
      } else {
        await axios.post('http://localhost:5000/api/studios', studioData);
      }
      
      navigate("/admin/studios");
    } catch (error) {
      console.error('Error saving studio:', error);
      alert('Failed to save studio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="columns mt-5 is-centered">
      <div className="column is-half">
        <h2 className="title is-4">
          {isEditMode ? "Edit Studio" : "Add New Studio"}
        </h2>
        <form onSubmit={saveStudio}>
          <div className="field">
            <label className="label">Studio Name</label>
            <div className="control">
              <input 
                type="text" 
                className="input" 
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                placeholder="Studio A, Theater 1, etc."
                required 
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Total Seats</label>
            <div className="control">
              <input 
                type="number" 
                className="input" 
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
                <label className="label">Number of Rows</label>
                <div className="control">
                  <input 
                    type="number" 
                    className="input" 
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
                <label className="label">Seats per Row</label>
                <div className="control">
                  <input 
                    type="number" 
                    className="input" 
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
              <label className="label">Layout Preview:</label>
              <div className="notification is-light">
                <p>
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

          <div className="field is-grouped">
            <div className="control">
              <button 
                type="submit" 
                className="button is-success" 
                disabled={loading}
              >
                {loading ? 'Saving...' : (isEditMode ? "Update Studio" : "Save Studio")}
              </button>
            </div>
            <div className="control">
              <button 
                type="button" 
                className="button is-light"
                onClick={() => navigate("/admin/studios")}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudioForm;