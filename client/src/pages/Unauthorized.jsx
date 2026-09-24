import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import { useLanguage } from '../context/LanguageContext';

export const Unauthorized = () => {
  const navigate = useNavigate();
  const { isNepali } = useLanguage();

  return (
    <div className="container main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <EmptyState
        icon={ShieldAlert}
        title={isNepali ? '४०३ - प्रतिबन्धित नगरपालिका पहुँच' : '403 - Restricted Municipal Access'}
        description={
          isNepali
            ? 'तपाईंको खातासँग यो प्रशासनिक मोड्युलमा पहुँच गर्ने आवश्यक अधिकार छैन।'
            : 'Your user account does not possess authorized privileges to access this internal administrative module.'
        }
        actionLabel={isNepali ? 'गृहपृष्ठमा जानुहोस्' : 'Go to Home'}
        onAction={() => navigate('/')}
      />
    </div>
  );
};

export default Unauthorized;
