import { ExpoConfig } from 'expo/config';

/**
 * app.config.ts - Konfigurasi Expo aplikasi Kinclong
 *
 * Menggunakan EXPO_PUBLIC_* prefix untuk environment variables
 * yang aman di-bundle ke dalam aplikasi.
 */
const config: ExpoConfig = {
  name: 'Kinclong',
  slug: 'kinclong',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  splash: {
    resizeMode: 'contain',
    backgroundColor: '#1e40af',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.kinclong.app',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#1e40af',
    },
    package: 'com.kinclong.app',
  },
  web: {
    bundler: 'metro',
  },
  plugins: ['expo-font', 'expo-splash-screen'],
  extra: {
    // Diakses melalui Constants.expoConfig?.extra (opsional)
    appVersion: '1.0.0',
  },
};

export default config;
