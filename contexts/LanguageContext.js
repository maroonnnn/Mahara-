import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Initialize with 'en' to match server-side rendering
  // Only update after mount to prevent hydration mismatch
  const [language, setLanguage] = useState('en');
  const [isRTL, setIsRTL] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize language from localStorage only on client after mount
  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem('language') || 'en';
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

  const value = {
    language,
    isRTL,
    changeLanguage,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

