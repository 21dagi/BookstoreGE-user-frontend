import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { STORAGE_KEYS } from '@/shared/constants';
import { safeStorage } from '@/shared/lib';
import amTranslations from './resources/am.json';
import enTranslations from './resources/en.json';

const savedLang = safeStorage.getItem(STORAGE_KEYS.LANGUAGE);
const defaultLang = savedLang === 'en' ? 'en' : 'am';

// Update html lang attribute
if (typeof document !== 'undefined') {
  document.documentElement.lang = defaultLang;
}

i18n.use(initReactI18next).init({
  resources: {
    am: { translation: amTranslations },
    en: { translation: enTranslations },
  },
  lng: defaultLang,
  fallbackLng: 'am',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
