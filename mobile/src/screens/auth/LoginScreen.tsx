import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { AuthScreenProps } from '../../navigation/types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuthStore } from '../../store/authStore';

/**
 * screens/auth/LoginScreen.tsx
 *
 * Halaman masuk pengguna menggunakan Supabase Auth.
 * Setelah login berhasil, onAuthStateChange di authStore
 * akan otomatis memuat profil & redirect ke MainNavigator.
 */

type Props = AuthScreenProps<'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { signIn, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('common.required'));
      return;
    }
    await signIn(email.trim().toLowerCase(), password);
    if (error) {
      Alert.alert(t('common.error'), error);
      clearError();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Header */}
          <View className="bg-blue-800 pt-16 pb-12 px-6 items-center">
            <Text className="text-white text-4xl font-bold tracking-tight">Kinclong</Text>
            <Text className="text-blue-200 text-sm mt-1">
              Manajemen Car Wash Professional
            </Text>
          </View>

          {/* Form */}
          <View className="px-6 pt-8 pb-6">
            <Text className="text-2xl font-bold text-slate-800 mb-1">
              {t('auth.login')}
            </Text>
            <Text className="text-slate-500 mb-6">Masuk untuk mengelola car wash Anda</Text>

            <Input
              label={t('auth.email')}
              placeholder="contoh@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              required
            />
            <Input
              label={t('auth.password')}
              placeholder="Kata sandi Anda"
              isPassword
              value={password}
              onChangeText={setPassword}
              required
            />

            <Button
              title={t('auth.login')}
              onPress={handleLogin}
              isLoading={isLoading}
              className="mt-2"
            />
            <Button
              title={t('auth.forgot_password')}
              variant="ghost"
              onPress={() => {}}
              className="mt-1"
            />

            <View className="flex-row justify-center mt-8">
              <Text className="text-slate-500">{t('auth.no_account')} </Text>
              <Text
                className="text-blue-800 font-semibold"
                onPress={() => navigation.navigate('Register')}
              >
                {t('auth.register')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
