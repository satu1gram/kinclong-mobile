import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import type { AuthScreenProps } from '../../navigation/types';
import { Button, Card, Input, TextHeading, KIcon } from '../../components/common';
import { useAuthStore } from '../../store/authStore';
import {
  validateLoginForm,
  hasErrors,
  type LoginFormErrors,
} from '../../utils/validation';

/**
 * screens/auth/LoginScreen.tsx — Halaman masuk pengguna
 *
 * Mengikuti spesifikasi desain Kinclong Design System:
 * - Layout: center vertikal, padding 0 22px
 * - Safe area: spacer height 52px di atas logo
 * - Brand Logo: Image asset logo-kinclong-nb.webp
 * - Card Wrapper: shadow elevated card
 * - Form: Email (Input + mail icon) + Password (Input + lock icon + toggle show)
 */

type Props = AuthScreenProps<'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { t }                                                = useTranslation();
  const {
    isLoading, error, signIn, signInWithGoogle, clearError,
  } = useAuthStore();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [errors,   setErrors]   = useState<LoginFormErrors>({});

  // Bersihkan server error saat screen di-unmount
  useEffect(() => () => { clearError(); }, []);

  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: error,
        visibilityTime: 3500,
      });
      clearError();
    }
  }, [error, clearError]);

  // ── Handlers ────────────────────────────────────────────────────

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
    if (error)        clearError();
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
    if (error)           clearError();
  };

  const handleLogin = async () => {
    const formErrors = validateLoginForm(email, password);
    if (hasErrors(formErrors)) {
      setErrors(formErrors);
      return;
    }
    await signIn(email, password);
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  // ── Render ──────────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-slate-50" style={{ backgroundColor: '#f8fafc' }} testID="login-screen">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Safe Area Spacer */}
          <View style={{ height: 52 }} />

          {/* ── Brand Header ─────────────────────────────────────── */}
          <View className="items-center px-[22px] pb-6">
            <Image
              source={require('../../assets/logo-kinclong-nb.webp')}
              style={{ width: 180, height: 50 }}
              resizeMode="contain"
              testID="login-logo-image"
            />
            <Text className="text-slate-400 text-sm mt-3">
              Masuk ke akun Anda
            </Text>
          </View>

          {/* ── Form Area ────────────────────────────────────────── */}
          <View className="px-[22px] py-4">
            <Card variant="elevated" padding="lg" className="bg-white border border-slate-100/50 shadow-lg">

              {/* Email */}
              <Input
                label={t('auth.email')}
                placeholder="nama@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                value={email}
                onChangeText={handleEmailChange}
                error={errors.email}
                required
                leftIcon={<KIcon name="mail" size={18} color="#94a3b8" />}
                testID="login-email-input"
              />

              {/* Password */}
              <Input
                label={t('auth.password')}
                placeholder="Masukkan kata sandi"
                isPassword
                autoComplete="current-password"
                value={password}
                onChangeText={handlePasswordChange}
                error={errors.password}
                required
                leftIcon={<KIcon name="lock" size={18} color="#94a3b8" />}
                testID="login-password-input"
              />

              {/* Space before button */}
              <View className="h-2" />

              {/* Submit Button */}
              <Button
                title={t('auth.login')}
                onPress={handleLogin}
                isLoading={isLoading}
                fullWidth
                size="lg"
                testID="login-submit-button"
              />

            </Card>

            {/* Register Link */}
            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-slate-500 text-sm">Belum punya akun? </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                testID="login-register-link"
              >
                <Text className="text-primary-600 text-sm font-bold">
                  Daftar gratis
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

