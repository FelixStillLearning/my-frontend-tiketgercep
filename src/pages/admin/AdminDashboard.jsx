import React, { useState, useEffect } from 'react';
import AdminNavigation from '../../components/admin/AdminNavigation';
import AdminCard from '../../components/admin/AdminCard';
import DataTable from '../../components/admin/DataTable';
import bookingService from '../../services/bookingService';
import { movieService } from '../../services/MovieService';

const AdminDashboard = () => {
    const [stats, setStats] = useState([
        {
            title: 'Total Movies',
            value: '0',
            icon: 'movie',
            color: 'blue',
            trend: 'up',
            trendValue: '0%',
        },
        {
            title: 'Total Bookings',
            value: '0',
            icon: 'ticket',
            color: 'green',
            trend: 'up',
            trendValue: '0%',
        },
        {
            title: 'Total Revenue',
            value: 'Rp 0',
            icon: 'money',
            color: 'purple',
            trend: 'up',
            trendValue: '0%',
        },
        {
            title: 'Active Users',
            value: '0',
            icon: 'users',
            color: 'orange',
            trend: 'up',
            trendValue: '0%',
        },
    ]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);    // Fetch data dari API saat component mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                console.log('Fetching dashboard data...');
                
                // Fetch bookings dan movies secara parallel
                const [bookingsResponse, moviesResponse] = await Promise.all([
                    bookingService.getAllBookings(),
                    movieService.getAll()
                ]);
                
                console.log('Bookings response:', bookingsResponse);
                console.log('Movies response:', moviesResponse);

                // Update stats dengan data real
                const totalBookings = bookingsResponse.length || 0;
                const totalMovies = moviesResponse.length || 0;
                
                // Hitung total revenue dari bookings
                const totalRevenue = bookingsResponse.reduce((sum, booking) => {
                    // Asumsikan ada field total_amount atau harga_tiket
                    const amount = booking.total_amount || booking.harga_tiket || 0;
                    return sum + (typeof amount === 'string' ? parseInt(amount.replace(/\D/g, '')) : amount);
                }, 0);


                setStats(prevStats => prevStats.map(stat => {
                    if (stat.title === 'Total Movies') {
                        return { ...stat, value: totalMovies.toString() };
                    }
                    if (stat.title === 'Total Bookings') {
                        return { ...stat, value: totalBookings.toString() };
                    }
                    if (stat.title === 'Total Revenue') {
                        return { ...stat, value: `Rp ${totalRevenue.toLocaleString()}` };
                    }
                    // Tambahkan logika untuk 'Active Users' jika datanya tersedia
                    return stat;
                }));

                // Ambil 10 booking terbaru dan format data untuk table
                const formattedBookings = bookingsResponse
                    .slice(0, 10)
                    .map(booking => ({
                        id: booking.id,
                        movie: booking.Movie?.title || booking.movie_title || 'Unknown Movie',
                        customer: booking.User?.username || booking.customer_name || 'Unknown Customer',
                        seats: booking.BookingSeats?.map(seat => seat.Seat?.seat_number).join(', ') || booking.seats || 'N/A',
                        amount: `Rp ${(booking.total_amount || booking.harga_tiket || 0).toLocaleString()}`,
                        status: booking.status || 'pending',
                        date: new Date(booking.createdAt || booking.tanggal_booking).toISOString().split('T')[0],
                    }));

                setRecentBookings(formattedBookings);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                // Jika error, tetap gunakan data kosong/default
            } finally {
                setLoading(false);
            }
        };        fetchDashboardData();
    }, []);

    const bookingColumns = [
        { key: 'movie', label: 'Movie' },
        { key: 'customer', label: 'Customer' },
        { key: 'seats', label: 'Seats' },
        { key: 'amount', label: 'Amount' },
        {
            key: 'status',
            label: 'Status',
            render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    item.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                    item.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-red-500/20 text-red-500'
                }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </span>
            ),
        },
        { key: 'date', label: 'Date' },
    ];return (
        <div className="admin-layout">
            <AdminNavigation />
            <div className="admin-main-content">
                <div className="p-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                                <span className="ml-3 text-white">Loading dashboard data...</span>
                            </div>
                        ) : (
                            <>
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    {stats.map((stat, index) => (
                                        <AdminCard
                                            key={index}
                                            title={stat.title}
                                            value={stat.value}
                                            icon={stat.icon}
                                            color={stat.color}
                                            trend={stat.trend}
                                            trendValue={stat.trendValue}
                                        />
                                    ))}
                                </div>

                                {/* Recent Bookings */}
                                <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                                    <div className="p-6 border-b border-gray-700">
                                        <h2 className="text-xl font-semibold text-white">Recent Bookings</h2>
                                    </div>
                                    <DataTable
                                        columns={bookingColumns}
                                        data={recentBookings}
                                        searchable={true}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
