import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Edit2,
  Trash2,
  Share2,
  Image as ImageIcon,
  AlertTriangle,
  FileText,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import Button from '../components/common/Button';
import IssueTimeline from '../components/issues/IssueTimeline';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export const IssueDetails = () => {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const toast = useToast();
  const { t, isNepali, translateCategory } = useLanguage();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      setLoading(true);
      try {
        const res = await api.getIssueById(id);
        if (res.success) {
          setIssue(res.issue);
        }
      } catch (err) {
        toast.error(err.message || 'Failed to load issue details.');
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  const isOwner = user && issue?.user && (issue.user._id === user._id || issue.user === user._id);
  const isPending = issue?.status === 'Submitted';

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      const res = await api.deleteIssue(issue._id);
      toast.success(res.message || 'Issue deleted successfully.');
      navigate('/my-reports');
    } catch (err) {
      toast.error(err.message || 'Failed to delete issue.');
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t('issueDetails.linkCopied', 'Tracking link copied to clipboard!'));
    }
  };

  if (loading) {
    return <Loader message={t('myReports.loading', 'Fetching official grievance dossier...')} fullHeight />;
  }

  if (!issue) {
    return (
      <div className="container main-content">
        <EmptyState
          icon={AlertTriangle}
          title={isNepali ? 'समस्या फेला परेन' : 'Issue Not Found'}
          description={isNepali ? `हामीले आईडी "${id}" सँग मेल खाने कुनै उजुरी फेला पार्न सकेनौँ।` : `We could not locate any municipal complaint record corresponding to ID "${id}".`}
          actionLabel={t('nav.home', 'Back to Home')}
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="container main-content">
      {/* Top Bar Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm"
          style={{ paddingLeft: 0 }}
        >
          <ArrowLeft size={16} /> {t('issueDetails.backToReports', 'Back to reports')}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Button variant="secondary" size="sm" icon={Share2} onClick={handleShare}>
            {t('issueDetails.shareLink', 'Share Link')}
          </Button>

          {isAdmin && (
            <Link to={`/admin/issues/${issue._id}`}>
              <Button variant="primary" size="sm">
                {t('issueDetails.openAdmin', 'Open Admin Controls')}
              </Button>
            </Link>
          )}

          {isOwner && isPending && (
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={() => setDeleteModalOpen(true)}
            >
              {t('issueDetails.withdrawReport', 'Withdraw Report')}
            </Button>
          )}
        </div>
      </div>

      <div className="issue-details-grid">
        {/* Left Column: Main Issue Content */}
        <div>
          {/* Header Card */}
          <div className="civic-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '1.15rem', color: 'var(--primary-navy)' }}>
                  {issue.issueId}
                </span>
                <span className="badge badge-category">{translateCategory(issue.category)}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <PriorityBadge priority={issue.priority} />
                <StatusBadge status={issue.status} />
              </div>
            </div>

            <h1 style={{ fontSize: '1.85rem', marginBottom: '1rem', lineHeight: '1.25' }}>
              {issue.title}
            </h1>

            {/* Evidence Image */}
            {issue.image && (
              <div className="issue-image-container" onClick={() => setImageModalOpen(true)} style={{ cursor: 'pointer' }}>
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

            {/* Description */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h4 style={{ color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
                {t('issueDetails.grievanceDesc', 'Grievance Description')}
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.975rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {issue.description}
              </p>
            </div>

            {/* Meta tags */}
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
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  {t('issueDetails.exactLocation', 'Exact Location:')}
                </span>
                <strong style={{ color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={15} color="var(--primary-blue)" /> {issue.location}
                </strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  {t('issueDetails.submittedOn', 'Submitted On:')}
                </span>
                <strong style={{ color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={15} color="var(--primary-blue)" />{' '}
                  {new Date(issue.createdAt).toLocaleString(isNepali ? 'ne-NP' : 'en-US')}
                </strong>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                  {t('issueDetails.reportedBy', 'Reported By:')}
                </span>
                <strong style={{ color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={15} color="var(--primary-blue)" /> {issue.user?.name || (isNepali ? 'नागरिक' : 'Citizen')}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Status Timeline & Audit Trail */}
        <div>
          <div className="civic-card" style={{ padding: '1.75rem', position: 'sticky', top: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <ShieldCheck size={20} color="var(--primary-blue)" />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)' }}>
                {t('issueDetails.resolutionPipeline', 'Resolution Pipeline')}
              </h3>
            </div>

            <IssueTimeline
              status={issue.status}
              statusHistory={issue.statusHistory}
              adminRemark={issue.adminRemark}
            />

            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {t('issueDetails.escalationNotice', 'For urgent public escalation or hazards, contact Central Dispatch with tracking code')} <strong>{issue.issueId}</strong>.
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {issue.image && (
        <Modal
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
          title={t('issueDetails.evidenceAttachment', 'Evidence Attachment')}
          maxWidth="700px"
        >
          <img
            src={issue.image.startsWith('http') ? issue.image : issue.image}
            alt="Evidence"
            style={{ width: '100%', borderRadius: 'var(--radius-md)', maxHeight: '70vh', objectFit: 'contain' }}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t('issueDetails.withdrawComplaint', 'Withdraw Complaint')}
        maxWidth="440px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              {t('issueDetails.cancel', 'Cancel')}
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteLoading}>
              {t('issueDetails.confirmDelete', 'Confirm Delete')}
            </Button>
          </>
        }
      >
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          {t('issueDetails.withdrawQuestion', 'Are you sure you want to withdraw and delete complaint')} <strong>{issue.issueId}</strong>?
        </p>
      </Modal>
    </div>
  );
};

export default IssueDetails;
