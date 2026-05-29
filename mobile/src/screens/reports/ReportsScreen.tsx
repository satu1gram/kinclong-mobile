import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/common/Card';

/**
 * screens/reports/ReportsScreen.tsx
 *
 * Laporan bisnis car wash:
 * - Filter periode: harian / mingguan / bulanan / tahunan
 * - Statistik total pendapatan & antrean
 * - Breakdown per jenis kendaraan & layanan
 *
 * TODO Phase 2: Fetch aggregated data dari Supabase
 * TODO Phase 3: Grafik dengan Victory Native / Recharts
 */

type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

export default function ReportsScreen() {
  const { t } = useTranslation();
  const [activePeriod, setActivePeriod] = useState<Period>('daily');

  const periods: { key: Period; label: string }[] = [
    { key: 'daily',   label: t('reports.daily') },
    { key: 'weekly',  label: t('reports.weekly') },
    { key: 'monthly', label: t('reports.monthly') },
    { key: 'yearly',  label: t('reports.yearly') },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-white border-b border-slate-100 px-5 py-4">
        <Text className="text-xl font-bold text-slate-800">{t('reports.title')}</Text>
      </View>

      {/* Period Tabs */}
      <View className="flex-row bg-white border-b border-slate-100 px-5 pb-0">
        {periods.map((p) => (
          <TouchableOpacity
            key={p.key}
            onPress={() => setActivePeriod(p.key)}
            className={`mr-5 pb-3 pt-3 border-b-2 ${
              activePeriod === p.key ? 'border-blue-800' : 'border-transparent'
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                activePeriod === p.key ? 'text-blue-800' : 'text-slate-400'
              }`}
            >
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-5 pt-4">
        <Card padding="md" className="mb-3">
          <Text className="text-slate-500 text-sm">{t('reports.total_revenue')}</Text>
          <Text className="text-2xl font-bold text-slate-800 mt-1">Rp 0</Text>
        </Card>
        <Card padding="md" className="mb-3">
          <Text className="text-slate-500 text-sm">{t('reports.completed_queues')}</Text>
          <Text className="text-2xl font-bold text-slate-800 mt-1">0</Text>
        </Card>
        <View className="items-center py-10">
          <Text className="text-slate-400 text-sm">{t('reports.no_data')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
