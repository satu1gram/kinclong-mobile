import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import KioskScreen from '../screens/kiosk/KioskScreen';
import SubscriptionScreen from '../screens/subscription/SubscriptionScreen';
import Loading from '../components/common/Loading';
import { useAuthStore } from '../store/authStore';

/**
 * navigation/RootNavigator.tsx - Navigator utama aplikasi Kinclong
 *
 * Mengelola alur navigasi berdasarkan status autentikasi Supabase:
 * - isLoading → Tampilkan Loading screen
 * - user == null → AuthNavigator (Login / Register)
 * - user != null → MainNavigator (Bottom Tabs) + modal screens
 *
 * Kiosk & Subscription dapat diakses sebagai overlay screen
 * di atas MainNavigator tanpa header.
 */

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return <Loading message="Memuat aplikasi..." />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
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
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
