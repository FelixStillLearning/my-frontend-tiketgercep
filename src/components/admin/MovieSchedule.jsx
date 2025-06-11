import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MovieSchedule = () => {
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Today'); // State untuk tab aktif

    useEffect(() => {
        fetchShowtimes();
    }, []);

    const fetchShowtimes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/showtimes?include=movie,studio');
            setShowtimes(response.data);
        } catch (error) {
            console.error("Error fetching showtimes:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk memfilter jadwal berdasarkan tab yang dipilih
    const getFilteredShowtimes = () => {
        const today = new Date();
        
        return showtimes.filter(show => {
            const showDate = new Date(show.show_date);
            if (activeTab === 'Today') {
                return showDate.toDateString() === today.toDateString();
            }
            if (activeTab === 'Tomorrow') {
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                return showDate.toDateString() === tomorrow.toDateString();
            }
             if (activeTab === 'Friday') {
                // Logika untuk mencari hari Jumat berikutnya
                const nextFriday = new Date(today);
                nextFriday.setDate(today.getDate() + (5 + 7 - today.getDay()) % 7);
                return showDate.toDateString() === nextFriday.toDateString();
            }
            return false;
        }).sort((a,b) => a.show_time.localeCompare(b.show_time)); // Urutkan berdasarkan jam tayang
    };

    const filteredShowtimes = getFilteredShowtimes();

    return (
        <div className="box has-background-dark">
            <h3 className="title is-5 has-text-white">Movie Schedule</h3>
            
            {/* Tombol Tab */}
            <div className="tabs is-toggle is-fullwidth">
                <ul>
                    <li className={activeTab === 'Today' ? 'is-active' : ''}>
                        <a onClick={() => setActiveTab('Today')} className="has-text-white">Today</a>
                    </li>
                    <li className={activeTab === 'Tomorrow' ? 'is-active' : ''}>
                        <a onClick={() => setActiveTab('Tomorrow')} className="has-text-white">Tomorrow</a>
                    </li>
                    <li className={activeTab === 'Friday' ? 'is-active' : ''}>
                        <a onClick={() => setActiveTab('Friday')} className="has-text-white">Friday</a>
                    </li>
                </ul>
            </div>
            
            {/* Daftar Jadwal */}
            {loading ? (
                <p className="has-text-centered has-text-grey-light">Loading schedule...</p>
            ) : (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {filteredShowtimes.length > 0 ? (
                        filteredShowtimes.map(show => (
                            <div key={show.id} className="media">
                                <figure className="media-left">
                                    <p className="image is-48x48">
                                        <img src={show.movie?.poster_url} alt="poster" style={{ borderRadius: '4px' }}/>
                                    </p>
                                </figure>
                                <div className="media-content">
                                    <div className="content">
                                        <p className='has-text-white'>
                                            <strong>{show.movie?.title}</strong>
                                            <br/>
                                            <small className='has-text-grey-light'>{show.studio?.name} - {show.show_time}</small>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="has-text-centered has-text-grey">No shows scheduled for {activeTab}.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MovieSchedule;
