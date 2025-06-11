import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const UserForm = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user"); // ✅ DEFAULT: user (sesuai database)
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
    if (isEditMode) {
      fetchUserData();
    }
  }, [id, isEditMode]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${id}`);
      const user = response.data;
      setUsername(user.username || "");
      setFullName(user.full_name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setRole(user.role || "user"); // ✅ SESUAI DATABASE
      // Password tidak di-set untuk edit mode (security)
    } catch (error) {
      console.error('Error fetching user:', error);
      alert('Failed to load user data');
    }
  };

  const saveUser = async (e) => {
    e.preventDefault();
    
    // Validasi password untuk create mode
    if (!isEditMode && password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (!isEditMode && password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        username,
        full_name: fullName,
        email,
        phone,
        role
        // ✅ HAPUS status
      };

      // Tambah password hanya untuk create mode
      if (!isEditMode && password) {
        userData.password = password;
      }

      if (isEditMode) {
        await axios.patch(`http://localhost:5000/api/users/${id}`, userData);
      } else {
        await axios.post('http://localhost:5000/api/users', userData);
      }
      
      navigate('/admin/users');
    } catch (error) {
      console.error('Error saving user:', error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} user: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" style={{ backgroundColor: '#1f1f1f', minHeight: '100vh' }}>
      <div className="container">
        <div className="columns is-centered">
          <div className="column is-two-thirds">
            <div className="box has-background-dark">
              <h2 className="title is-4 has-text-white mb-5">
                {isEditMode ? "Edit User" : "Add New User"}
              </h2>
              
              <form onSubmit={saveUser}>
                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label has-text-grey-light">Username</label>
                      <div className="control">
                        <input 
                          type="text" 
                          className="input" 
                          style={darkInputStyle}
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="johndoe"
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label has-text-grey-light">Full Name</label>
                      <div className="control">
                        <input 
                          type="text" 
                          className="input" 
                          style={darkInputStyle}
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          required 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="columns">
                  <div className="column">
                    <div className="field">
                      <label className="label has-text-grey-light">Email</label>
                      <div className="control">
                        <input 
                          type="email" 
                          className="input" 
                          style={darkInputStyle}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com"
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  <div className="column">
                    <div className="field">
                      <label className="label has-text-grey-light">Phone</label>
                      <div className="control">
                        <input 
                          type="tel" 
                          className="input" 
                          style={darkInputStyle}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="081234567890"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Password fields - hanya untuk create mode */}
                {!isEditMode && (
                  <div className="columns">
                    <div className="column">
                      <div className="field">
                        <label className="label has-text-grey-light">Password</label>
                        <div className="control">
                          <input 
                            type="password" 
                            className="input" 
                            style={darkInputStyle}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="column">
                      <div className="field">
                        <label className="label has-text-grey-light">Confirm Password</label>
                        <div className="control">
                          <input 
                            type="password" 
                            className="input" 
                            style={darkInputStyle}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm password"
                            required 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ✅ HANYA FIELD ROLE, HAPUS STATUS */}
                <div className="field">
                  <label className="label has-text-grey-light">Role</label>
                  <div className="control">
                    <div className="select is-fullwidth">
                      <select 
                        style={darkInputStyle}
                        value={role} 
                        onChange={(e) => setRole(e.target.value)}
                        required
                      >
                        {/* ✅ SESUAI DATABASE: hanya 'admin' dan 'user' */}
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>

                {isEditMode && (
                  <div className="notification is-info is-light">
                    <p className="has-text-dark">
                      <strong>Note:</strong> To change password, please use the separate "Change Password" feature for security reasons.
                    </p>
                  </div>
                )}

                <div className="field is-grouped is-grouped-right mt-5">
                  <div className="control">
                    <button 
                      type="button" 
                      className="button is-light is-outlined"
                      onClick={() => navigate("/admin/users")}
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
                      {isEditMode ? "Update User" : "Create User"}
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

export default UserForm;