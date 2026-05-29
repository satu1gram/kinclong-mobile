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
import type { AuthScreenProps } from '../../navigation/types';
import { Button }      from '../../components/common/Button';
import { Input }       from '../../components/common/Input';
import { TextHeading } from '../../components/common/TextHeading';
import { useAuthStore } from '../../store/authStore';
import { validateEmail } from '../../utils/validation';

/**
 * screens/auth/ForgotPasswordScreen.tsx — Reset kata sandi via email
 *
 * Alur:
 * 1. User masukkan email
 * 2. Validasi format email client-side
 * 3. Panggil authStore.resetPassword → authService → Supabase
 * 4. Berhasil → tampilkan SuccessView (emailSent = true)
 * 5. Gagal → tampilkan error banner
 *
 * Supabase akan kirim email dengan link reset ke URL yang
 * dikonfigurasi di Supabase Dashboard → Auth → URL Configuration.
 */

type Props = AuthScreenProps<'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const { isLoading, error, resetPassword, clearError } = useAuthStore();

  const [email,     setEmail]     = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => () => { clearError(); }, []);

  // ── Handlers ────────────────────────────────────────────────────

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (emailError) setEmailError(null);
    if (error)      clearError();
  };

  const handleReset = async () => {
    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }

    const success = await resetPassword(email);
    if (success) {
      setEmailSent(true);
    }
  };

  // ── Success View ────────────────────────────────────────────────
  if (emailSent) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-8">
          <View className="bg-green-100 rounded-full w-20 h-20 items-center justify-center mb-6">
            <Text className="text-green-600 text-3xl">✓</Text>
          </View>
          <TextHeading level="h3" className="text-center mb-3">
            Email Terkirim!
          </TextHeading>
          <Text className="text-slate-500 text-sm text-center leading-6 mb-2">
            Link reset kata sandi telah dikirim ke
          </Text>
          <Text className="text-primary-600 font-semibold text-center mb-2">
            {email}
          </Text>
          <Text className="text-slate-400 text-xs text-center mb-8 leading-5">
            Cek folder inbox atau spam. Link berlaku selama 1 jam.
          </Text>
          <Button
            title="Kembali ke Halaman Masuk"
            onPress={() => navigation.navigate('Login')}
            fullWidth
          />
          <TouchableOpacity
            onPress={() => { setEmailSent(false); setEmail(''); }}
            className="mt-4"
          >
            <Text className="text-slate-400 text-sm">Kirim ulang email</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Form View ───────────────────────────────────────────────────
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-6 pt-6 pb-8">
            {/* Back Button */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="flex-row items-center -ml-1 mb-8"
            >
              <Text className="text-primary-600 text-base">‹</Text>
              <Text className="text-primary-600 text-sm font-medium ml-1">Kembali</Text>
            </TouchableOpacity>

            {/* Icon */}
            <View className="bg-primary-50 rounded-2xl w-14 h-14 items-center justify-center mb-5">
              <Text className="text-2xl">🔑</Text>
            </View>

            <TextHeading level="h3" className="mb-2">Lupa Kata Sandi?</TextHeading>
            <Text className="text-slate-500 text-sm leading-6 mb-7">
              Masukkan alamat email yang terdaftar. Kami akan mengirimkan link untuk
              membuat kata sandi baru.
            </Text>

            {/* Server Error Banner */}
            {error ? (
              <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5 flex-row items-start">
                <Text className="text-red-700 text-sm flex-1 leading-5">{error}</Text>
                <TouchableOpacity onPress={clearError} className="ml-2 mt-0.5">
                  <Text className="text-red-400 text-lg leading-none">×</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {/* Email Input */}
            <Input
              label="Alamat Email"
              placeholder="nama@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              value={email}
              onChangeText={handleEmailChange}
              error={emailError ?? undefined}
              required
            />

            {/* Submit */}
            <Button
              title="Kirim Link Reset"
              onPress={handleReset}
              isLoading={isLoading}
              fullWidth
              size="lg"
              className="mt-2"
            />

            {/* Back to Login */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              className="items-center mt-5"
            >
              <Text className="text-slate-400 text-sm">
                Ingat kata sandi?{' '}
                <Text className="text-primary-600 font-semibold">Masuk</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
