import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import {
  GreetingHeader,
  RevenueCard,
  MiniBarChart,
} from '../../components/dashboard';
import { useAuth } from '../../hooks/useAuth';
import {
  mockDashboardData,
  formatRupiah,
  type DashboardData,
} from '../../lib/mockDashboardData';

/**
 * screens/dashboard/DashboardScreen.tsx — Dashboard Owner (Phase 4)
 *
 * Layar utama untuk pemilik car wash dengan ringkasan bisnis hari ini:
 * - Greeting dinamis (Pagi/Siang/Sore/Malam)
 * - Omzet hari ini (highlight) + total kendaraan
 * - Grafik mingguan (7 hari terakhir)
 * - Breakdown jenis kendaraan
 * - Layanan terlaris
 * - Quick stats: antrean aktif
 *
 * Data masih MOCKED (`mockDashboardData`). Saat backend siap, ganti
 * dengan fetch dari Supabase / API — komponen tetap sama.
 */

// Pendapatan kemarin untuk hitung trend (h-2 dari weeklyRevenue)
function getYesterdayRevenue(data: DashboardData): number {
  return data.weeklyRevenue[data.weeklyRevenue.length - 2]?.revenue ?? 0;
}

function sumWeekly(data: DashboardData): number {
  return data.weeklyRevenue.reduce((acc, p) => acc + p.revenue, 0);
}

export default function DashboardScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Simulasi refresh — di production akan re-fetch dari backend
  const [data] = useState<DashboardData>(mockDashboardData);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  }, []);

  const yesterdayRevenue = useMemo(() => getYesterdayRevenue(data), [data]);
  const weeklyTotal      = useMemo(() => sumWeekly(data), [data]);
  const maxVehicleCount  = useMemo(
    () => Math.max(...data.vehicleStats.map((v) => v.count), 1),
    [data]
  );

  return (
    <SafeAreaView
      className="flex-1 bg-slate-50"
      edges={['top']}
      testID="dashboard-screen"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
          />
        }
      >
        {/* ── Greeting ─────────────────────────────────────────── */}
        <GreetingHeader
          name={user?.full_name ?? 'Pengguna'}
          subtitle={t('dashboard.welcome_subtitle')}
        />

        <View className="px-5 -mt-6">
          {/* ── Omzet Hari Ini (Featured) ─────────────────────── */}
          <RevenueCard
            label={t('dashboard.revenue_today')}
            value={data.dailyRevenue}
            previous={yesterdayRevenue}
            featured
            testID="card-daily-revenue"
          />

          {/* ── Quick Stats Grid ──────────────────────────────── */}
          <View className="flex-row gap-3 mt-4">
            <View className="flex-1">
              <Card variant="outline" padding="md" testID="card-total-vehicles">
                <Text className="text-slate-500 text-xs font-medium">
                  {t('dashboard.total_vehicles')}
                </Text>
                <View className="flex-row items-end mt-1.5">
                  <Text className="text-slate-800 text-2xl font-bold">
                    {data.totalVehicles}
                  </Text>
                  <Text className="text-slate-400 text-xs ml-1.5 mb-1">
                    kendaraan
                  </Text>
                </View>
              </Card>
            </View>
            <View className="flex-1">
              <Card variant="outline" padding="md" testID="card-active-queue">
                <Text className="text-slate-500 text-xs font-medium">
                  {t('dashboard.active_queue')}
                </Text>
                <View className="flex-row items-end mt-1.5">
                  <Text className="text-slate-800 text-2xl font-bold">
                    {data.activeQueue}
                  </Text>
                  <Text className="text-slate-400 text-xs ml-1.5 mb-1">
                    antrean
                  </Text>
                </View>
              </Card>
            </View>
          </View>

          {/* ── Grafik Mingguan ───────────────────────────────── */}
          <Card padding="md" className="mt-4" testID="card-weekly-chart">
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1 pr-2">
                <Text className="text-slate-800 font-semibold text-base">
                  {t('dashboard.weekly_revenue')}
                </Text>
                <Text className="text-slate-400 text-xs mt-0.5">
                  Total {formatRupiah(weeklyTotal)}
                </Text>
              </View>
              <Badge variant="primary" size="sm">7 hari</Badge>
            </View>
            <MiniBarChart data={data.weeklyRevenue} height={130} />
          </Card>

          {/* ── Breakdown Jenis Kendaraan ─────────────────────── */}
          <Card padding="md" className="mt-4" testID="card-vehicle-breakdown">
            <Text className="text-slate-800 font-semibold text-base mb-3">
              {t('dashboard.by_vehicle_type')}
            </Text>
            {data.vehicleStats.map((stat) => {
              const ratio = stat.count / maxVehicleCount;
              return (
                <View
                  key={stat.type}
                  className="mb-3 last:mb-0"
                  testID={`vehicle-stat-${stat.type}`}
                >
                  <View className="flex-row justify-between mb-1.5">
                    <Text className="text-slate-700 text-sm font-medium">
                      {stat.label}
                    </Text>
                    <Text className="text-slate-500 text-sm">
                      {stat.count}
                    </Text>
                  </View>
                  <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${Math.max(ratio * 100, 4)}%` }}
                    />
                  </View>
                </View>
              );
            })}
          </Card>

          {/* ── Layanan Terlaris ──────────────────────────────── */}
          <Card
            padding="md"
            className="mt-4"
            testID="card-popular-service"
          >
            <View className="flex-row items-start justify-between mb-2">
              <Text className="text-slate-800 font-semibold text-base">
                {t('dashboard.popular_service')}
              </Text>
              <Badge variant="warning" size="sm" dot>Top</Badge>
            </View>
            <Text className="text-accent-600 text-xl font-bold mt-1">
              {data.popularService.name}
            </Text>
            <View className="flex-row mt-3">
              <View className="flex-1 pr-3 border-r border-slate-100">
                <Text className="text-slate-400 text-xs">Transaksi</Text>
                <Text className="text-slate-800 text-base font-semibold mt-0.5">
                  {data.popularService.count}×
                </Text>
              </View>
              <View className="flex-1 pl-3">
                <Text className="text-slate-400 text-xs">Pendapatan</Text>
                <Text className="text-slate-800 text-base font-semibold mt-0.5">
                  {formatRupiah(data.popularService.revenue)}
                </Text>
              </View>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
