import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Initialize with 'ar' for Arabic (default)
  // Only update after mount to prevent hydration mismatch
  const [language, setLanguage] = useState('ar');
  const [isRTL, setIsRTL] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Initialize language from localStorage only on client after mount
  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem('language') || 'ar';
    setLanguage(savedLanguage);
    setIsRTL(savedLanguage === 'ar');
    
    // Update HTML dir attribute
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', savedLanguage === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', savedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setIsRTL(lang === 'ar');
    
    // Save to localStorage
    localStorage.setItem('language', lang);
    
    // Update HTML dir and lang attributes
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', lang);
    }
  };

  // Translation function
  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
      if (!value) return key; // Return key if translation not found
    }
    
    return value;
  };

  const value = {
    language,
    isRTL,
    changeLanguage,
    t, // Add translation function
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

