import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  FilePlus,
  UploadCloud,
  X,
  MapPin,
  AlertCircle,
  ShieldCheck,
  Navigation,
  CheckCircle,
} from 'lucide-react';
import { Input, TextArea, Select } from '../components/common/Input';
import Button from '../components/common/Button';

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

const PRIORITIES_DATA = [
  { value: 'Low', enSuffix: 'Routine maintenance / Non-disruptive', neSuffix: 'नियमित मर्मत / सामान्य' },
  { value: 'Medium', enSuffix: 'Standard neighborhood inconvenience', neSuffix: 'सामान्य जनजीवन असुविधा' },
  { value: 'High', enSuffix: 'Serious hazard or traffic obstruction', neSuffix: 'गम्भीर जोखिम वा सवारी अवरोध' },
  { value: 'Urgent', enSuffix: 'Imminent public safety or health danger', neSuffix: 'तत्काल सार्वजनिक सुरक्षा वा स्वास्थ्य जोखिम' },
];

export const ReportIssue = () => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const { t, isNepali, translateCategory, translatePriority } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    title: '',
    category: searchParams.get('category') || 'Road / Pothole',
    description: '',
    location: '',
    priority: 'Medium',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam && CATEGORIES.includes(catParam)) {
      setFormData((prev) => ({ ...prev, category: catParam }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('report.fileSizeError', 'Image file size must not exceed 5MB.'));
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          location: `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        }));
        toast.success(t('report.gpsSuccess', 'Current GPS coordinates detected!'));
        setLocating(false);
      },
      (error) => {
        toast.warning(t('report.gpsError', 'Could not retrieve GPS coordinates. Please type the address manually.'));
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.info(t('report.authToSubmit', 'Please sign in or register to submit an official issue report.'));
      navigate('/login', { state: { from: { pathname: '/report' } } });
      return;
    }

    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      toast.error(t('report.fillRequired', 'Please complete all required fields.'));
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('category', formData.category);
      data.append('description', formData.description.trim());
      data.append('location', formData.location.trim());
      data.append('priority', formData.priority);

      if (imageFile) {
        data.append('image', imageFile);
      }

      const res = await api.createIssue(data);
      toast.success(t('report.successMessage', 'Your issue has been submitted successfully.'));
      navigate(`/issues/${res.issue?._id || res.issue?.issueId || ''}`);
    } catch (err) {
      toast.error(err.message || 'Failed to submit issue report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = CATEGORIES.map((cat) => ({
    value: cat,
    label: translateCategory(cat),
  }));

  const priorityOptions = PRIORITIES_DATA.map((p) => ({
    value: p.value,
    label: `${translatePriority(p.value)} - ${isNepali ? p.neSuffix : p.enSuffix}`,
  }));

  return (
    <div className="container main-content animate-fade-in">
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        {/* Breadcrumb / Title */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <FilePlus size={16} /> {t('report.badge', 'New Grievance Registration')}
          </div>
          <h1>{t('report.title', 'Report a Public Issue')}</h1>
          <p style={{ marginTop: '0.25rem' }}>
            {t('report.subtitle', 'Provide accurate details and photos to help municipal field crews quickly locate and resolve the issue.')}
          </p>
        </div>

        {!isAuthenticated && (
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={24} color="var(--primary-blue)" />
              <div>
                <div style={{ fontWeight: 700, color: 'var(--primary-navy)', fontSize: '0.925rem' }}>
                  {t('report.authRequiredTitle', 'Citizen Authentication Required')}
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  {t('report.authRequiredDesc', 'You will need to sign in so you can track resolution and receive status notifications.')}
                </div>
              </div>
            </div>
            <Link to="/login">
              <Button size="sm" variant="primary">
                {t('report.signInFirst', 'Sign In First')}
              </Button>
            </Link>
          </div>
        )}

        <div className="civic-card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <Input
              label={t('report.issueTitle', 'Issue Title')}
              name="title"
              placeholder={t('report.issueTitlePlaceholder', 'Large pothole near Lakeside road')}
              value={formData.title}
              onChange={handleChange}
              required
              hint={t('report.issueTitleHint', 'Keep the title brief, clear, and descriptive.')}
            />

            {/* Category and Priority Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              <Select
                label={t('report.category', 'Municipal Category')}
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={categoryOptions}
                required
                placeholder={null}
              />

              <Select
                label={t('report.priority', 'Priority Level')}
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                options={priorityOptions}
                required
                placeholder={null}
              />
            </div>

            {/* Description */}
            <TextArea
              label={t('report.description', 'Detailed Description')}
              name="description"
              placeholder={t('report.descriptionPlaceholder', 'Please describe the issue and provide any useful details.')}
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              hint={t('report.descriptionHint', 'Include all relevant context that helps municipal engineers evaluate the problem.')}
            />

            {/* Location with GPS Helper */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label className="form-label" htmlFor="location" style={{ marginBottom: 0 }}>
                  <span>{t('report.location', 'Location / Landmark Address')} <span className="required">*</span></span>
                </label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locating}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--primary-blue)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Navigation size={13} />
                  {locating ? t('report.detectingGps', 'Detecting GPS...') : t('report.detectGps', 'Use Current GPS')}
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="form-input"
                  placeholder={t('report.locationPlaceholder', 'Enter the location or landmark')}
                  value={formData.location}
                  onChange={handleChange}
                  required
                  style={{ paddingLeft: '2.5rem' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748B',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <MapPin size={18} />
                </div>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="form-group" style={{ marginTop: '1.25rem' }}>
              <label className="form-label">
                <span>{t('report.photoEvidence', 'Upload Evidence Photo (Optional)')}</span>
              </label>

              {!imagePreview ? (
                <label className="file-upload-zone" htmlFor="issueImage">
                  <input
                    type="file"
                    id="issueImage"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'var(--primary-blue-light)',
                      color: 'var(--primary-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <UploadCloud size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--primary-navy)', fontSize: '0.95rem' }}>
                      {t('report.photoUploadText', 'Click to upload photo or drag and drop')}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {t('report.photoUploadHint', 'Supports JPEG, PNG, WEBP up to 5MB')}
                    </div>
                  </div>
                </label>
              ) : (
                <div className="file-preview-wrapper" style={{ width: '100%' }}>
                  <img src={imagePreview} alt="Preview" className="file-preview-image" />
                  <button
                    type="button"
                    className="file-remove-btn"
                    onClick={removeImage}
                    title="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <ShieldCheck size={16} color="#10B981" />
                <span>{t('report.privacyAssurance', 'Verified submission under municipal records')}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
                  {t('report.cancel', 'Cancel')}
                </Button>
                <Button type="submit" variant="primary" size="lg" loading={loading} icon={CheckCircle}>
                  {loading ? t('report.submitting', 'Submitting Report...') : t('report.submitReport', 'Submit Official Report')}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
