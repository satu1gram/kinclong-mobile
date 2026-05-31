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
  validateRegisterForm,
  hasErrors,
  type RegisterFormErrors,
} from '../../utils/validation';

/**
 * screens/auth/RegisterScreen.tsx — Halaman pendaftaran pemilik car wash baru
 *
 * Mengikuti spesifikasi desain Kinclong Design System:
 * - Layout: Scrollable dengan padding 0 22px
 * - Background: DS.ink50 (#f8fafc)
 * - Kelompok Form: Informasi Car Wash, Data Pemilik, Kata Sandi dalam Elevated Cards
 * - Input Fields: Dilengkapi leftIcon (building, user, mail, phone, lock)
 * - Check Email Screen (needsEmailVerification): Centered vertikal dengan 3 numbered steps DS.blueMid
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
    isLoading, error, needsEmailVerification, signUp, clearError,
  } = useAuthStore();

  const [form,   setForm]   = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<RegisterFormErrors>({});

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

  // ── Email Verification Success View (CheckEmailPage) ──
  if (needsEmailVerification) {
    return (
      <SafeAreaView className="flex-1 bg-slate-50" style={{ backgroundColor: '#f8fafc' }} testID="register-email-sent-view">
        <View className="flex-1 items-center justify-center px-[22px]">
          {/* Circular Mail Icon Container */}
          <View className="rounded-full w-20 h-20 items-center justify-center mb-6" style={{ backgroundColor: '#dbeafe' }}>
            <KIcon name="mail" size={36} color="#2563eb" />
          </View>
          
          <TextHeading level="h3" className="text-center mb-2 font-bold text-slate-800">
            Cek Inbox Anda!
          </TextHeading>
          
          <Text className="text-slate-500 text-sm text-center leading-6 mb-8">
            Kami telah mengirimkan email konfirmasi ke{'\n'}
            <Text className="text-primary-600 font-bold">{form.email}</Text>
          </Text>

          {/* 3 Numbered Steps with DS.blueMid Badges */}
          <View className="w-full gap-3 mb-8">
            <View className="flex-row items-center gap-3.5 bg-white p-4 rounded-xl border border-slate-100/50 shadow-sm">
              <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                <Text className="text-blue-600 font-bold text-sm">1</Text>
              </View>
              <Text className="text-slate-700 text-sm font-medium flex-1">Buka kotak masuk email Anda</Text>
            </View>
            <View className="flex-row items-center gap-3.5 bg-white p-4 rounded-xl border border-slate-100/50 shadow-sm">
              <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                <Text className="text-blue-600 font-bold text-sm">2</Text>
              </View>
              <Text className="text-slate-700 text-sm font-medium flex-1">Cari email verifikasi dari Kinclong</Text>
            </View>
            <View className="flex-row items-center gap-3.5 bg-white p-4 rounded-xl border border-slate-100/50 shadow-sm">
              <View className="w-8 h-8 rounded-full items-center justify-center" style={{ backgroundColor: '#dbeafe' }}>
                <Text className="text-blue-600 font-bold text-sm">3</Text>
              </View>
              <Text className="text-slate-700 text-sm font-medium flex-1">Klik tautan konfirmasi untuk verifikasi</Text>
            </View>
          </View>

          <Button
            title="Masuk ke Akun"
            onPress={() => navigation.navigate('Login')}
            fullWidth
            size="lg"
            testID="register-back-to-login-button"
          />

          {/* Resend email ghost button */}
          <TouchableOpacity
            onPress={() => {}}
            className="mt-4"
            testID="register-resend-email"
            activeOpacity={0.7}
          >
            <Text className="text-slate-400 text-sm font-bold">
              Kirim ulang email
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Register Form ────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-slate-50" style={{ backgroundColor: '#f8fafc' }} testID="register-screen">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-[22px] pt-4 pb-10">
            {/* Header: Back Button & Logo */}
            <View className="mb-6 relative justify-center items-center">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="absolute left-0 top-0 p-2 -ml-2"
                testID="register-back-button"
              >
                <KIcon name="chevron-left" size={24} color="#64748b" />
              </TouchableOpacity>
              
              <Image
                source={require('../../assets/logo-kinclong-nb.webp')}
                style={{ width: 140, height: 40 }}
                resizeMode="contain"
                testID="register-logo-image"
              />
            </View>

            {/* Title & Subtitle */}
            <View className="items-center mb-8">
              <TextHeading level="h2" className="text-slate-900 font-bold text-center">
                Buat akun baru
              </TextHeading>
              <Text className="text-slate-500 text-sm mt-1.5 text-center">
                Trial 14 hari gratis · Tanpa kartu kredit
              </Text>
            </View>

            {/* ── Informasi Car Wash ─────────────────────────── */}
            <Card variant="elevated" padding="md" className="mb-4 bg-white border border-slate-100/50 shadow-sm">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Informasi Car Wash
              </Text>
              <Input
                label={t('auth.carwash_name')}
                placeholder="Contoh: Kinclong Car Wash Pusat"
                value={form.carwashName}
                onChangeText={updateField('carwashName')}
                error={errors.carwashName}
                required
                leftIcon={<KIcon name="building" size={18} color="#94a3b8" />}
                containerStyle={{ marginBottom: 0 }}
                testID="register-carwash-input"
              />
            </Card>

            {/* ── Data Pemilik ───────────────────────────────── */}
            <Card variant="elevated" padding="md" className="mb-4 bg-white border border-slate-100/50 shadow-sm">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Data Pemilik
              </Text>
              <Input
                label={t('auth.full_name')}
                placeholder="Nama lengkap sesuai KTP"
                value={form.fullName}
                onChangeText={updateField('fullName')}
                error={errors.fullName}
                required
                leftIcon={<KIcon name="user" size={18} color="#94a3b8" />}
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
                leftIcon={<KIcon name="mail" size={18} color="#94a3b8" />}
                testID="register-email-input"
              />
              <Input
                label={t('auth.phone')}
                placeholder="08xxxxxxxxxx"
                keyboardType="phone-pad"
                autoComplete="tel"
                value={form.phone}
                onChangeText={updateField('phone')}
                leftIcon={<KIcon name="phone" size={18} color="#94a3b8" />}
                containerStyle={{ marginBottom: 0 }}
                testID="register-phone-input"
              />
            </Card>

            {/* ── Kata Sandi ─────────────────────────────────── */}
            <Card variant="elevated" padding="md" className="mb-6 bg-white border border-slate-100/50 shadow-sm">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
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
                leftIcon={<KIcon name="lock" size={18} color="#94a3b8" />}
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
                leftIcon={<KIcon name="lock" size={18} color="#94a3b8" />}
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

