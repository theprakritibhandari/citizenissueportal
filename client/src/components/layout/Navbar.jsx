import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Shield,
  PlusCircle,
  FileText,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Building2,
  Globe,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Check,
} from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const toast = useToast();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info(language === 'ne' ? 'तपाईं सफलतापूर्वक लग आउट हुनुभएको छ।' : 'You have logged out successfully.');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMenus = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
  };

  const handleSelectLanguage = (langCode) => {
    setLanguage(langCode);
    setLangDropdownOpen(false);
  };

  return (
    <>
      {/* Official Civic Topbar */}
      <div className="civic-topbar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div className="civic-topbar-badge">
            <Shield size={13} />
            <span>{t('topbar.officialBadge')}</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>{t('topbar.helpline')}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="portal-navbar">
        <div className="container navbar-container">
          {/* Logo */}
          <Link to="/" className="brand-logo" onClick={closeMenus}>
            <div className="brand-icon-box">
              <Building2 size={24} />
            </div>
            <div>
              <span className="brand-text-main">{t('topbar.portalName')}</span>
              <span className="brand-text-sub">{t('topbar.portalSubtitle')}</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
                {t('nav.home')}
              </NavLink>
            </li>
            <li>
              <NavLink to="/report" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <PlusCircle size={15} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} />
                {t('nav.reportIssue')}
              </NavLink>
            </li>
            {isAuthenticated && (
              <li>
                <NavLink to="/my-reports" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <FileText size={15} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} />
                  {t('nav.myReports')}
                </NavLink>
              </li>
            )}
            <li>
              <button
                type="button"
                className="nav-link"
                onClick={() => setAboutModalOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {t('nav.about')}
              </button>
            </li>
            <li>
              <button
                type="button"
                className="nav-link"
                onClick={() => setContactModalOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                {t('nav.contact')}
              </button>
            </li>
          </ul>

          {/* Actions: Language Switcher + User State */}
          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Language Switcher Selector */}
            <div className="nav-user-dropdown" style={{ position: 'relative' }}>
              <button
                type="button"
                className="nav-user-btn"
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setDropdownOpen(false);
                }}
                style={{
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  color: 'var(--primary-navy)',
                }}
                aria-label="Select Language"
              >
                <Globe size={15} color="var(--primary-blue)" />
                <span>{language === 'ne' ? 'नेपाली' : 'English'}</span>
                <ChevronDown size={13} color="#64748B" />
              </button>

              {langDropdownOpen && (
                <div
                  className="dropdown-menu"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    right: 0,
                    minWidth: '140px',
                    padding: '0.35rem',
                    backgroundColor: 'white',
                    boxShadow: 'var(--shadow-lg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    zIndex: 1000,
                  }}
                >
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => handleSelectLanguage('en')}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.85rem',
                      fontWeight: language === 'en' ? 700 : 500,
                      color: language === 'en' ? 'var(--primary-blue)' : 'var(--text-primary)',
                      borderRadius: 'var(--radius-sm)',
                      background: language === 'en' ? 'var(--primary-blue-light)' : 'transparent',
                    }}
                  >
                    <span>English</span>
                    {language === 'en' && <Check size={14} color="var(--primary-blue)" />}
                  </button>

                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => handleSelectLanguage('ne')}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.85rem',
                      fontWeight: language === 'ne' ? 700 : 500,
                      color: language === 'ne' ? 'var(--primary-blue)' : 'var(--text-primary)',
                      borderRadius: 'var(--radius-sm)',
                      background: language === 'ne' ? 'var(--primary-blue-light)' : 'transparent',
                    }}
                  >
                    <span>नेपाली</span>
                    {language === 'ne' && <Check size={14} color="var(--primary-blue)" />}
                  </button>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <div className="nav-user-dropdown">
                <button
                  className="nav-user-btn"
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setLangDropdownOpen(false);
                  }}
                  aria-expanded={dropdownOpen}
                >
                  <div className="nav-avatar">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="#64748B" />
                </button>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div style={{ fontWeight: 700, color: 'var(--primary-navy)', fontSize: '0.9rem' }}>
                        {user?.name}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                        {user?.email}
                      </div>
                      <div style={{ fontSize: '0.725rem', marginTop: '3px', textTransform: 'uppercase', color: 'var(--primary-blue)', fontWeight: 700 }}>
                        {t('nav.citizenAccount')}
                      </div>
                    </div>

                    <Link to="/profile" className="dropdown-item" onClick={closeMenus}>
                      <UserIcon size={16} />
                      {t('nav.profile')}
                    </Link>

                    <Link to="/my-reports" className="dropdown-item" onClick={closeMenus}>
                      <FileText size={16} />
                      {t('nav.myReports')}
                    </Link>

                    <div style={{ borderTop: '1px solid var(--border-light)', margin: '0.25rem 0' }} />

                    <button className="dropdown-item" onClick={handleLogout} style={{ color: '#DC2626' }}>
                      <LogOut size={16} />
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-auth-buttons" style={{ display: 'flex', gap: '0.6rem' }}>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {t('nav.signIn')}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Burger Button */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: 'white',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            {/* Mobile Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                {t('nav.language')}:
              </span>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => handleSelectLanguage('en')}
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: language === 'en' ? 'var(--primary-blue)' : '#CBD5E1',
                    background: language === 'en' ? 'var(--primary-blue)' : 'white',
                    color: language === 'en' ? 'white' : 'var(--text-primary)',
                    fontWeight: 600,
                  }}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectLanguage('ne')}
                  style={{
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: language === 'ne' ? 'var(--primary-blue)' : '#CBD5E1',
                    background: language === 'ne' ? 'var(--primary-blue)' : 'white',
                    color: language === 'ne' ? 'white' : 'var(--text-primary)',
                    fontWeight: 600,
                  }}
                >
                  नेपाली
                </button>
              </div>
            </div>

            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenus}
              end
            >
              {t('nav.home')}
            </NavLink>
            <NavLink
              to="/report"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMenus}
            >
              {t('nav.reportIssue')}
            </NavLink>
            <button
              type="button"
              className="nav-link"
              onClick={() => {
                closeMenus();
                setAboutModalOpen(true);
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
            >
              {t('nav.aboutPortal')}
            </button>
            <button
              type="button"
              className="nav-link"
              onClick={() => {
                closeMenus();
                setContactModalOpen(true);
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit' }}
            >
              {t('nav.civicContacts')}
            </button>
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/my-reports"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenus}
                >
                  {t('nav.myReports')}
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={closeMenus}
                >
                  {t('nav.profile')}
                </NavLink>
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.5rem' }}>
                  <Button variant="danger" size="sm" fullWidth onClick={handleLogout} icon={LogOut}>
                    {t('nav.logout')} ({user?.name})
                  </Button>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Link to="/login" onClick={closeMenus}>
                  <Button variant="outline" fullWidth size="md">
                    {t('nav.signIn')}
                  </Button>
                </Link>
                <Link to="/register" onClick={closeMenus}>
                  <Button variant="primary" fullWidth size="md">
                    {t('nav.register')}
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* About Modal */}
      <Modal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
        title={t('aboutModal.title')}
        maxWidth="580px"
        footer={
          <Button variant="primary" onClick={() => setAboutModalOpen(false)}>
            {t('aboutModal.closeBtn')}
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
          <p>{t('aboutModal.p1')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <CheckCircle2 size={18} color="var(--primary-blue)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span><strong>{t('aboutModal.point1Title')}</strong> {t('aboutModal.point1Desc')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <CheckCircle2 size={18} color="var(--primary-blue)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span><strong>{t('aboutModal.point2Title')}</strong> {t('aboutModal.point2Desc')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
              <CheckCircle2 size={18} color="var(--primary-blue)" style={{ marginTop: '2px', flexShrink: 0 }} />
              <span><strong>{t('aboutModal.point3Title')}</strong> {t('aboutModal.point3Desc')}</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* Contact Modal */}
      <Modal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title={t('contactModal.title')}
        maxWidth="560px"
        footer={
          <Button variant="primary" onClick={() => setContactModalOpen(false)}>
            {t('contactModal.closeBtn')}
          </Button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--primary-blue-light)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-focus)' }}>
            <div style={{ fontWeight: 700, color: 'var(--primary-navy)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <PhoneCall size={18} color="var(--primary-blue)" /> {t('contactModal.helplineTitle')}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-blue)' }}>
              {t('contactModal.helplineNumber')}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {t('contactModal.helplineSub')}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-primary)' }}>
              <Mail size={16} color="var(--primary-blue)" />
              <span><strong>{t('contactModal.emailLabel')}</strong> support@citizenportal.gov</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-primary)' }}>
              <Clock size={16} color="var(--primary-blue)" />
              <span><strong>{t('contactModal.hoursLabel')}</strong> {t('contactModal.hoursVal')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-primary)' }}>
              <MapPin size={16} color="var(--primary-blue)" />
              <span><strong>{t('contactModal.hqLabel')}</strong> {t('contactModal.hqVal')}</span>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
