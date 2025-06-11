import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DataTable from '../../components/admin/DataTable';

const AdminUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/users');
            console.log('Users data:', response.data);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (userId) => {
        navigate(`/admin/users/edit/${userId}`);
    };

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${userId}`);
                fetchUsers(); // Refresh data
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Failed to delete user');
            }
        }
    };

    const getRoleBadge = (role) => {
        const roleMap = {
            'admin': 'is-danger',
            'user': 'is-info'  // ✅ UBAH dari 'customer' ke 'user'
        };
        return `tag ${roleMap[role] || 'is-light'}`;
    };

    // ✅ DEFINISI KOLOM TABEL - HAPUS STATUS DAN LAST LOGIN
    const columns = [
        { 
            header: 'User ID', 
            accessor: 'user_id',
            cell: (id) => (
                <span className="has-text-warning">
                    #{id}
                </span>
            )
        },
        { 
            header: 'Profile', 
            accessor: 'full_name',
            cell: (name, item) => (
                <div>
                    <strong className="has-text-white">{name || 'N/A'}</strong>
                    <div>
                        <small className="has-text-grey">
                            {item.email || 'No email'}
                        </small>
                    </div>
                    {item.phone && (
                        <div>
                            <small className="has-text-grey-light">
                                📞 {item.phone}
                            </small>
                        </div>
                    )}
                </div>
            )
        },
        { 
            header: 'Username', 
            accessor: 'username',
            cell: (username) => (
                <span className="tag is-light">
                    @{username || 'N/A'}
                </span>
            )
        },
        { 
            header: 'Role', 
            accessor: 'role',
            cell: (role) => (
                <span className={getRoleBadge(role)}>
                    {role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Unknown'}
                </span>
            )
        },
        // ✅ HAPUS STATUS COLUMN
        // ✅ HAPUS LAST LOGIN COLUMN
        { 
            header: 'Joined', 
            accessor: 'created_at',
            cell: (date) => (
                <span className="has-text-grey-light">
                    {date ? new Date(date).toLocaleDateString('id-ID') : 'N/A'}
                </span>
            )
        }
    ];

    return (
        <section className="section" style={{ backgroundColor: '#1f1f1f', minHeight: '100vh' }}>
            <div className="container">
                <div className="mb-6">
                    <DataTable 
                        title="User Management"
                        columns={columns}
                        data={users}
                        loading={loading}
                        onAdd={() => navigate('/admin/users/create')}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </section>
    );
};

export default AdminUser;