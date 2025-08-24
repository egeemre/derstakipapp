import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { en } from './en';
import { tr } from './tr';
import { de } from './de';
import { es } from './es';
import { it } from './it';
import { ru } from './ru';
import { zh } from './zh';

const LanguageContext = createContext();

const languages = {
  en,
  tr,
  de,
  es,
  it,
  ru,
  zh,
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  const [hydrated, setHydrated] = useState(false);

  // Load saved language on app start
  useEffect(() => {
    (async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('@language');
        if (savedLanguage && languages[savedLanguage]) {
          setLanguage(savedLanguage);
        }
      } catch (e) {
        // ignore
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Save language when it changes
  useEffect(() => {
    if (hydrated) {
      AsyncStorage.setItem('@language', language).catch(() => {});
    }
  }, [language, hydrated]);

  const t = languages[language] || languages.en;

  const changeLanguage = (newLanguage) => {
    if (languages[newLanguage]) {
      setLanguage(newLanguage);
    }
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
    hydrated,
  };

  if (!hydrated) return null;

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};