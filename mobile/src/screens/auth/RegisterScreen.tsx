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

/**
 * screens/auth/RegisterScreen.tsx
 *
 * Halaman pendaftaran pemilik car wash baru.
 * Membuat akun + profil outlet via Supabase (implementasi Phase 2).
 */

type Props = AuthScreenProps<'Register'>;

interface RegisterForm {
  carwashName: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<RegisterForm>({
    carwashName: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const updateField = (field: keyof RegisterForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleRegister = async () => {
    const { carwashName, fullName, email, password, confirmPassword } = form;
    if (!carwashName || !fullName || !email || !password) {
      Alert.alert(t('common.error'), 'Semua field wajib diisi');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), 'Kata sandi tidak cocok');
      return;
    }
    if (password.length < 8) {
      Alert.alert(t('common.error'), 'Kata sandi minimal 8 karakter');
      return;
    }
    // TODO Phase 2: supabase.auth.signUp + insert ke tabel users & carwashes
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
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
          <View className="px-6 pt-6 pb-8">
            <Button
              title={t('common.back')}
              variant="ghost"
              size="sm"
              onPress={() => navigation.goBack()}
              className="self-start mb-4 -ml-2"
            />

            <Text className="text-2xl font-bold text-slate-800 mb-1">
              {t('auth.register')}
            </Text>
            <Text className="text-slate-500 mb-6">{t('auth.register_subtitle')}</Text>

            <Input
              label={t('auth.carwash_name')}
              placeholder="Contoh: Kinclong Car Wash"
              value={form.carwashName}
              onChangeText={updateField('carwashName')}
              required
            />
            <Input
              label={t('auth.full_name')}
              placeholder="Nama lengkap pemilik"
              value={form.fullName}
              onChangeText={updateField('fullName')}
              required
            />
            <Input
              label={t('auth.email')}
              placeholder="contoh@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={form.email}
              onChangeText={updateField('email')}
              required
            />
            <Input
              label={t('auth.phone')}
              placeholder="08xxxxxxxxxx"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={updateField('phone')}
            />
            <Input
              label={t('auth.password')}
              placeholder="Minimal 8 karakter"
              isPassword
              value={form.password}
              onChangeText={updateField('password')}
              required
            />
            <Input
              label={t('auth.confirm_password')}
              placeholder="Ulangi kata sandi"
              isPassword
              value={form.confirmPassword}
              onChangeText={updateField('confirmPassword')}
              required
            />

            <Button
              title={t('auth.register')}
              onPress={handleRegister}
              isLoading={isLoading}
              className="mt-2"
            />

            <View className="flex-row justify-center mt-6">
              <Text className="text-slate-500">{t('auth.have_account')} </Text>
              <Text
                className="text-blue-800 font-semibold"
                onPress={() => navigation.goBack()}
              >
                {t('auth.login')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
