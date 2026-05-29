import 'react-native-url-polyfill/auto';
import './global.css';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import './src/i18n/i18n.config';
import { useAuthStore } from './src/store/authStore';

/**
 * App.tsx - Entry point utama aplikasi Kinclong
 *
 * Bertanggung jawab untuk:
 * - Import CSS global NativeWind
 * - Inisialisasi Supabase auth listener (via store)
 * - Setup providers: SafeAreaProvider, NavigationContainer
 * - Load konfigurasi i18n (side-effect import)
 * - Render RootNavigator yang mengelola alur auth vs main
 */
export default function App() {
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
