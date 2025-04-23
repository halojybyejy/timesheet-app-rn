import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './locales/en.json';
import zh from './locales/zh.json';

i18n
  .use(initReactI18next)
  .init({
    lng: 'en', // default to device locale
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
