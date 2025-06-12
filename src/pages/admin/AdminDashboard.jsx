import React, { useState, useEffect } from 'react';
import AdminNavigation from '../../components/admin/AdminNavigation';
import AdminCard from '../../components/admin/AdminCard';
import DataTable from '../../components/admin/DataTable';
import bookingService from '../../services/bookingService';
import { movieService } from '../../services/MovieService';
import userService from '../../services/userService';

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
    const [loading, setLoading] = useState(true);

    // Fetch data dari API saat component mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                console.log('Fetching dashboard data...');
                
                // Fetch data dari semua endpoint
                const [bookingsResponse, moviesResponse, usersResponse] = await Promise.all([
                    bookingService.getAllBookings().catch(err => {
                        console.error('Error fetching bookings:', err);
                        return [];
                    }),
                    movieService.getAll().catch(err => {
                        console.error('Error fetching movies:', err);
                        return { success: false, data: [] };
                    }),
                    userService.getAllUsers().catch(err => {
                        console.error('Error fetching users:', err);
                        return [];
                    })
                ]);
                
                console.log('Bookings response:', bookingsResponse);
                console.log('Movies response:', moviesResponse);
                console.log('Users response:', usersResponse);

                // Handle format response yang berbeda
                const bookings = Array.isArray(bookingsResponse) ? bookingsResponse : [];
                const movies = moviesResponse.success ? moviesResponse.data : 
                              Array.isArray(moviesResponse) ? moviesResponse : [];
                const users = Array.isArray(usersResponse) ? usersResponse : [];

                // Update stats dengan data real
                const totalBookings = bookings.length || 0;
                const totalMovies = movies.length || 0;
                const totalUsers = users.length || 0;
                
                // Hitung total revenue dari bookings
                const totalRevenue = bookings.reduce((sum, booking) => {
                    const amount = booking.total_price || booking.total_amount || booking.harga_tiket || 0;
                    return sum + (typeof amount === 'string' ? parseInt(amount.replace(/\D/g, '')) || 0 : amount || 0);
                }, 0);

                setStats(prevStats => prevStats.map(stat => {
                    if (stat.title === 'Total Movies') {
                        return { ...stat, value: totalMovies.toString() };
                    }
                    if (stat.title === 'Total Bookings') {
                        return { ...stat, value: totalBookings.toString() };
                    }
                    if (stat.title === 'Total Revenue') {
                        return { ...stat, value: `Rp ${totalRevenue.toLocaleString('id-ID')}` };
                    }
                    if (stat.title === 'Active Users') {
                        return { ...stat, value: totalUsers.toString() };
                    }
                    return stat;
                }));

                // Format booking data untuk table
                const formattedBookings = bookings
                    .slice(0, 10)
                    .map(booking => ({
                        id: booking.booking_id || booking.id,
                        movie: booking.Showtime?.Movie?.title || booking.movie_title || 'Unknown Movie',
                        customer: booking.User?.username || booking.User?.full_name || booking.customer_name || 'Unknown Customer',
                        seats: booking.BookingSeats?.map(bs => bs.Seat?.seat_label || bs.Seat?.seat_number).join(', ') || 
                               booking.total_seats + ' seats' || 'N/A',
                        amount: `Rp ${(booking.total_price || booking.total_amount || booking.harga_tiket || 0).toLocaleString('id-ID')}`,
                        status: booking.status || 'pending',
                        date: booking.booking_date ? 
                              new Date(booking.booking_date).toLocaleDateString('id-ID') :
                              booking.createdAt ? 
                              new Date(booking.createdAt).toLocaleDateString('id-ID') :
                              'Unknown',
                    }));

                setRecentBookings(formattedBookings);

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                // Jika error, tetap gunakan data kosong/default
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const bookingColumns = [        { key: 'movie', label: 'Movie', accessor: 'movie' },
        { key: 'customer', label: 'Customer', accessor: 'customer' },
        { key: 'seats', label: 'Seats', accessor: 'seats' },
        { key: 'amount', label: 'Amount', accessor: 'amount' },
        {
            key: 'status',
            label: 'Status',
            accessor: 'status',
            render: (status, item) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    status === 'completed' ? 'bg-green-500/20 text-green-500' :
                    status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-red-500/20 text-red-500'
                }`}>
                    {status && typeof status === 'string' 
                        ? status.charAt(0).toUpperCase() + status.slice(1)
                        : status || 'Unknown'
                    }
                </span>
            ),
        },
        { key: 'date', label: 'Date', accessor: 'date' },
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
