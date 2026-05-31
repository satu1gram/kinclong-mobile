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
  owner: 'satulab',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './src/assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './src/assets/logo-kinclong-nb.png',
    resizeMode: 'contain',
    backgroundColor: '#f8fafc',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.kinclong.app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './src/assets/adaptive-icon.png',
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
    eas: {
      projectId: 'ed60866a-7f66-4bc3-9ec2-3353ed81c654',
    },
  },
};

export default config;
