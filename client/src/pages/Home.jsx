import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  FilePlus,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lightbulb,
  Trash2,
  Droplets,
  Activity,
  Building,
  Car,
  Layers,
  ArrowRight,
  ShieldCheck,
  Users,
  Award,
  MapPin,
} from 'lucide-react';
import Button from '../components/common/Button';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const CATEGORY_ICONS = {
  'Road / Pothole': { icon: AlertTriangle, color: '#D97706', bg: '#FEF3C7' },
  'Street Light': { icon: Lightbulb, color: '#2563EB', bg: '#EFF6FF' },
  'Garbage / Waste': { icon: Trash2, color: '#059669', bg: '#ECFDF5' },
  'Water Supply': { icon: Droplets, color: '#0284C7', bg: '#E0F2FE' },
  'Drainage': { icon: Activity, color: '#7C3AED', bg: '#EDE9FE' },
  'Public Infrastructure': { icon: Building, color: '#475569', bg: '#F1F5F9' },
  'Traffic': { icon: Car, color: '#DC2626', bg: '#FEF2F2' },
  'Other': { icon: Layers, color: '#0D9488', bg: '#F0FDFA' },
};

const CATEGORY_KEYS = [
  'Road / Pothole',
  'Street Light',
  'Garbage / Waste',
  'Water Supply',
  'Drainage',
  'Public Infrastructure',
  'Traffic',
  'Other',
];

