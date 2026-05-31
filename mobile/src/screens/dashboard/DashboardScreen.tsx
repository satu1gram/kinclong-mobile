import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import KIcon from '../../components/common/KIcon';
import type { MainTabParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/authStore';
import { GreetingHeader, RevenueCard, MiniBarChart } from '../../components/dashboard';
import { mockDashboardData } from '../../lib/mockDashboardData';

type Range = 'today' | '7d' | '30d';

export default function DashboardScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { user } = useAuthStore();
  const [range, setRange] = useState<Range>('today');

  const userName = user?.full_name || 'Pengguna';
  const userSubtitle = user?.role === 'owner' ? 'Pemilik Carwash' : 'Operator Staff';

  return (
    <SafeAreaView testID="dashboard-screen" className="flex-1" style={{ backgroundColor: '#f8fafc' }} edges={['top']}>
      {/* Greeting Header */}
      <GreetingHeader name={userName} subtitle={userSubtitle} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 14, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Trial Banner */}
        <View
          className="rounded-2xl p-4 mb-4 flex-row items-center justify-between"
          style={{ backgroundColor: '#f59e0b' }}
        >
          <View>
            <View className="flex-row items-center gap-1.5 mb-0.5">
              <KIcon name="crown" size={13} color="#fff" />
              <Text className="text-white font-bold text-sm">Trial Pro · 9 hari tersisa</Text>
            </View>
            <Text className="text-white/75 text-xs mt-0.5">Upgrade untuk akses penuh tanpa batas</Text>
          </View>
          <TouchableOpacity
            className="px-3 py-1.5 rounded-xl"
            style={{ backgroundColor: '#fff' }}
          >
            <Text className="font-bold text-xs" style={{ color: '#f59e0b' }}>Upgrade</Text>
          </TouchableOpacity>
        </View>

        {/* Range Filter */}
        <View
          className="flex-row rounded-xl p-0.5 mb-4"
          style={{ backgroundColor: '#f1f5f9' }}
        >
          {([
            { id: 'today', label: 'Hari Ini' },
            { id: '7d',    label: '7 Hari'   },
            { id: '30d',   label: '30 Hari'  },
          ] as { id: Range; label: string }[]).map((r) => (
            <TouchableOpacity
              key={r.id}
              onPress={() => setRange(r.id)}
              className="flex-1 items-center py-2 rounded-xl"
              style={{
                backgroundColor: range === r.id ? '#fff' : 'transparent',
                shadowColor: range === r.id ? '#0f172a' : undefined,
                shadowOffset: range === r.id ? { width: 0, height: 1 } : undefined,
                shadowOpacity: range === r.id ? 0.08 : 0,
                shadowRadius: range === r.id ? 4 : 0,
                elevation: range === r.id ? 2 : 0,
              }}
            >
              <Text
                className="text-xs font-bold"
                style={{ color: range === r.id ? '#0f172a' : '#94a3b8' }}
              >
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Metrics Grid */}
        <View className="flex-row gap-3 mb-3">
          <View className="flex-1">
            <RevenueCard
              testID="card-daily-revenue"
              label="Omzet Hari Ini"
              value={1850000}
              previous={1650000}
              featured
            />
          </View>
        </View>

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <RevenueCard
              testID="card-total-vehicles"
              label="Total Kendaraan"
              value={12}
              previous={10}
            />
          </View>
          <View className="flex-1">
            <RevenueCard
              testID="card-active-queue"
              label="Antrian Aktif"
              value={4}
              previous={3}
            />
          </View>
        </View>

        {/* Weekly Chart */}
        <View testID="card-weekly-chart" className="mb-4">
          <MiniBarChart
            data={mockDashboardData.weeklyRevenue}
          />
        </View>

        {/* Vehicle Breakdown Card */}
        <View
          testID="card-vehicle-breakdown"
          className="bg-white rounded-2xl p-4 mb-4"
          style={{ borderWidth: 1, borderColor: '#f1f5f9' }}
        >
          <Text className="text-slate-800 font-bold text-sm mb-3">Statistik Kendaraan</Text>
          <View className="flex-row justify-between flex-wrap gap-2">
            <View testID="vehicle-stat-motor" className="items-center p-2 rounded-xl bg-slate-50 flex-1 min-w-[70px]">
              <Text className="text-slate-400 text-xs mb-1">Motor</Text>
              <Text className="text-slate-800 font-bold text-base">5</Text>
            </View>
            <View testID="vehicle-stat-mobil" className="items-center p-2 rounded-xl bg-slate-50 flex-1 min-w-[70px]">
              <Text className="text-slate-400 text-xs mb-1">Mobil</Text>
              <Text className="text-slate-800 font-bold text-base">7</Text>
            </View>
            <View testID="vehicle-stat-pickup" className="items-center p-2 rounded-xl bg-slate-50 flex-1 min-w-[70px]">
              <Text className="text-slate-400 text-xs mb-1">Pickup</Text>
              <Text className="text-slate-800 font-bold text-base">2</Text>
            </View>
            <View testID="vehicle-stat-bus" className="items-center p-2 rounded-xl bg-slate-50 flex-1 min-w-[70px]">
              <Text className="text-slate-400 text-xs mb-1">Bus</Text>
              <Text className="text-slate-800 font-bold text-base">0</Text>
            </View>
            <View testID="vehicle-stat-truk" className="items-center p-2 rounded-xl bg-slate-50 flex-1 min-w-[70px]">
              <Text className="text-slate-400 text-xs mb-1">Truk</Text>
              <Text className="text-slate-800 font-bold text-base">1</Text>
            </View>
          </View>
        </View>

        {/* Popular Service Card */}
        <View
          testID="card-popular-service"
          className="bg-white rounded-2xl p-4 mb-4"
          style={{ borderWidth: 1, borderColor: '#f1f5f9' }}
        >
          <Text className="text-slate-800 font-bold text-sm mb-3">Layanan Terpopuler</Text>
          <View className="flex-row justify-between items-center bg-blue-50/50 p-3 rounded-xl">
            <View>
              <Text className="text-slate-950 font-bold text-sm">Cuci Mobil Premium</Text>
              <Text className="text-slate-400 text-xs mt-0.5">Paling sering dipesan hari ini</Text>
            </View>
            <Text className="text-blue-600 font-extrabold text-base">8×</Text>
          </View>
        </View>

        {/* Navigation Link to Queue */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Queue')}
          className="flex-row items-center justify-center gap-2 bg-blue-600 rounded-2xl py-3.5"
        >
          <KIcon name="queue" size={15} color="#fff" />
          <Text className="text-white font-bold text-sm">Buka Antrian</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
