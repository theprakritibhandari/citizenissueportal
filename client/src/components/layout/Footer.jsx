import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Building2, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  const { t, translateCategory } = useLanguage();

  return (
    <footer className="portal-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1 */}
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  background: 'var(--primary-blue)',
                  color: 'white',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Building2 size={20} />
              </div>
              <span style={{ fontWeight: 800, color: 'white', fontSize: '1.1rem' }}>
                {t('topbar.portalName')}
              </span>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              {t('footer.aboutText')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#CBD5E1' }}>
                <Phone size={14} color="var(--primary-blue)" /> {t('footer.helpline')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#CBD5E1' }}>
                <Mail size={14} color="var(--primary-blue)" /> {t('footer.email')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#CBD5E1' }}>
                <MapPin size={14} color="var(--primary-blue)" /> {t('footer.address')}
              </div>
            </div>
          </div>

          {/* Col 2 */}
          <div className="footer-col">
            <h4>{t('footer.quickLinksTitle')}</h4>
            <ul className="footer-links">
              <li><Link to="/">{t('footer.homeOverview')}</Link></li>
              <li><Link to="/report">{t('footer.reportNewIssue')}</Link></li>
              <li><Link to="/my-reports">{t('footer.trackComplaints')}</Link></li>
              <li><Link to="/login">{t('footer.citizenLogin')}</Link></li>
              <li><Link to="/register">{t('footer.createAccount')}</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="footer-col">
            <h4>{t('footer.categoriesTitle')}</h4>
            <ul className="footer-links">
              <li><Link to="/report?category=Road / Pothole">{translateCategory('Road / Pothole')}</Link></li>
              <li><Link to="/report?category=Street Light">{translateCategory('Street Light')}</Link></li>
              <li><Link to="/report?category=Garbage / Waste">{translateCategory('Garbage / Waste')}</Link></li>
              <li><Link to="/report?category=Water Supply">{translateCategory('Water Supply')}</Link></li>
              <li><Link to="/report?category=Drainage">{translateCategory('Drainage')}</Link></li>
              <li><Link to="/report?category=Traffic">{translateCategory('Traffic')}</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="footer-col">
            <h4>{t('footer.servicesTitle')}</h4>
            <ul className="footer-links">
              <li><Link to="/report">{t('footer.grievanceSubmission')}</Link></li>
              <li><Link to="/my-reports">{t('footer.statusTracker')}</Link></li>
              <li><Link to="/profile">{t('footer.profileHistory')}</Link></li>
              <li><Link to="/">{t('footer.wardCoverage')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} {t('footer.copyright')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>{t('footer.privacy')}</span>
            <span>•</span>
            <span>{t('footer.terms')}</span>
            <span>•</span>
            <span>{t('footer.accessibility')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
