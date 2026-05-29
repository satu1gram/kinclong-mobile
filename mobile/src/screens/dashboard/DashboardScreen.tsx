import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';

/**
 * screens/dashboard/DashboardScreen.tsx
 *
 * Ringkasan bisnis harian:
 * - Kartu statistik: antrean, selesai, sedang dikerjakan, pendapatan
 * - Aktivitas terkini
 *
 * TODO Phase 2: Fetch data dari Supabase (real-time aggregation)
 * TODO Phase 3: Grafik pendapatan mingguan/bulanan
 */

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const stats = [
    { label: t('dashboard.total_queue'),   value: '0',    color: 'bg-blue-50 border-blue-200' },
    { label: t('dashboard.completed'),     value: '0',    color: 'bg-green-50 border-green-200' },
    { label: t('dashboard.in_progress'),   value: '0',    color: 'bg-amber-50 border-amber-200' },
    { label: t('dashboard.revenue_today'), value: 'Rp 0', color: 'bg-purple-50 border-purple-200' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-blue-800 px-5 pt-4 pb-8">
          <Text className="text-blue-200 text-sm">{t('dashboard.welcome')},</Text>
          <Text className="text-white text-xl font-bold mt-0.5">
            {user?.full_name ?? 'Pengguna'}
          </Text>
        </View>

        <View className="px-5 -mt-4">
          {/* Stats Grid */}
          <View className="flex-row flex-wrap gap-3 mb-4">
            {stats.map((stat, i) => (
              <Card key={i} className={`flex-1 min-w-[45%] border ${stat.color}`} padding="sm">
                <Text className="text-slate-500 text-xs">{stat.label}</Text>
                <Text className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</Text>
              </Card>
            ))}
          </View>

          {/* Recent Activity */}
          <Card padding="md" className="mb-4">
            <Text className="font-semibold text-slate-800 mb-3">
              {t('dashboard.recent_activity')}
            </Text>
            <Text className="text-slate-400 text-sm text-center py-4">
              {t('dashboard.no_activity')}
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
