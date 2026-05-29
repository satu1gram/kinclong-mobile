import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import id from './locales/id.json';
import en from './locales/en.json';

/**
 * i18n/i18n.config.ts - Konfigurasi internasionalisasi (i18next)
 *
 * Mendukung:
 * - 🇮🇩 Bahasa Indonesia (default/fallback)
 * - 🇺🇸 English
 *
 * Cara pakai di komponen:
 *   const { t } = useTranslation();
 *   t('auth.login')  → "Masuk" (ID) | "Login" (EN)
 *
 * Cara ganti bahasa:
 *   i18n.changeLanguage('en');
 *   i18n.changeLanguage('id');
 *
 * Tipe-safe: resources disimpan sebagai const untuk autocomplete.
 */

export const defaultNS = 'translation';
export const resources = {
  id: { translation: id },
  en: { translation: en },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: 'id',           // Default: Bahasa Indonesia
  fallbackLng: 'en',   // Fallback ke English jika key tidak ada
  ns: ['translation'],
  defaultNS,
  interpolation: {
    escapeValue: false, // React Native aman dari XSS
  },
  react: {
    useSuspense: false, // Nonaktifkan suspense untuk React Native
  },
});

export default i18n;
