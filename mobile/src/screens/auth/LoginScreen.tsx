import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { AuthScreenProps } from '../../navigation/types';
import { Button }      from '../../components/common/Button';
import { Input }       from '../../components/common/Input';
import { TextHeading } from '../../components/common/TextHeading';
import { useAuthStore } from '../../store/authStore';
import {
  validateLoginForm,
  hasErrors,
  type LoginFormErrors,
} from '../../utils/validation';

/**
 * screens/auth/LoginScreen.tsx — Halaman masuk pengguna
 *
 * Alur:
 * 1. User isi email + password (atau klik Google OAuth)
 * 2. Validasi client-side (validateLoginForm)
 * 3. Panggil authStore.signIn → authService (mock)
 * 4. Berhasil → listener SIGNED_IN → RootNavigator redirect ke Main
 * 5. Gagal → tampilkan error banner + clear saat user mulai mengetik ulang
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
    <SafeAreaView className="flex-1 bg-white" testID="login-screen">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Brand Header ─────────────────────────────────────── */}
          <View className="bg-primary-500 items-center px-6 pt-14 pb-10">
            <View className="bg-white rounded-full w-16 h-16 items-center justify-center mb-3 shadow-md">
              <Text className="text-primary-500 text-2xl font-bold">K</Text>
            </View>
            <TextHeading level="h2" color="white">Kinclong</TextHeading>
            <Text className="text-primary-100 text-sm mt-1">
              Manajemen Car Wash Professional
            </Text>
          </View>

          {/* ── Form Area ────────────────────────────────────────── */}
          <View className="flex-1 px-6 pt-7 pb-8">
            <TextHeading level="h3" className="mb-1">Masuk ke Akun</TextHeading>
            <Text className="text-slate-500 text-sm mb-6">
              Selamat datang kembali
            </Text>

            {/* Server Error Banner */}
            {error ? (
              <View
                className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 flex-row items-start"
                testID="login-error-banner"
              >
                <Text className="text-red-700 text-sm flex-1 leading-5">{error}</Text>
                <TouchableOpacity
                  onPress={clearError}
                  className="ml-2 mt-0.5"
                  testID="login-error-dismiss"
                >
                  <Text className="text-red-400 text-lg leading-none">×</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Demo Hint */}
            <View className="bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 mb-5">
              <Text className="text-primary-700 text-xs font-semibold mb-0.5">
                Akun Demo
              </Text>
              <Text className="text-primary-600 text-xs leading-5">
                Email: demo@kinclong.id{'\n'}
                Kata Sandi: password123
              </Text>
            </View>

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
              testID="login-password-input"
            />

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              className="self-end -mt-2 mb-5"
              testID="login-forgot-password-link"
            >
              <Text className="text-primary-600 text-sm font-medium">
                {t('auth.forgot_password')}
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <Button
              title={t('auth.login')}
              onPress={handleLogin}
              isLoading={isLoading}
              fullWidth
              size="lg"
              testID="login-submit-button"
            />

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-slate-200" />
              <Text className="text-slate-400 text-xs mx-3">atau</Text>
              <View className="flex-1 h-px bg-slate-200" />
            </View>

            {/* Google OAuth Button */}
            <TouchableOpacity
              onPress={handleGoogleLogin}
              disabled={isLoading}
              className={[
                'flex-row items-center justify-center',
                'border border-slate-200 rounded-xl py-3.5 bg-white',
                isLoading ? 'opacity-50' : 'active:bg-slate-50',
              ].join(' ')}
              testID="login-google-button"
            >
              <View className="w-5 h-5 mr-3 items-center justify-center">
                <Text className="text-lg font-bold" style={{ color: '#4285F4' }}>G</Text>
              </View>
              <Text className="text-slate-700 font-semibold text-base">
                Masuk dengan Google
              </Text>
            </TouchableOpacity>

            {/* Register Link */}
            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-slate-500 text-sm">{t('auth.no_account')} </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Register')}
                testID="login-register-link"
              >
                <Text className="text-primary-600 text-sm font-semibold">
                  {t('auth.register')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
