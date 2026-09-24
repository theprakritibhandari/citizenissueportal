import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  Shield,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  Edit3,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Select, TextArea } from '../../components/common/Input';
import IssueTimeline from '../../components/issues/IssueTimeline';
import Modal from '../../components/common/Modal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';

const STATUS_OPTIONS = [
  { value: 'Submitted', label: 'Submitted' },
  { value: 'Under Review', label: 'Under Review' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Resolved', label: 'Resolved' },
  { value: 'Rejected', label: 'Rejected' },
];

export const AdminIssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  // Status Form state
  const [status, setStatus] = useState('');
  const [adminRemark, setAdminRemark] = useState('');
  const [updating, setUpdating] = useState(false);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchIssue = async () => {
    setLoading(true);
    try {
      const res = await api.getIssueById(id);
      if (res.success) {
        setIssue(res.issue);
        setStatus(res.issue.status);
        setAdminRemark(res.issue.adminRemark || '');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load issue details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await api.updateIssueStatus(issue._id, status, adminRemark);
      toast.success(res.message || 'Resolution status updated successfully!');
      fetchIssue();
    } catch (err) {
      toast.error(err.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await api.deleteIssueAdmin(issue._id);
      toast.success(res.message || 'Issue deleted by administrator.');
      navigate('/admin/issues');
    } catch (err) {
      toast.error(err.message || 'Failed to delete issue.');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return <Loader message="Fetching issue dossier for administration review..." fullHeight />;
  }

  if (!issue) {
    return (
      <div>
        <EmptyState
          title="Issue Not Found"
          description="The requested complaint record does not exist or has been deleted."
          actionLabel="Back to Issues Table"
          onAction={() => navigate('/admin/issues')}
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header & Back */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          onClick={() => navigate('/admin/issues')}
          className="btn btn-ghost btn-sm"
          style={{ paddingLeft: 0 }}
        >
          <ArrowLeft size={16} /> Back to All Issues
        </button>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete Inappropriate Report
          </Button>
        </div>
      </div>

      <div className="issue-details-grid">
        {/* Left Column: Complaint Details */}
        <div>
          <div className="civic-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary-navy)' }}>
                  {issue.issueId}
                </span>
                <span className="badge badge-category">{issue.category}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <PriorityBadge priority={issue.priority} />
                <StatusBadge status={issue.status} />
              </div>
            </div>

            <h1 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>{issue.title}</h1>

            {/* Evidence Image */}
            {issue.image && (
              <div className="issue-image-container">
                <img
                  src={issue.image.startsWith('http') ? issue.image : issue.image}
                  alt={issue.title}
                  className="issue-image-main"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>Report Description</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {issue.description}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-light)',
                fontSize: '0.85rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Location:</span>
                <strong style={{ color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={15} color="var(--primary-blue)" /> {issue.location}
                </strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Logged Timestamp:</span>
                <strong style={{ color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={15} color="var(--primary-blue)" /> {new Date(issue.createdAt).toLocaleString()}
                </strong>
              </div>
            </div>
          </div>

          {/* Citizen Reporter Info Card */}
          <div className="civic-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <User size={18} color="var(--primary-blue)" />
              <h3 style={{ fontSize: '1.1rem' }}>Citizen Reporter Information</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Name</span>
                <strong style={{ fontSize: '0.95rem' }}>{issue.user?.name || 'Citizen'}</strong>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Email</span>
                <strong style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={14} /> {issue.user?.email || '—'}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Phone</span>
                <strong style={{ fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={14} /> {issue.user?.phone || 'Not provided'}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Admin Actions & Resolution Controls */}
        <div>
          {/* Status Control Card */}
          <div className="civic-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <Edit3 size={18} color="var(--primary-blue)" />
              <h3 style={{ fontSize: '1.15rem' }}>Update Status & Remarks</h3>
            </div>

            <form onSubmit={handleStatusSubmit}>
              <Select
                label="Resolution Status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                options={STATUS_OPTIONS}
                required
              />

              <TextArea
                label="Admin Remark & Action Log"
                name="adminRemark"
                placeholder="Enter actions taken, engineering department response, or resolution notes..."
                value={adminRemark}
                onChange={(e) => setAdminRemark(e.target.value)}
                rows={4}
                hint="This message is directly published to the citizen."
              />

              <Button type="submit" variant="primary" fullWidth loading={updating} icon={CheckCircle}>
                Save & Broadcast Status
              </Button>
            </form>
          </div>

          {/* Timeline Card */}
          <div className="civic-card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Clock size={18} color="var(--primary-blue)" />
              <h3 style={{ fontSize: '1.15rem' }}>Audit Timeline</h3>
            </div>

            <IssueTimeline
              status={issue.status}
              statusHistory={issue.statusHistory}
              adminRemark={issue.adminRemark}
            />
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Report Deletion"
        maxWidth="440px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete Report
            </Button>
          </>
        }
      >
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Are you sure you want to permanently delete report <strong>{issue.issueId}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default AdminIssueDetails;
