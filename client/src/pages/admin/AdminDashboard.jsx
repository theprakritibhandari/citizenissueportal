import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  FileText,
  Clock,
  Search,
  Wrench,
  CheckCircle2,
  XCircle,
  Users,
  Eye,
  Edit3,
  TrendingUp,
  BarChart3,
  Layers,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Select, TextArea } from '../../components/common/Input';
import Loader from '../../components/common/Loader';

const STATUS_OPTIONS = [
  { value: 'Submitted', label: 'Submitted (Initial)' },
  { value: 'Under Review', label: 'Under Review (Ward Inspection)' },
  { value: 'In Progress', label: 'In Progress (Crew Dispatched)' },
  { value: 'Resolved', label: 'Resolved (Fixed & Verified)' },
  { value: 'Rejected', label: 'Rejected (Non-actionable / Inappropriate)' },
];

export const AdminDashboard = () => {
  const { setStats: setParentStats } = useOutletContext() || {};
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Status Change Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminRemark, setAdminRemark] = useState('');
  const [updating, setUpdating] = useState(false);

  const toast = useToast();

  const fetchDashboardData = async () => {
    try {
      const res = await api.getAdminStats();
      if (res.success) {
        setData(res.stats);
        if (setParentStats) {
          setParentStats(res.stats);
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openStatusModal = (issue) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
    setAdminRemark(issue.adminRemark || '');
    setStatusModalOpen(true);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!newStatus) return;

    setUpdating(true);
    try {
      const res = await api.updateIssueStatus(selectedIssue._id, newStatus, adminRemark);
      toast.success(res.message || 'Status updated successfully!');
      setStatusModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <Loader message="Loading municipal control room metrics..." fullHeight />;
  }

  const stats = data || {};

  return (
    <div>
      {/* Top Header */}
      <div className="admin-page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-blue)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Shield size={16} /> Municipal Oversight Console
          </div>
          <h1 style={{ fontSize: '1.75rem', marginTop: '0.2rem' }}>Civic Grievance Dashboard</h1>
          <p style={{ fontSize: '0.9rem' }}>Real-time telemetry and resolution pipeline tracking across all city sectors.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/admin/issues">
            <Button variant="primary" icon={FileText}>
              Manage All Issues
            </Button>
          </Link>
          <Link to="/admin/users">
            <Button variant="secondary" icon={Users}>
              Citizens Directory
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card" style={{ borderLeft: '4px solid #0066CC' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL ISSUES</span>
          <div className="admin-stat-number">{stats.totalIssues || 0}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary-blue)' }}>Across all departments</span>
        </div>

        <div className="admin-stat-card" style={{ borderLeft: '4px solid #D97706' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>SUBMITTED</span>
          <div className="admin-stat-number" style={{ color: '#D97706' }}>{stats.submittedIssues || 0}</div>
          <span style={{ fontSize: '0.75rem', color: '#D97706' }}>Awaiting initial triage</span>
        </div>

        <div className="admin-stat-card" style={{ borderLeft: '4px solid #7C3AED' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>UNDER REVIEW</span>
          <div className="admin-stat-number" style={{ color: '#7C3AED' }}>{stats.underReviewIssues || 0}</div>
          <span style={{ fontSize: '0.75rem', color: '#7C3AED' }}>Ward inspection active</span>
        </div>

        <div className="admin-stat-card" style={{ borderLeft: '4px solid #2563EB' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>IN PROGRESS</span>
          <div className="admin-stat-number" style={{ color: '#2563EB' }}>{stats.inProgressIssues || 0}</div>
          <span style={{ fontSize: '0.75rem', color: '#2563EB' }}>Engineering crew assigned</span>
        </div>

        <div className="admin-stat-card" style={{ borderLeft: '4px solid #059669' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>RESOLVED</span>
          <div className="admin-stat-number" style={{ color: '#059669' }}>{stats.resolvedIssues || 0}</div>
          <span style={{ fontSize: '0.75rem', color: '#059669' }}>Completed & certified</span>
        </div>

        <div className="admin-stat-card" style={{ borderLeft: '4px solid #DC2626' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>REJECTED</span>
          <div className="admin-stat-number" style={{ color: '#DC2626' }}>{stats.rejectedIssues || 0}</div>
          <span style={{ fontSize: '0.75rem', color: '#DC2626' }}>Invalid / duplicate</span>
        </div>

        <div className="admin-stat-card" style={{ borderLeft: '4px solid #0D9488' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>REGISTERED CITIZENS</span>
          <div className="admin-stat-number" style={{ color: '#0D9488' }}>{stats.totalCitizens || 0}</div>
          <span style={{ fontSize: '0.75rem', color: '#0D9488' }}>Active portal accounts</span>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Category Breakdown Bar Chart Representation */}
        <div className="civic-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BarChart3 size={18} color="var(--primary-blue)" />
              <h3 style={{ fontSize: '1.1rem' }}>Issues by Department Category</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {stats.categoryStats && stats.categoryStats.length > 0 ? (
              stats.categoryStats.map((item) => {
                const percentage = stats.totalIssues > 0 ? Math.round((item.count / stats.totalIssues) * 100) : 0;
                return (
                  <div key={item.category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--primary-navy)' }}>{item.category}</span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {item.count} issues ({percentage}%)
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: '100%',
                          backgroundColor: 'var(--primary-blue)',
                          borderRadius: '4px',
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No category data available.</p>
            )}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="civic-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--primary-blue)" />
              <h3 style={{ fontSize: '1.1rem' }}>Priority Distribution</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['Urgent', 'High', 'Medium', 'Low'].map((pLevel) => {
              const match = stats.priorityStats?.find((p) => p.priority === pLevel);
              const count = match ? match.count : 0;
              const percentage = stats.totalIssues > 0 ? Math.round((count / stats.totalIssues) * 100) : 0;

              let color = '#10B981';
              if (pLevel === 'Urgent') color = '#EF4444';
              else if (pLevel === 'High') color = '#EA580C';
              else if (pLevel === 'Medium') color = '#F59E0B';

              return (
                <div key={pLevel}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color }} />
                      <span style={{ fontWeight: 600 }}>{pLevel} Priority</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)' }}>{count} ({percentage}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: color,
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Issues Table */}
      <div className="civic-card">
        <div className="civic-card-header">
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Recent Incoming Reports</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Latest reports requiring administrator intervention or status updates</p>
          </div>
          <Link to="/admin/issues">
            <Button variant="outline" size="sm" icon={ArrowRight}>
              View All Issues
            </Button>
          </Link>
        </div>

        <div className="table-responsive">
          <table className="civic-table">
            <thead>
              <tr>
                <th>Issue ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Citizen</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentIssues && stats.recentIssues.length > 0 ? (
                stats.recentIssues.map((issue) => (
                  <tr key={issue._id}>
                    <td>
                      <Link to={`/admin/issues/${issue._id}`} style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                        {issue.issueId}
                      </Link>
                    </td>
                    <td>
                      <div style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600, color: 'var(--primary-navy)' }}>
                        {issue.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{issue.location}</div>
                    </td>
                    <td>
                      <span className="badge badge-category">{issue.category}</span>
                    </td>
                    <td>{issue.user?.name || 'Citizen'}</td>
                    <td>
                      <PriorityBadge priority={issue.priority} />
                    </td>
                    <td>
                      <StatusBadge status={issue.status} />
                    </td>
                    <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Edit3}
                          onClick={() => openStatusModal(issue)}
                          title="Change status"
                        >
                          Status
                        </Button>
                        <Link to={`/admin/issues/${issue._id}`}>
                          <Button variant="outline" size="sm" icon={Eye}>
                            Review
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>
                    No recent issues logged.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Status Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={`Update Status: ${selectedIssue?.issueId || ''}`}
        maxWidth="520px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleStatusUpdate} loading={updating}>
              Apply & Save Status
            </Button>
          </>
        }
      >
        <form onSubmit={handleStatusUpdate}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block' }}>Issue Title:</span>
            <strong style={{ color: 'var(--primary-navy)' }}>{selectedIssue?.title}</strong>
          </div>

          <Select
            label="New Resolution Status"
            name="status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            options={STATUS_OPTIONS}
            required
          />

          <TextArea
            label="Admin Engineering / Progress Remark"
            name="adminRemark"
            placeholder="e.g. Ward Engineer dispatched to site; repair team scheduled for tomorrow 10:00 AM..."
            value={adminRemark}
            onChange={(e) => setAdminRemark(e.target.value)}
            rows={3}
            hint="This note will be visible on the citizen's resolution tracker."
          />
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