export const Home = () => {
  const { t, translateCategory } = useLanguage();
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    inProgress: 0,
    citizens: 0,
  });
  const navigate = useNavigate();

  const WORKFLOW_STEPS = [
    {
      step: '1',
      title: t('home.step1Title'),
      icon: FilePlus,
      description: t('home.step1Desc'),
    },
    {
      step: '2',
      title: t('home.step2Title'),
      icon: Search,
      description: t('home.step2Desc'),
    },
    {
      step: '3',
      title: t('home.step3Title'),
      icon: Clock,
      description: t('home.step3Desc'),
    },
    {
      step: '4',
      title: t('home.step4Title'),
      icon: CheckCircle2,
      description: t('home.step4Desc'),
    },
  ];

  const WHY_USE_FEATURES = [
    {
      icon: ShieldCheck,
      title: t('home.why1Title'),
      description: t('home.why1Desc'),
    },
    {
      icon: Clock,
      title: t('home.why2Title'),
      description: t('home.why2Desc'),
    },
    {
      icon: MapPin,
      title: t('home.why3Title'),
      description: t('home.why3Desc'),
    },
    {
      icon: Users,
      title: t('home.why4Title'),
      description: t('home.why4Desc'),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const issuesRes = await api.getAllIssues({ limit: 6 });
        if (issuesRes.success) {
          setRecentIssues(issuesRes.issues);
          const totalCount = issuesRes.total || issuesRes.issues.length;
          const resolvedCount = issuesRes.issues.filter((i) => i.status === 'Resolved').length;
          const inProgressCount = issuesRes.issues.filter((i) => i.status === 'In Progress' || i.status === 'Under Review').length;

          setStats({
            total: totalCount,
            resolved: resolvedCount,
            inProgress: inProgressCount,
            citizens: Math.max(28, totalCount * 3),
          });
        }
      } catch (err) {
        console.error('[Home Error] Failed to fetch initial data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="animate-fade-in">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="hero-tag">
                <ShieldCheck size={16} />
                <span>{t('home.heroTag')}</span>
              </div>
              <h1 className="hero-title">
                {t('home.heroTitleLine1')}<br />
                <span>{t('home.heroTitleLine2')}</span>
              </h1>
              <p className="hero-description">
                {t('home.heroDescription')}
              </p>
              <div className="hero-actions">
                <Link to="/report">
                  <Button variant="primary" size="lg" icon={FilePlus}>
                    {t('home.reportIssueBtn')}
                  </Button>
                </Link>
                <Link to="/my-reports">
                  <Button
                    variant="secondary"
                    size="lg"
                    icon={Search}
                    style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                  >
                    {t('home.trackReportsBtn')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Quick Highlight Card */}
            <div className="hero-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="hero-card-header">
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--primary-blue-light)', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-navy)' }}>{t('home.highlightTitle')}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('home.highlightSubtitle')}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{t('home.highlightPoint1')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{t('home.highlightPoint2')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{t('home.highlightPoint3')}</span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{t('home.emergencyHelpline')}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-navy)' }}>1800-CITY-HELP</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Community Statistics Strip */}
      <div className="container stats-strip">
        <div className="stats-grid">
          <div className="stat-tile">
            <div className="stat-tile-icon" style={{ backgroundColor: 'var(--primary-blue-light)', color: 'var(--primary-blue)' }}>
              <FilePlus size={26} />
            </div>
            <div>
              <div className="stat-tile-value">{stats.total > 0 ? stats.total : '12+'}</div>
              <div className="stat-tile-label">{t('home.statTotalIssues')}</div>
            </div>
          </div>

          <div className="stat-tile">
            <div className="stat-tile-icon" style={{ backgroundColor: '#ECFDF5', color: '#059669' }}>
              <CheckCircle2 size={26} />
            </div>
            <div>
              <div className="stat-tile-value">{stats.resolved > 0 ? stats.resolved : '4+'}</div>
              <div className="stat-tile-label">{t('home.statResolvedIssues')}</div>
            </div>
          </div>

          <div className="stat-tile">
            <div className="stat-tile-icon" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
              <Clock size={26} />
            </div>
            <div>
              <div className="stat-tile-value">98.4%</div>
              <div className="stat-tile-label">{t('home.statReviewSLA')}</div>
            </div>
          </div>

          <div className="stat-tile">
            <div className="stat-tile-icon" style={{ backgroundColor: '#FFFBEB', color: '#D97706' }}>
              <Users size={26} />
            </div>
            <div>
              <div className="stat-tile-value">{stats.citizens > 0 ? `${stats.citizens}+` : '50+'}</div>
              <div className="stat-tile-label">{t('home.statActiveReporters')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. How It Works Section */}
      <section className="workflow-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{t('home.howItWorksTag')}</span>
            <h2>{t('home.howItWorksTitle')}</h2>
            <p>{t('home.howItWorksSubtitle')}</p>
          </div>

          <div className="workflow-steps-grid">
            {WORKFLOW_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="workflow-card">
                  <div className="workflow-step-badge">{step.step}</div>
                  <div className="workflow-icon">
                    <Icon size={28} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.875rem' }}>{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Issue Categories Grid */}
      <section style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{t('home.categoriesTag')}</span>
            <h2>{t('home.categoriesTitle')}</h2>
            <p>{t('home.categoriesSubtitle')}</p>
          </div>

          <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
            {CATEGORY_KEYS.map((catKey) => {
              const config = CATEGORY_ICONS[catKey] || CATEGORY_ICONS['Other'];
              const Icon = config.icon;
              const catName = translateCategory(catKey);

              return (
                <div
                  key={catKey}
                  className="category-card"
                  onClick={() => navigate(`/report?category=${encodeURIComponent(catKey)}`)}
                >
                  <div className="category-icon" style={{ backgroundColor: config.bg, color: config.color }}>
                    <Icon size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-navy)' }}>{catName}</h4>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.85rem' }}>
                    {t('home.reportNow')} <ArrowRight size={14} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Recent Issues Stream */}
      <section style={{ padding: '4rem 0', backgroundColor: 'white', borderTop: '1px solid var(--border-light)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-tag">{t('home.recentTag')}</span>
              <h2>{t('home.recentTitle')}</h2>
              <p>{t('home.recentSubtitle')}</p>
            </div>
            <Link to="/my-reports">
              <Button variant="outline" size="sm" icon={ArrowRight}>
                {t('home.viewMySubmissions')}
              </Button>
            </Link>
          </div>

          {loading ? (
            <Loader message="Fetching recent reports..." />
          ) : recentIssues.length === 0 ? (
            <EmptyState
              title={t('home.noReportsTitle')}
              description={t('home.noReportsDesc')}
              actionLabel={t('home.reportIssueBtn')}
              onAction={() => navigate('/report')}
            />
          ) : (
            <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
              {recentIssues.map((issue) => (
                <div key={issue._id} className="civic-card civic-card-interactive" onClick={() => navigate(`/issues/${issue._id}`)} style={{ cursor: 'pointer' }}>
                  <div className="civic-card-header">
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.85rem', color: 'var(--primary-navy)' }}>
                      {issue.issueId}
                    </span>
                    <StatusBadge status={issue.status} />
                  </div>

                  <div className="civic-card-body">
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <span className="badge badge-category">{translateCategory(issue.category)}</span>
                      <PriorityBadge priority={issue.priority} />
                    </div>

                    <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {issue.title}
                    </h4>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {issue.description}
                    </p>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <strong>{t('home.locationLabel')}</strong> {issue.location}
                    </div>
                  </div>

                  <div className="civic-card-footer">
                    <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                    <span style={{ color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {t('home.viewDetails')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Why Use This Portal Section */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{t('home.whyUseTag')}</span>
            <h2>{t('home.whyUseTitle')}</h2>
            <p>{t('home.whyUseSubtitle')}</p>
          </div>

          <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {WHY_USE_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="civic-card" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--primary-blue-light)',
                      color: 'var(--primary-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)' }}>{feat.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Call To Action (CTA) Banner */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--primary-navy)', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
          <h2 style={{ fontSize: '2rem', color: 'white', marginBottom: '1rem' }}>
            {t('home.ctaTitle')}
          </h2>
          <p style={{ color: '#CBD5E1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem' }}>
            {t('home.ctaSubtitle')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/report">
              <Button variant="primary" size="lg" icon={FilePlus}>
                {t('home.ctaReportBtn')}
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="secondary"
                size="lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
              >
                {t('home.ctaRegisterBtn')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
