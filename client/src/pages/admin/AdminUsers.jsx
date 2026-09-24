import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Users, Search, Mail, Phone, Calendar, FileText, CheckCircle2, Clock } from 'lucide-react';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const toast = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.getAdminUsers();
        if (res.success) {
          setUsers(res.users);
        }
      } catch (err) {
        toast.error(err.message || 'Failed to load citizen list.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone && u.phone.includes(q));
  });

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 style={{ fontSize: '1.75rem' }}>Registered Citizens Directory</h1>
          <p style={{ fontSize: '0.9rem' }}>Citizen accounts registered on the municipal grievance portal.</p>
        </div>
      </div>

      {/* Search */}
      <div className="filter-bar">
        <div className="filter-search-box" style={{ maxWidth: '400px' }}>
          <Search size={18} className="filter-search-icon" />
          <input
            type="text"
            className="form-input filter-search-input"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <Loader message="Loading registered citizen accounts..." fullHeight />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No citizens found"
          description="No registered citizen records match your query."
        />
      ) : (
        <div className="civic-card">
          <div className="table-responsive">
            <table className="civic-table">
              <thead>
                <tr>
                  <th>Citizen Profile</th>
                  <th>Contact Email</th>
                  <th>Contact Phone</th>
                  <th>Joined Date</th>
                  <th>Total Submissions</th>
                  <th>Resolved Issues</th>
                  <th>Pending Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary-blue)',
                            color: 'white',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.85rem',
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong style={{ color: 'var(--primary-navy)' }}>{user.name}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Citizen ID: {user._id.slice(-6).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={13} color="var(--primary-blue)" /> {user.email}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone size={13} color="var(--primary-blue)" /> {user.phone || '—'}
                      </div>
                    </td>

                    <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>

                    <td>
                      <span className="badge badge-category" style={{ fontWeight: 700 }}>
                        <FileText size={12} /> {user.stats?.totalReports || 0} Reports
                      </span>
                    </td>

                    <td>
                      <span className="badge badge-status-resolved">
                        <CheckCircle2 size={12} /> {user.stats?.resolvedReports || 0} Resolved
                      </span>
                    </td>

                    <td>
                      <span className="badge badge-status-submitted">
                        <Clock size={12} /> {user.stats?.pendingReports || 0} Pending
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
