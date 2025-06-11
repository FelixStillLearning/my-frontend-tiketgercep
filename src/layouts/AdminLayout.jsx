// src/layouts/AdminLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavigation from '../components/admin/AdminNavigation';
import AdminHeader from '../components/admin/AdminHeader'; // 1. Import AdminHeader

const AdminLayout = () => {
  return (
    <div className="columns is-gapless">
      <div className="column is-narrow">
        <AdminNavigation />
      </div>
      <div className="column" style={{ display: 'flex', flexDirection: 'column' }}>
        {/* 2. Tambahkan AdminHeader di sini */}
        <AdminHeader /> 

        {/* 3. Bungkus Outlet dengan div agar bisa di-scroll */}
        <div className="is-flex-grow-1" style={{ overflowY: 'auto' }}>
            <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;