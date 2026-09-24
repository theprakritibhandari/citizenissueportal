import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  FileText,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  AlertCircle,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Select, TextArea } from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const CATEGORIES = [
  'All',
  'Road / Pothole',
  'Street Light',
  'Garbage / Waste',
  'Water Supply',
  'Drainage',
  'Public Infrastructure',
  'Traffic',
  'Other',
];

const STATUSES = ['All', 'Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'];
const PRIORITIES = ['All', 'Low', 'Medium', 'High', 'Urgent'];

const STATUS_OPTIONS = [
  { value: 'Submitted', label: 'Submitted' },
  { value: 'Under Review', label: 'Under Review' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' },
  { value: 'Rejected', label: 'Rejected' },
];

export const AdminIssues = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [priority, setPriority] = useState('All');

  useEffect(() => {
    const urlStatus = searchParams.get('status');
    const urlCat = searchParams.get('category');
    if (urlStatus && STATUSES.includes(urlStatus)) {
      setStatus(urlStatus);
    } else if (!urlStatus) {
      setStatus('All');
    }
    if (urlCat && CATEGORIES.includes(urlCat)) {
      setCategory(urlCat);
    }
  }, [searchParams]);

  // Status Change Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminRemark, setAdminRemark] = useState('');
  const [updating, setUpdating] = useState(false);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingIssue, setDeletingIssue] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (status !== 'All') params.status = status;
      if (priority !== 'All') params.priority = priority;

      const res = await api.getAdminIssues(params);
      if (res.success) {
        setIssues(res.issues);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch issues.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [category, status, priority]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchIssues();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setStatus('All');
    setPriority('All');
  };

  const openStatusModal = (issue) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
    setAdminRemark(issue.adminRemark || '');
    setStatusModalOpen(true);
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await api.updateIssueStatus(selectedIssue._id, newStatus, adminRemark);
      toast.success(res.message || 'Issue status updated successfully!');
      setStatusModalOpen(false);
      fetchIssues();
    } catch (err) {
      toast.error(err.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const openDeleteModal = (issue) => {
    setDeletingIssue(issue);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingIssue) return;
    setDeleting(true);
    try {
      const res = await api.deleteIssueAdmin(deletingIssue._id);
      toast.success(res.message || 'Issue report deleted.');
      setDeleteModalOpen(false);
      setDeletingIssue(null);
      fetchIssues();
    } catch (err) {
      toast.error(err.message || 'Failed to delete issue report.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 style={{ fontSize: '1.75rem' }}>Municipal Issue Management</h1>
          <p style={{ fontSize: '0.9rem' }}>Search, filter, inspect, and update statuses of all citizen reports.</p>
        </div>

        <Button variant="secondary" icon={RefreshCw} onClick={fetchIssues} size="sm">
          Refresh List
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <form onSubmit={handleSearchSubmit} className="filter-search-box">
          <Search size={18} className="filter-search-icon" />
          <input
            type="text"
            className="form-input filter-search-input"
            placeholder="Search by ID, keyword, address, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select
            className="form-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: 'auto', minWidth: '160px' }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: 'auto', minWidth: '140px' }}
          >
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                Status: {st}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ width: 'auto', minWidth: '130px' }}
          >
            {PRIORITIES.map((pr) => (
              <option key={pr} value={pr}>
                Priority: {pr}
              </option>
            ))}
          </select>

          <Button type="button" variant="secondary" size="md" onClick={handleResetFilters}>
            Reset
          </Button>
        </div>
      </div>

      {/* Issues Table */}
      {loading ? (
        <Loader message="Loading issues..." fullHeight />
      ) : issues.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No issues found"
          description="No issues match your currently active search query and filters."
          actionLabel="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="civic-card">
          <div className="table-responsive">
            <table className="civic-table">
              <thead>
                <tr>
                  <th>Issue ID</th>
                  <th>Title & Location</th>
                  <th>Category</th>
                  <th>Citizen Contact</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Reported Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue._id}>
                    <td>
                      <Link to={`/admin/issues/${issue._id}`} style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                        {issue.issueId}
                      </Link>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--primary-navy)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {issue.title}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <MapPin size={12} /> {issue.location}
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-category">{issue.category}</span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{issue.user?.name || 'Citizen'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{issue.user?.email || '—'}</div>
                    </td>

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
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Edit3}
                          onClick={() => openStatusModal(issue)}
                          title="Update resolution status"
                        >
                          Status
                        </Button>
                        <Link to={`/admin/issues/${issue._id}`}>
                          <Button variant="outline" size="sm" icon={Eye} title="Detailed inspect">
                            Review
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => openDeleteModal(issue)}
                          style={{ color: '#DC2626' }}
                          title="Delete inappropriate report"
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status Change Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={`Change Status: ${selectedIssue?.issueId || ''}`}
        maxWidth="520px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleStatusUpdate} loading={updating}>
              Save Status
            </Button>
          </>
        }
      >
        <form onSubmit={handleStatusUpdate}>
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'block' }}>Complaint Title:</span>
            <strong style={{ color: 'var(--primary-navy)' }}>{selectedIssue?.title}</strong>
          </div>

          <Select
            label="Resolution Status"
            name="status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            options={STATUS_OPTIONS}
            required
          />

          <TextArea
            label="Admin Remark & Field Crew Notes"
            name="adminRemark"
            placeholder="Document actions taken by municipal department, crew IDs, or reason for resolution/rejection..."
            value={adminRemark}
            onChange={(e) => setAdminRemark(e.target.value)}
            rows={4}
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Admin Moderation: Delete Report"
        maxWidth="460px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} loading={deleting}>
              Confirm Delete
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 style={{ color: 'var(--primary-navy)', marginBottom: '0.35rem' }}>Permanently remove report {deletingIssue?.issueId}?</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              This will remove the issue report, its evidence photos, and resolution audit trail from public records.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminIssues;
