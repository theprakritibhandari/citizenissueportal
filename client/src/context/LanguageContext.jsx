import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('portal_lang') || 'en';
  });

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'ne') {
      setLanguageState(lang);
      localStorage.setItem('portal_lang', lang);
      document.documentElement.lang = lang === 'ne' ? 'ne' : 'en';
    }
  };

  useEffect(() => {
    document.documentElement.lang = language === 'ne' ? 'ne' : 'en';
  }, [language]);

  // Translate by dot-notated key: e.g. t('nav.home', 'Home')
  const t = (path, defaultVal = '') => {
    if (!path) return defaultVal;
    const keys = path.split('.');
    let current = translations[language] || translations.en;

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English if missing in target language
        let fallback = translations.en;
        for (const fbKey of keys) {
          if (fallback && fallback[fbKey] !== undefined) {
            fallback = fallback[fbKey];
          } else {
            return defaultVal || path;
          }
        }
        return fallback;
      }
    }

    return typeof current === 'string' ? current : defaultVal || path;
  };

  const translateCategory = (cat) => {
    if (!cat) return '';
    return translations[language]?.categories?.[cat] || translations.en?.categories?.[cat] || cat;
  };

  const translateStatus = (status) => {
    if (!status) return '';
    return translations[language]?.statuses?.[status] || translations.en?.statuses?.[status] || status;
  };

  const translatePriority = (priority) => {
    if (!priority) return '';
    return translations[language]?.priorities?.[priority] || translations.en?.priorities?.[priority] || priority;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isNepali: language === 'ne',
        isEnglish: language === 'en',
        setLanguage,
        t,
        translateCategory,
        translateStatus,
        translatePriority,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
