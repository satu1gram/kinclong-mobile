import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

/**
 * navigation/types.ts - Type definitions untuk React Navigation
 *
 * Mendefinisikan parameter setiap screen untuk type-safe navigation.
 * Digunakan di semua navigator dan screen components.
 *
 * Pattern: setiap screen prop menggunakan alias tipe ini agar
 * navigation.navigate() dan route.params tervalidasi TypeScript.
 */

// ─── Auth Stack ───────────────────────────────────────────────────────────────
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// ─── Main Bottom Tabs ─────────────────────────────────────────────────────────
export type MainTabParamList = {
  Dashboard: undefined;
  Queue: undefined;
  Services: undefined;
  Reports: undefined;
  Settings: undefined;
};

// ─── Root Stack ───────────────────────────────────────────────────────────────
// RootNavigator memilih antara Auth atau Main berdasarkan session
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Kiosk: undefined;       // Mode kiosk tanpa bottom tab
  Subscription: undefined; // Modal/screen upgrade plan
};

// ─── Screen Props Helpers ─────────────────────────────────────────────────────
export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
