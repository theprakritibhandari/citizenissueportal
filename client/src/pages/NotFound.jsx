import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import { useLanguage } from '../context/LanguageContext';

export const NotFound = () => {
  const navigate = useNavigate();
  const { isNepali } = useLanguage();

  return (
    <div className="container main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <EmptyState
        icon={FileQuestion}
        title={isNepali ? '४०४ - पृष्ठ फेला परेन' : '404 - Page Not Found'}
        description={
          isNepali
            ? 'तपाईंले खोज्नुभएको पोर्टल पृष्ठ वा स्रोत अवस्थित छैन वा सारिएको छ।'
            : 'The portal page or resource you are searching for does not exist or has been relocated.'
        }
        actionLabel={isNepali ? 'गृहपृष्ठमा फर्कनुहोस्' : 'Return to Home'}
        onAction={() => navigate('/')}
      />
    </div>
  );
};

export default NotFound;
