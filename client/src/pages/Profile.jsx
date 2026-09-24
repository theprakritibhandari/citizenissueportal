import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  PlusCircle,
} from 'lucide-react';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

export const Profile = () => {
  const { user } = useAuth();
  const { t, isNepali } = useLanguage();
  const [profileData, setProfileData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.getMe();
        if (res.success) {
          setProfileData(res.user);
          setStats(res.stats);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Loader message={t('profile.loading', 'Loading citizen profile...')} fullHeight />;
  }

  const currentUser = profileData || user;

  return (
    <div className="container main-content">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
            <User size={16} /> {t('profile.badge', 'Citizen Account')}
          </div>
          <h1>{t('profile.title', 'My Profile & Activity')}</h1>
          <p>{t('profile.subtitle', 'Review your personal citizen credentials and grievance resolution statistics.')}</p>
        </div>

        {/* Profile Card */}
        <div className="civic-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                backgroundColor: 'var(--primary-blue)',
                color: 'white',
                fontSize: '1.75rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 102, 204, 0.3)',
              }}
            >
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{currentUser?.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span className="badge badge-status-progress" style={{ textTransform: 'capitalize' }}>
                  {t('profile.role', 'Role:')} {currentUser?.role === 'citizen' ? t('profile.citizen', 'Citizen') : currentUser?.role}
                </span>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  {t('profile.memberSince', 'Member since')}{' '}
                  {new Date(currentUser?.createdAt || Date.now()).toLocaleDateString(isNepali ? 'ne-NP' : 'en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-light)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-navy)' }}>
                <Mail size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                  {t('profile.emailAddress', 'Email Address')}
                </span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--primary-navy)' }}>{currentUser?.email}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-navy)' }}>
                <Phone size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                  {t('profile.contactPhone', 'Contact Phone')}
                </span>
                <strong style={{ fontSize: '0.9rem', color: 'var(--primary-navy)' }}>
                  {currentUser?.phone || t('profile.notProvided', 'Not provided')}
                </strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-navy)' }}>
                <Shield size={18} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                  {t('profile.accountStatus', 'Account Status')}
                </span>
                <strong style={{ fontSize: '0.9rem', color: '#10B981' }}>
                  {t('profile.activeVerified', 'Active & Verified')}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Statistics */}
        <h3 style={{ marginBottom: '1rem', color: 'var(--primary-navy)' }}>
          {t('profile.statsTitle', 'My Grievance Redressal Stats')}
        </h3>

        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-tile">
            <div className="stat-tile-icon" style={{ backgroundColor: 'var(--primary-blue-light)', color: 'var(--primary-blue)' }}>
              <FileText size={22} />
            </div>
            <div>
              <div className="stat-tile-value">{stats?.totalSubmitted ?? 0}</div>
              <div className="stat-tile-label">{t('profile.totalSubmitted', 'Total Submitted')}</div>
            </div>
          </div>

          <div className="stat-tile">
            <div className="stat-tile-icon" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}>
              <CheckCircle2 size={22} />
            </div>
            <div>
              <div className="stat-tile-value">{stats?.resolved ?? 0}</div>
              <div className="stat-tile-label">{t('profile.resolvedIssues', 'Resolved Issues')}</div>
            </div>
          </div>

          <div className="stat-tile">
            <div className="stat-tile-icon" style={{ backgroundColor: '#FFFBEB', color: '#D97706' }}>
              <Clock size={22} />
            </div>
            <div>
              <div className="stat-tile-value">{stats?.pending ?? 0}</div>
              <div className="stat-tile-label">{t('profile.inProgressPending', 'In Progress / Pending')}</div>
            </div>
          </div>

          <div className="stat-tile">
            <div className="stat-tile-icon" style={{ backgroundColor: '#FEF2F2', color: '#DC2626' }}>
              <XCircle size={22} />
            </div>
            <div>
              <div className="stat-tile-value">{stats?.rejected ?? 0}</div>
              <div className="stat-tile-label">{t('profile.rejectedInvalid', 'Rejected / Invalid')}</div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/report">
            <Button variant="primary" icon={PlusCircle} size="lg">
              {t('profile.reportAnother', 'Report Another Issue')}
            </Button>
          </Link>
          <Link to="/my-reports">
            <Button variant="secondary" icon={FileText} size="lg">
              {t('profile.manageReports', 'Manage My Reports')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;
