import { useTranslation } from 'react-i18next';

/**
 * hooks/useI18n.ts - Custom hook untuk internasionalisasi
 *
 * Abstraksi atas react-i18next yang menambahkan:
 * - switchLanguage: ganti bahasa dengan mudah
 * - currentLanguage: bahasa aktif ('id' | 'en')
 * - Helper flags: isIndonesian, isEnglish
 *
 * Contoh penggunaan:
 *   const { t, switchLanguage, currentLanguage } = useI18n();
 *   t('auth.login');           // → "Masuk"
 *   switchLanguage('en');      // Ganti ke English
 */
export function useI18n() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language as 'id' | 'en';

  const switchLanguage = async (lang: 'id' | 'en') => {
    await i18n.changeLanguage(lang);
  };

  return {
    t,
    switchLanguage,
    currentLanguage,
    isIndonesian: currentLanguage === 'id',
    isEnglish: currentLanguage === 'en',
  };
}
