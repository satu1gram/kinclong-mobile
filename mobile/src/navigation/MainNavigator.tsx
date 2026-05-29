import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from './types';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import QueueScreen from '../screens/queue/QueueScreen';
import ServicesScreen from '../screens/services/ServicesScreen';
import ReportsScreen from '../screens/reports/ReportsScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

/**
 * navigation/MainNavigator.tsx - Bottom Tab Navigator utama
 *
 * Tab navigasi untuk pengguna terautentikasi.
 * Mendukung multi-role: pada fase berikutnya, visibilitas tab
 * akan disesuaikan berdasarkan role (owner/operator/kiosk_user).
 *
 * Tabs:
 * - Dashboard  : Ringkasan bisnis harian (owner/operator)
 * - Queue      : Manajemen antrean real-time (semua role)
 * - Services   : Kelola layanan & harga (owner)
 * - Reports    : Laporan bisnis (owner)
 * - Settings   : Profil, bahasa, tim, logout
 *
 * TODO Phase 2: Tambahkan icons dengan lucide-react-native
 * TODO Phase 2: Role-based tab visibility
 */

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1e40af',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: 'Dashboard' }}
      />
      <Tab.Screen
        name="Queue"
        component={QueueScreen}
        options={{ tabBarLabel: 'Antrean' }}
      />
      <Tab.Screen
        name="Services"
        component={ServicesScreen}
        options={{ tabBarLabel: 'Layanan' }}
      />
      <Tab.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ tabBarLabel: 'Laporan' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: 'Pengaturan' }}
      />
    </Tab.Navigator>
  );
}
