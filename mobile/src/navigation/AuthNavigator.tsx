import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './types';
import LoginScreen         from '../screens/auth/LoginScreen';
import RegisterScreen      from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

/**
 * navigation/AuthNavigator.tsx — Stack navigator untuk alur autentikasi
 *
 * Tampil saat pengguna belum login (session = null).
 *
 * Screens:
 * - Login        : Masuk dengan email & password
 * - Register     : Daftar akun baru + buat outlet car wash
 * - ForgotPassword: Reset kata sandi via email
 *
 * Tidak ada header bawaan — setiap screen kelola sendiri
 * back button dan title-nya.
 */

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation:   'slide_from_right',
        contentStyle: { backgroundColor: '#ffffff' },
      }}
    >
      <Stack.Screen name="Login"          component={LoginScreen} />
      <Stack.Screen name="Register"       component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
