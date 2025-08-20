import React, { createContext, useContext, useState } from 'react';
import { en } from './en';
import { tr } from './tr';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = language === 'en' ? en : tr;

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'tr' : 'en';
    changeLanguage(newLanguage);
  };

  const value = {
    language,
    t,
    changeLanguage,
    toggleLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};