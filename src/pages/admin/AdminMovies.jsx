import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/admin/DataTable';
import TopMovies from '../../components/admin/TopMovies';
import RecentBookings from '../../components/admin/RecentBookings';
import SystemStatus from '../../components/admin/SystemStatus';

const AdminMovies = () => {
    // State untuk semua data dari API
    const [allMovies, setAllMovies] = useState([]);
    
    // State untuk pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6); // Atur jumlah item per halaman
    
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Mengambil data saat komponen pertama kali dimuat
    useEffect(() => {
        fetchMovies();
    }, []);
    
    const fetchMovies = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/movies');
            setAllMovies(response.data);
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setLoading(false);
        }
    };
    
    // Handler untuk Edit (Gaya Anda yang eksplisit)
    const handleEdit = (movieId) => {
        navigate(`/admin/movies/edit/${movieId}`);
    };

    // Handler untuk Delete (Gaya Anda dengan re-fetch)
    const handleDelete = async (movieId) => {
        if (window.confirm("Are you sure you want to delete this movie?")) {
            try {
                await axios.delete(`http://localhost:5000/api/movies/${movieId}`);
                fetchMovies(); // Refresh data dari server
            } catch (error) {
                console.error("Error deleting movie:", error);
                alert('Failed to delete movie');
            }
        }
    };

    // Logika untuk memotong data sesuai halaman saat ini
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentMovies = allMovies.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(allMovies.length / itemsPerPage);

    const columns = [
        { header: 'Poster', accessor: 'poster_url', cell: (url) => <img src={url} alt="poster" style={{ width: '60px', height: 'auto', borderRadius: '4px' }} /> },
        { header: 'Title', accessor: 'title' },
        { header: 'Genre', accessor: 'genre' },
        { header: 'Duration', accessor: 'duration', cell: (mins) => `${mins} min` },
        { header: 'Rating', accessor: 'rating' },
        { header: 'Status', accessor: 'status', cell: (status) => <span className={`tag ${status === 'now_playing' ? 'is-success' : 'is-info'}`}>{status.replace('_', ' ')}</span> }
    ];

    return (
        <section className="section" style={{ backgroundColor: '#1f1f1f', minHeight: '100vh' }}>
            <div className="container">
                <div className="mb-6">
                    <DataTable 
                        title="Movie Management"
                        columns={columns}
                        data={currentMovies} // Kirim data yang sudah dipotong
                        loading={loading}
                        onAdd={() => navigate('/admin/movies/create')}
                        onEdit={handleEdit}   // Panggil handler yang sudah dibuat
                        onDelete={handleDelete} // Panggil handler yang sudah dibuat
                        // Props untuk pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={allMovies.length}
                        itemsPerPage={itemsPerPage}
                    />
                </div>

                <div className="columns is-multiline">
                    <div className="column is-one-third"><TopMovies /></div>
                    <div className="column is-one-third"><RecentBookings /></div>
                    <div className="column is-one-third"><SystemStatus /></div>
                </div>
            </div>
        </section>
    );
};

export default AdminMovies;