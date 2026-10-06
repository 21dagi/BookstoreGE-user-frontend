import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { STORAGE_KEYS } from '@/shared/constants';
import { safeStorage } from '@/shared/lib';
import { telegramAdapter } from '@/shared/telegram';
import amTranslations from './resources/am.json';
import enTranslations from './resources/en.json';

const savedLang = safeStorage.getItem(STORAGE_KEYS.LANGUAGE);
const telegramLang = telegramAdapter.getUser()?.language_code?.toLowerCase().startsWith('en')
  ? 'en'
  : 'am';
const defaultLang = savedLang || telegramLang || 'am';

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
