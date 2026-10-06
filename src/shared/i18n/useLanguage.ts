import { useTranslation } from 'react-i18next';
import { STORAGE_KEYS } from '@/shared/constants';
import { safeStorage } from '@/shared/lib';
import { LanguageCode } from '@/shared/types';

export function useLanguage() {
  const { i18n, t } = useTranslation();
  const currentLanguage: LanguageCode = (i18n.language === 'en' ? 'en' : 'am') as LanguageCode;

  const changeLanguage = (lang: LanguageCode) => {
    i18n.changeLanguage(lang);
    safeStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  return {
    language: currentLanguage,
    isAmharic: currentLanguage === 'am',
    changeLanguage,
    t,
  };
}
