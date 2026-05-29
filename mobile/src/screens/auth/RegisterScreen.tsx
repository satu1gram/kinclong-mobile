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
import { Card }        from '../../components/common/Card';
import { useAuthStore } from '../../store/authStore';
import {
  validateRegisterForm,
  hasErrors,
  type RegisterFormErrors,
} from '../../utils/validation';

/**
 * screens/auth/RegisterScreen.tsx — Halaman pendaftaran pemilik car wash baru
 *
 * Alur:
 * 1. User isi semua field form
 * 2. Validasi client-side (validateRegisterForm)
 * 3. Panggil authStore.signUp → authService.signUp → Supabase
 * 4a. Email verification required → tampilkan SuccessView
 * 4b. Auto-confirmed → RootNavigator redirect ke Main
 * 5. Error → tampilkan error banner
 */

type Props = AuthScreenProps<'Register'>;

interface FormState {
  carwashName:     string;
  fullName:        string;
  email:           string;
  phone:           string;
  password:        string;
  confirmPassword: string;
}

const INITIAL_FORM: FormState = {
  carwashName:     '',
  fullName:        '',
  email:           '',
  phone:           '',
  password:        '',
  confirmPassword: '',
};

export default function RegisterScreen({ navigation }: Props) {
  const { t }                                                          = useTranslation();
  const {
    isLoading, error, needsEmailVerification, signUp, signInWithGoogle, clearError,
  } = useAuthStore();

  const [form,   setForm]   = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<RegisterFormErrors>({});

  useEffect(() => () => { clearError(); }, []);

  // ── Handlers ────────────────────────────────────────────────────

  const updateField = (field: keyof FormState) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof RegisterFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (error) clearError();
  };

  const handleRegister = async () => {
    const formErrors = validateRegisterForm(form);
    if (hasErrors(formErrors)) {
      setErrors(formErrors);
      return;
    }

    await signUp({
      email:       form.email,
      password:    form.password,
      fullName:    form.fullName,
      carwashName: form.carwashName,
      phone:       form.phone || undefined,
    });
  };

  const handleGoogleSignUp = async () => {
    await signInWithGoogle();
  };

  // ── Email Verification Success View (tidak terpakai di mock — disiapkan untuk Supabase) ──
  if (needsEmailVerification) {
    return (
      <SafeAreaView className="flex-1 bg-white" testID="register-email-sent-view">
        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-green-100 rounded-full w-20 h-20 items-center justify-center mb-6">
            <Text className="text-green-600 text-4xl">✉</Text>
          </View>
          <TextHeading level="h3" className="text-center mb-3">
            Cek Inbox Anda!
          </TextHeading>
          <Text className="text-slate-500 text-sm text-center leading-6 mb-2">
            Kami telah mengirimkan email konfirmasi ke
          </Text>
          <Text className="text-primary-600 font-semibold text-center mb-6">
            {form.email}
          </Text>
          <Text className="text-slate-400 text-xs text-center mb-8 leading-5">
            Klik link di email tersebut untuk mengaktifkan akun Anda, lalu kembali dan masuk.
          </Text>
          <Button
            title="Kembali ke Halaman Masuk"
            onPress={() => navigation.navigate('Login')}
            fullWidth
            testID="register-back-to-login-button"
          />
        </View>
      </SafeAreaView>
    );
  }

  // ── Register Form ────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-white" testID="register-screen">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 pt-6 pb-10">
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="flex-row items-center -ml-1 mb-6"
              testID="register-back-button"
            >
              <Text className="text-primary-600 text-base">‹</Text>
              <Text className="text-primary-600 text-sm font-medium ml-1">
                {t('common.back')}
              </Text>
            </TouchableOpacity>

            <TextHeading level="h3" className="mb-1">{t('auth.register')}</TextHeading>
            <Text className="text-slate-500 text-sm mb-6">
              {t('auth.register_subtitle')}
            </Text>

            {/* Server Error Banner */}
            {error ? (
              <View
                className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 flex-row items-start"
                testID="register-error-banner"
              >
                <Text className="text-red-700 text-sm flex-1 leading-5">{error}</Text>
                <TouchableOpacity
                  onPress={clearError}
                  className="ml-2 mt-0.5"
                  testID="register-error-dismiss"
                >
                  <Text className="text-red-400 text-lg leading-none">×</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* ── Google OAuth Shortcut ──────────────────────────── */}
            <TouchableOpacity
              onPress={handleGoogleSignUp}
              disabled={isLoading}
              className={[
                'flex-row items-center justify-center',
                'border border-slate-200 rounded-xl py-3.5 bg-white mb-4',
                isLoading ? 'opacity-50' : 'active:bg-slate-50',
              ].join(' ')}
              testID="register-google-button"
            >
              <View className="w-5 h-5 mr-3 items-center justify-center">
                <Text className="text-lg font-bold" style={{ color: '#4285F4' }}>G</Text>
              </View>
              <Text className="text-slate-700 font-semibold text-base">
                Daftar dengan Google
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center mb-5">
              <View className="flex-1 h-px bg-slate-200" />
              <Text className="text-slate-400 text-xs mx-3">atau isi formulir</Text>
              <View className="flex-1 h-px bg-slate-200" />
            </View>

            {/* ── Informasi Car Wash ─────────────────────────── */}
            <Card variant="outline" padding="md" className="mb-4">
              <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Informasi Car Wash
              </Text>
              <Input
                label={t('auth.carwash_name')}
                placeholder="Contoh: Kinclong Car Wash Pusat"
                value={form.carwashName}
                onChangeText={updateField('carwashName')}
                error={errors.carwashName}
                required
                containerStyle={{ marginBottom: 0 }}
                testID="register-carwash-input"
              />
            </Card>

            {/* ── Data Pemilik ───────────────────────────────── */}
            <Card variant="outline" padding="md" className="mb-4">
              <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Data Pemilik
              </Text>
              <Input
                label={t('auth.full_name')}
                placeholder="Nama lengkap sesuai KTP"
                value={form.fullName}
                onChangeText={updateField('fullName')}
                error={errors.fullName}
                required
                testID="register-fullname-input"
              />
              <Input
                label={t('auth.email')}
                placeholder="email@contoh.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                value={form.email}
                onChangeText={updateField('email')}
                error={errors.email}
                required
                testID="register-email-input"
              />
              <Input
                label={t('auth.phone')}
                placeholder="08xxxxxxxxxx"
                keyboardType="phone-pad"
                autoComplete="tel"
                value={form.phone}
                onChangeText={updateField('phone')}
                containerStyle={{ marginBottom: 0 }}
                testID="register-phone-input"
              />
            </Card>

            {/* ── Kata Sandi ─────────────────────────────────── */}
            <Card variant="outline" padding="md" className="mb-6">
              <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Kata Sandi
              </Text>
              <Input
                label={t('auth.password')}
                placeholder="Minimal 8 karakter"
                isPassword
                autoComplete="new-password"
                value={form.password}
                onChangeText={updateField('password')}
                error={errors.password}
                hint="Gunakan kombinasi huruf, angka, dan simbol"
                required
                testID="register-password-input"
              />
              <Input
                label={t('auth.confirm_password')}
                placeholder="Ulangi kata sandi di atas"
                isPassword
                autoComplete="new-password"
                value={form.confirmPassword}
                onChangeText={updateField('confirmPassword')}
                error={errors.confirmPassword}
                required
                containerStyle={{ marginBottom: 0 }}
                testID="register-confirm-password-input"
              />
            </Card>

            {/* Submit */}
            <Button
              title={t('auth.register')}
              onPress={handleRegister}
              isLoading={isLoading}
              fullWidth
              size="lg"
              testID="register-submit-button"
            />

            {/* Login Link */}
            <View className="flex-row justify-center items-center mt-6">
              <Text className="text-slate-500 text-sm">{t('auth.have_account')} </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                testID="register-login-link"
              >
                <Text className="text-primary-600 text-sm font-semibold">
                  {t('auth.login')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
