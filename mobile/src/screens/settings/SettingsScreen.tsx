import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../hooks/useI18n';

/**
 * screens/settings/SettingsScreen.tsx
 *
 * Pengaturan aplikasi:
 * - Kartu profil pengguna & role
 * - Toggle bahasa (ID ↔ EN)
 * - Menu: Profil, Tim, Outlet, Notifikasi, Keamanan, Tentang
 * - Tombol logout
 *
 * TODO Phase 2: Edit profil & upload avatar
 * TODO Phase 2: Manajemen tim (invite, role assign)
 */

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { switchLanguage, currentLanguage } = useI18n();

  const handleLogout = () => {
    Alert.alert(t('settings.logout'), t('settings.logout_confirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.yes'), onPress: signOut, style: 'destructive' },
    ]);
  };

  const menuItems = [
    { label: t('settings.profile'),       icon: '👤' },
    { label: t('settings.team'),          icon: '👥' },
    { label: t('settings.outlet'),        icon: '🏪' },
    { label: t('settings.notifications'), icon: '🔔' },
    { label: t('settings.security'),      icon: '🔒' },
    { label: t('settings.about'),         icon: 'ℹ️' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-white border-b border-slate-100 px-5 py-4">
        <Text className="text-xl font-bold text-slate-800">{t('settings.title')}</Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <Card padding="md" className="mb-4">
          <View className="flex-row items-center">
            <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-3">
              <Text className="text-blue-800 text-xl font-bold">
                {user?.full_name?.charAt(0)?.toUpperCase() ?? '?'}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-slate-800">{user?.full_name ?? '-'}</Text>
              <Text className="text-slate-500 text-sm">{user?.email ?? '-'}</Text>
              <View className="bg-blue-100 rounded-full px-2 py-0.5 mt-1 self-start">
                <Text className="text-blue-800 text-xs font-semibold capitalize">
                  {user?.role ?? '-'}
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Language Toggle */}
        <Card padding="md" className="mb-4">
          <Text className="font-semibold text-slate-700 mb-3">{t('settings.language')}</Text>
          <View className="flex-row gap-3">
            {(['id', 'en'] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                onPress={() => switchLanguage(lang)}
                className={`flex-1 items-center py-2.5 rounded-xl border-2 ${
                  currentLanguage === lang
                    ? 'bg-blue-800 border-blue-800'
                    : 'bg-white border-slate-200'
                }`}
              >
                <Text
                  className={`font-semibold text-sm ${
                    currentLanguage === lang ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  {t(`settings.language_options.${lang}`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* Menu List */}
        <Card padding="none" className="mb-4 overflow-hidden">
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              className={`flex-row items-center px-4 py-3.5 ${
                i < menuItems.length - 1 ? 'border-b border-slate-50' : ''
              }`}
            >
              <Text className="text-lg mr-3">{item.icon}</Text>
              <Text className="flex-1 text-slate-700">{item.label}</Text>
              <Text className="text-slate-300 text-lg">›</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center bg-red-50 border border-red-100 rounded-2xl px-4 py-3.5 mb-8"
        >
          <Text className="text-lg mr-3">🚪</Text>
          <Text className="text-red-600 font-semibold">{t('settings.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
