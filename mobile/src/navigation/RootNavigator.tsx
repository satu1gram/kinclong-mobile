import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import AuthNavigator       from './AuthNavigator';
import MainNavigator       from './MainNavigator';
import KioskScreen         from '../screens/kiosk/KioskScreen';
import SubscriptionScreen  from '../screens/subscription/SubscriptionScreen';
import VehicleDetailScreen from '../screens/vehicles/VehicleDetailScreen';
import Loading             from '../components/common/Loading';
import { useAuthStore }    from '../store/authStore';

/**
 * navigation/RootNavigator.tsx — Root navigator + Auth Guard
 *
 * Logika proteksi route:
 * 1. isInitialized = false → Loading screen (session belum dicek)
 * 2. user = null           → AuthNavigator (Login/Register/ForgotPassword)
 * 3. user != null          → MainNavigator + overlay screens
 *
 * Pengguna tidak bisa mengakses Main screens tanpa login.
 * Setelah signOut, `user` menjadi null → otomatis kembali ke Auth.
 */

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, isInitialized } = useAuthStore();

  // Tunggu hingga session Supabase selesai di-restore dari AsyncStorage
  if (!isInitialized) {
    return <Loading message="Memuat aplikasi..." />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // ── Authenticated: Main App ──────────────────────────────
        <>
          <Stack.Screen name="Main"         component={MainNavigator} />
          <Stack.Screen
            name="Kiosk"
            component={KioskScreen}
            options={{ animation: 'fade' }}
          />
          <Stack.Screen
            name="Subscription"
            component={SubscriptionScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen name="VehicleDetail" component={VehicleDetailScreen} />
        </>
      ) : (
        // ── Unauthenticated: Auth Flow ───────────────────────────
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
