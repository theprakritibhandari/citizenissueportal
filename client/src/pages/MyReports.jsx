import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { Input, TextArea, Select } from '../components/common/Input';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const CATEGORIES = [
  'Road / Pothole',
  'Street Light',
  'Garbage / Waste',
  'Water Supply',
  'Drainage',
  'Public Infrastructure',
  'Traffic',
  'Other',
];

const STATUS_KEYS = ['All', 'Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'];

export const MyReports = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    priority: 'Medium',
  });
  const [editLoading, setEditLoading] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const { t, isNepali, translateCategory, translateStatus, translatePriority } = useLanguage();

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.getMyIssues(params);
      if (res.success) {
        setIssues(res.issues);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to load your reported issues.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchIssues();
  };

  // Open Edit Modal
  const openEditModal = (issue) => {
    if (issue.status !== 'Submitted') {
      toast.warning(`Cannot edit issue: Action has already started (${translateStatus(issue.status)}).`);
      return;
    }
    setEditingIssue(issue);
    setEditFormData({
      title: issue.title,
      category: issue.category,
      description: issue.description,
      location: issue.location,
      priority: issue.priority || 'Medium',
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.title || !editFormData.description || !editFormData.location) {
      toast.error(t('auth.fillMandatory', 'Please fill in all mandatory fields.'));
      return;
    }

    setEditLoading(true);
    try {
      const data = new FormData();
      data.append('title', editFormData.title.trim());
      data.append('category', editFormData.category);
      data.append('description', editFormData.description.trim());
      data.append('location', editFormData.location.trim());
      data.append('priority', editFormData.priority);

      const res = await api.updateIssue(editingIssue._id, data);
      toast.success(res.message || 'Issue report updated successfully!');
      setEditModalOpen(false);
      fetchIssues();
    } catch (err) {
      toast.error(err.message || 'Failed to update issue.');
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Action
  const openDeleteModal = (id) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      const res = await api.deleteIssue(deletingId);
      toast.success(res.message || 'Issue report removed.');
      setDeleteModalOpen(false);
      setDeletingId(null);
      fetchIssues();
    } catch (err) {
      toast.error(err.message || 'Failed to delete issue report.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const categoryOptions = CATEGORIES.map((cat) => ({
    value: cat,
    label: translateCategory(cat),
  }));

  const priorityOptions = [
    { value: 'Low', label: translatePriority('Low') },
    { value: 'Medium', label: translatePriority('Medium') },
    { value: 'High', label: translatePriority('High') },
    { value: 'Urgent', label: translatePriority('Urgent') },
  ];

  return (
    <div className="container main-content">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            <FileText size={16} /> {t('myReports.badge', 'Citizen Submissions')}
          </div>
          <h1>{t('myReports.title', 'My Reported Issues')}</h1>
          <p style={{ marginTop: '0.25rem' }}>
            {t('myReports.subtitle', 'Track progress, read municipal engineering notes, and manage your active complaints.')}
          </p>
        </div>

        <Link to="/report">
          <Button variant="primary" icon={PlusCircle} size="md">
            {t('myReports.reportNew', 'Report New Issue')}
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <form onSubmit={handleSearchSubmit} className="filter-search-box">
          <Search size={18} className="filter-search-icon" />
          <input
            type="text"
            className="form-input filter-search-input"
            placeholder={t('myReports.searchPlaceholder', 'Search by ID, keyword, or location...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <Button type="button" variant="secondary" size="md" onClick={fetchIssues}>
          {t('myReports.searchBtn', 'Search')}
        </Button>
      </div>

      {/* Status Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border-light)',
        }}
      >
        {STATUS_KEYS.map((tab) => {
          const tabLabel = tab === 'All' ? t('myReports.all', 'All') : translateStatus(tab);
          return (
            <button
              key={tab}
              onClick={() => setSelectedStatus(tab)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: selectedStatus === tab ? 'var(--primary-blue)' : 'var(--border-light)',
                backgroundColor: selectedStatus === tab ? 'var(--primary-blue-light)' : 'white',
                color: selectedStatus === tab ? 'var(--primary-blue)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {tabLabel}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <Loader message={t('myReports.loading', 'Loading your submitted reports...')} fullHeight />
      ) : issues.length === 0 ? (
        <EmptyState
          title={
            selectedStatus !== 'All'
              ? `${translateStatus(selectedStatus)} ${isNepali ? 'मा कुनै समस्या भेटिएन' : 'issues not found'}`
              : t('myReports.noIssuesTitle', 'No issues submitted yet')
          }
          description={t('myReports.noIssuesDesc', 'You have not reported any civic issues in this status category. Help improve our community by reporting neighborhood problems!')}
          actionLabel={t('home.reportIssueBtn', 'Report a Public Issue')}
          actionIcon={PlusCircle}
          onAction={() => navigate('/report')}
        />
      ) : (
        <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))' }}>
          {issues.map((issue) => {
            const isPending = issue.status === 'Submitted';

            return (
              <div key={issue._id} className="civic-card civic-card-interactive">
                <div className="civic-card-header">
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--primary-navy)', fontSize: '0.9rem' }}>
                    {issue.issueId}
                  </span>
                  <StatusBadge status={issue.status} />
                </div>

                <div className="civic-card-body">
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span className="badge badge-category">{translateCategory(issue.category)}</span>
                    <PriorityBadge priority={issue.priority} />
                  </div>

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.6rem', lineHeight: '1.3' }}>
                    {issue.title}
                  </h3>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {issue.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={15} color="var(--primary-blue)" style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {issue.location}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={15} color="var(--primary-blue)" style={{ flexShrink: 0 }} />
                      <span>
                        {t('myReports.reportedOn', 'Reported on')}{' '}
                        {new Date(issue.createdAt).toLocaleDateString(isNepali ? 'ne-NP' : 'en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="civic-card-footer">
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {isPending && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Edit2}
                          onClick={() => openEditModal(issue)}
                          title="Edit pending issue"
                        >
                          {t('myReports.edit', 'Edit')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Trash2}
                          onClick={() => openDeleteModal(issue._id)}
                          style={{ color: '#DC2626' }}
                          title="Withdraw report"
                        >
                          {t('myReports.delete', 'Delete')}
                        </Button>
                      </>
                    )}
                  </div>

                  <Link to={`/issues/${issue._id}`}>
                    <Button variant="outline" size="sm">
                      {t('myReports.trackProgress', 'Track Progress →')}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Issue Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`${t('myReports.editTitle', 'Edit Issue Report')}: ${editingIssue?.issueId || ''}`}
        maxWidth="600px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditModalOpen(false)}>
              {t('myReports.cancel', 'Cancel')}
            </Button>
            <Button variant="primary" onClick={handleEditSubmit} loading={editLoading}>
              {t('myReports.saveChanges', 'Save Changes')}
            </Button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit}>
          <Input
            label={t('report.issueTitle', 'Issue Title')}
            name="title"
            value={editFormData.title}
            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Select
              label={t('report.category', 'Category')}
              name="category"
              value={editFormData.category}
              onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
              options={categoryOptions}
              required
            />

            <Select
              label={t('report.priority', 'Priority')}
              name="priority"
              value={editFormData.priority}
              onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
              options={priorityOptions}
              required
            />
          </div>

          <TextArea
            label={t('report.description', 'Description')}
            name="description"
            value={editFormData.description}
            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
            required
            rows={4}
          />

          <Input
            label={t('report.location', 'Location')}
            name="location"
            value={editFormData.location}
            onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
            required
          />
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t('myReports.deleteTitle', 'Confirm Report Cancellation')}
        maxWidth="440px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              {t('myReports.keepReport', 'Keep Report')}
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm} loading={deleteLoading}>
              {t('myReports.yesDelete', 'Yes, Delete Report')}
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <AlertCircle size={24} />
          </div>
          <div>
            <h4 style={{ color: 'var(--primary-navy)', marginBottom: '0.35rem' }}>
              {t('myReports.deleteQuestion', 'Withdraw this issue report?')}
            </h4>
            <p style={{ fontSize: '0.875rem' }}>
              {t('myReports.deleteWarning', 'Are you sure you want to delete this report? This action cannot be undone once deleted.')}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyReports;
