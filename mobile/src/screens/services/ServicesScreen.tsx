import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/common/Button';

/**
 * screens/services/ServicesScreen.tsx
 *
 * Manajemen layanan & harga:
 * - List layanan aktif/nonaktif
 * - CRUD layanan (tambah/edit/hapus)
 * - Toggle aktif/nonaktif
 *
 * TODO Phase 2: Fetch & CRUD dari Supabase
 * TODO Phase 3: Harga per jenis kendaraan
 */

export default function ServicesScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-white border-b border-slate-100 px-5 py-4 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-slate-800">{t('services.title')}</Text>
        <Button title={t('services.add_service')} size="sm" onPress={() => {}} />
      </View>

      <ScrollView className="flex-1 px-5 pt-4">
        <View className="items-center justify-center py-20">
          <Text className="text-5xl mb-3">✨</Text>
          <Text className="text-slate-600 font-medium">{t('services.no_services')}</Text>
          <Text className="text-slate-400 text-sm mt-1">{t('services.add_first')}</Text>
          <Button
            title={t('services.add_service')}
            onPress={() => {}}
            className="mt-5"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
