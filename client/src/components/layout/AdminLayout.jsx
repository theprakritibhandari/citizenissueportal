import React, { useState, useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { api } from '../../services/api';
import { Menu, Shield, X } from 'lucide-react';

export const AdminLayout = () => {
  const [stats, setStats] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        const res = await api.getAdminStats();
        if (res.success) {
          setStats(res.stats);
        }
      } catch (err) {
        // Silently catch stats update
      }
    };
    fetchQuickStats();
  }, []);

  return (
    <div className="admin-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Mobile Header Bar for Admin */}
      <div className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--primary-blue)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={18} />
          </div>
          <span style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>
            ADMIN CONTROL ROOM
          </span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0.4rem',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Toggle admin navigation drawer"
        >
          {mobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Backdrop for mobile drawer */}
        {mobileSidebarOpen && (
          <div
            className="admin-sidebar-backdrop"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <AdminSidebar
          stats={stats}
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="admin-main" style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
          <Outlet context={{ stats, setStats }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
