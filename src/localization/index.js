import { en } from './en';
import { tr } from './tr';

export const languages = {
  en,
  tr
};

export const getTranslation = (lang, key) => {
  return languages[lang]?.[key] || languages['en'][key] || key;
};