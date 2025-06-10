import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const StudioManager = () => {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchStudios();
  }, []);

  const fetchStudios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/studios');
      setStudios(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch studios');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/studios/${id}`);
      fetchStudios(); // Refresh list setelah delete
    } catch (err) {
      setError('Failed to delete studio');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/studios/${id}`, { status: newStatus });
      fetchStudios(); // Refresh list setelah update
    } catch (err) {
      setError('Failed to update studio status');
    }
  };

  const filteredStudios = studios.filter(studio => {
    if (filter === 'all') return true;
    return studio.status === filter;
  });

  if (loading) {
    return (
      <div className="container mt-6">
        <div className="has-text-centered">
          <p className="is-size-4">Loading studios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-6">
        <div className="notification is-danger">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-6">
      <h1 className="title is-2">Studio Management</h1>
      
      {/* Controls */}
      <div className="level mb-4">
        <div className="level-left">
          <div className="level-item">
            <Link to="/admin/studios/create" className="button is-success">
              Add New Studio
            </Link>
          </div>
        </div>
        <div className="level-right">
          <div className="level-item">
            <div className="field">
              <label className="label">Filter by Status:</label>
              <div className="control">
                <div className="select">
                  <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">All Studios</option>
                    <option value="available">Available</option>
                    <option value="maintenance">Under Maintenance</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Studio Cards */}
      <div className="columns is-multiline">
        {filteredStudios.map((studio) => (
          <div key={studio.studio_id} className="column is-one-third">
            <div className="card">
              <div className="card-header">
                <p className="card-header-title">
                  {studio.name}
                  <span className={`tag ml-2 ${
                    studio.status === 'available' ? 'is-success' : 
                    studio.status === 'maintenance' ? 'is-warning' : 'is-danger'
                  }`}>
                    {studio.status.toUpperCase()}
                  </span>
                </p>
              </div>
              <div className="card-content">
                <div className="content">
                  <p><strong>Type:</strong> {studio.type.toUpperCase()}</p>
                  <p><strong>Capacity:</strong> {studio.capacity} seats</p>
                  
                  {studio.description && (
                    <p><strong>Description:</strong> {studio.description}</p>
                  )}
                  
                  {studio.features && studio.features.length > 0 && (
                    <div>
                      <strong>Features:</strong>
                      <div className="tags mt-1">
                        {studio.features.map((feature, index) => (
                          <span key={index} className="tag is-light is-small">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-footer">
                <Link 
                  to={`/admin/studios/edit/${studio.studio_id}`}
                  className="card-footer-item button is-info"
                >
                  Edit
                </Link>
                
                <div className="dropdown is-hoverable card-footer-item">
                  <div className="dropdown-trigger">
                    <button className="button is-warning" aria-haspopup="true">
                      Status
                    </button>
                  </div>
                  <div className="dropdown-menu">
                    <div className="dropdown-content">
                      <a 
                        className="dropdown-item"
                        onClick={() => handleStatusUpdate(studio.studio_id, 'available')}
                      >
                        Set Available
                      </a>
                      <a 
                        className="dropdown-item"
                        onClick={() => handleStatusUpdate(studio.studio_id, 'maintenance')}
                      >
                        Set Maintenance
                      </a>
                      <a 
                        className="dropdown-item"
                        onClick={() => handleStatusUpdate(studio.studio_id, 'closed')}
                      >
                        Set Closed
                      </a>
                    </div>
                  </div>
                </div>
                
                <button 
                  className="card-footer-item button is-danger"
                  onClick={() => handleDelete(studio.studio_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStudios.length === 0 && (
        <div className="notification is-info">
          {filter === 'all' ? 
            'No studios found.' : 
            `No studios with status "${filter}" found.`
          }
          {filter === 'all' && (
            <> <Link to="/admin/studios/create">Create your first studio</Link></>
          )}
        </div>
      )}
    </div>
  );
};

export default StudioManager;