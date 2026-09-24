import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  LayoutDashboard,
  ClipboardList,
  Clock,
  Wrench,
  CheckCircle2,
  Users,
  Settings,
  Shield,
  LogOut,
  X,
} from 'lucide-react';

export const AdminSidebar = ({ stats, isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast.info('Administrator logged out.');
    if (onClose) onClose();
    navigate('/admin/login');
  };

  const isFilterActive = (statusParam) => {
    return location.pathname === '/admin/issues' && location.search.includes(`status=${encodeURIComponent(statusParam)}`);
  };

  return (
    <aside className={`admin-sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="admin-sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                backgroundColor: 'var(--primary-blue)',
                color: 'white',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Shield size={20} />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>
                ADMIN CONSOLE
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Municipal Control Room
              </div>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="admin-sidebar-close-btn"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <ul className="admin-sidebar-nav">
        <li>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
            end
          >
            <div className="admin-nav-link-content">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/issues"
            className={({ isActive }) =>
              `admin-nav-item ${isActive && !location.search ? 'active' : ''}`
            }
            onClick={onClose}
            end
          >
            <div className="admin-nav-link-content">
              <ClipboardList size={18} />
              <span>All Issues</span>
            </div>
            {stats?.totalIssues !== undefined && (
              <span className="admin-nav-badge">{stats.totalIssues}</span>
            )}
          </NavLink>
        </li>

        {/* Filter shortcuts */}
        <li>
          <NavLink
            to="/admin/issues?status=Submitted"
            className={`admin-nav-item ${isFilterActive('Submitted') ? 'active' : ''}`}
            onClick={onClose}
          >
            <div className="admin-nav-link-content" style={{ paddingLeft: '0.5rem' }}>
              <Clock size={16} color="#F59E0B" />
              <span style={{ fontSize: '0.85rem' }}>Pending Review</span>
            </div>
            {stats?.submittedIssues !== undefined && (
              <span className="admin-nav-badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.25)', color: '#FCD34D' }}>
                {stats.submittedIssues}
              </span>
            )}
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/issues?status=In%20Progress"
            className={`admin-nav-item ${isFilterActive('In Progress') ? 'active' : ''}`}
            onClick={onClose}
          >
            <div className="admin-nav-link-content" style={{ paddingLeft: '0.5rem' }}>
              <Wrench size={16} color="#3B82F6" />
              <span style={{ fontSize: '0.85rem' }}>In Progress</span>
            </div>
            {stats?.inProgressIssues !== undefined && (
              <span className="admin-nav-badge" style={{ backgroundColor: 'rgba(59, 130, 246, 0.25)', color: '#93C5FD' }}>
                {stats.inProgressIssues}
              </span>
            )}
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/issues?status=Resolved"
            className={`admin-nav-item ${isFilterActive('Resolved') ? 'active' : ''}`}
            onClick={onClose}
          >
            <div className="admin-nav-link-content" style={{ paddingLeft: '0.5rem' }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span style={{ fontSize: '0.85rem' }}>Resolved</span>
            </div>
            {stats?.resolvedIssues !== undefined && (
              <span className="admin-nav-badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.25)', color: '#6EE7B7' }}>
                {stats.resolvedIssues}
              </span>
            )}
          </NavLink>
        </li>

        <li style={{ margin: '0.5rem 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }} />

        <li>
          <NavLink
            to="/admin/users"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <div className="admin-nav-link-content">
              <Users size={18} />
              <span>Citizens</span>
            </div>
            {stats?.totalCitizens !== undefined && (
              <span className="admin-nav-badge">{stats.totalCitizens}</span>
            )}
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <div className="admin-nav-link-content">
              <Settings size={18} />
              <span>Settings</span>
            </div>
          </NavLink>
        </li>
      </ul>

      <div className="admin-sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>
              {user?.name || 'Administrator'}
            </div>
            <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>
              {user?.email || 'admin@city.gov'}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(220, 38, 38, 0.15)',
            color: '#F87171',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            cursor: 'pointer',
            fontSize: '0.825rem',
            fontWeight: 600,
          }}
        >
          <LogOut size={14} /> Log Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
