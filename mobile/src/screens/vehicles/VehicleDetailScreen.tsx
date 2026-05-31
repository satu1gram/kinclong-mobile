import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { getVehicleVisits, getVehicleList } from '../../lib/mockQueueData';
import KIcon from '../../components/common/KIcon';
import type { QueueItem, QueueStatus } from '../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'VehicleDetail'>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtIDR(n: number) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  return 'Rp ' + n.toLocaleString('id-ID');
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86_400_000);
  if (d < 1)   return 'hari ini';
  if (d === 1) return 'kemarin';
  if (d < 30)  return `${d} hari lalu`;
  if (d < 60)  return '1 bln lalu';
  return `${Math.floor(d / 30)} bln lalu`;
}

function daysAgo(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

const STATUS_META: Record<QueueStatus, { label: string; bg: string; text: string }> = {
  paid:        { label: 'Lunas',   bg: '#d1fae5', text: '#065f46' },
  done:        { label: 'Selesai', bg: '#dbeafe', text: '#1d4ed8' },
  in_progress: { label: 'Dicuci',  bg: '#ede9fe', text: '#5b21b6' },
  waiting:     { label: 'Antri',   bg: '#fef3c7', text: '#92400e' },
  cancelled:   { label: 'Batal',   bg: '#fee2e2', text: '#991b1b' },
};

// ─── Visit Card ───────────────────────────────────────────────────────────────

function VisitEntry({ item }: { item: QueueItem }) {
  const sm = STATUS_META[item.status];
  const serviceNames = item.services.map((s) => s.service_name).join(' + ');
  return (
    <View
      className="bg-white rounded-2xl px-4 py-3.5"
      style={{ borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#0f172a', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
    >
      {/* Top row: date + price */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-1.5">
          <KIcon name="calendar" size={13} color="#94a3b8" />
          <Text className="text-slate-700 font-semibold" style={{ fontSize: 13 }}>
            {fmtDate(item.updated_at)}
          </Text>
        </View>
        <Text className="text-slate-900 font-bold" style={{ fontSize: 15 }}>
          {fmtIDR(item.total_price)}
        </Text>
      </View>

      {/* Services */}
      <Text className="text-slate-500" style={{ fontSize: 13 }} numberOfLines={2}>
        {serviceNames}
      </Text>

      {/* Bottom row: status badge + time ago */}
      <View className="flex-row items-center justify-between mt-2.5">
        <View
          className="px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: sm.bg }}
        >
          <Text className="font-bold" style={{ fontSize: 11, color: sm.text }}>{sm.label}</Text>
        </View>
        <Text className="text-slate-400" style={{ fontSize: 11 }}>{timeAgo(item.updated_at)}</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

type DateFilter = 'all' | '30d' | '90d';

export default function VehicleDetailScreen({ route, navigation }: Props) {
  const { plate } = route.params;
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const allVisits = useMemo(() => getVehicleVisits(plate), [plate]);

  const vehicleMeta = useMemo(() => {
    const list = getVehicleList();
    return list.find((v) => v.plate === plate) ?? null;
  }, [plate]);

  const filtered = useMemo(() => {
    if (dateFilter === 'all') return allVisits;
    const cutoff = dateFilter === '30d' ? 30 : 90;
    return allVisits.filter((v) => daysAgo(v.updated_at) <= cutoff);
  }, [allVisits, dateFilter]);

  const totalSpent = useMemo(() => filtered.reduce((s, v) => s + v.total_price, 0), [filtered]);

  const firstVisitLabel = useMemo(() => {
    if (!vehicleMeta) return '—';
    return fmtDate(vehicleMeta.first_visit);
  }, [vehicleMeta]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#f8fafc' }} edges={['top']}>
      {/* Header */}
      <View className="bg-white border-b border-slate-100 px-4 pt-3 pb-4">
        <View className="flex-row items-center gap-3 mb-3">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-9 h-9 rounded-xl items-center justify-center"
            style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}
          >
            <KIcon name="chevron-left" size={18} color="#64748b" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">Detail Kendaraan</Text>
            <Text
              className="text-slate-900 font-bold mt-0.5"
              style={{ fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 1 }}
            >
              {plate}
            </Text>
          </View>
        </View>

        {/* Vehicle info row */}
        {vehicleMeta && (
          <View className="flex-row items-center gap-2 flex-wrap">
            {vehicleMeta.brand ? (
              <View className="px-2.5 py-1 rounded-lg" style={{ backgroundColor: '#f1f5f9' }}>
                <Text className="text-slate-600 font-semibold" style={{ fontSize: 12 }}>{vehicleMeta.brand}</Text>
              </View>
            ) : null}
            <View className="px-2.5 py-1 rounded-lg" style={{ backgroundColor: '#dbeafe' }}>
              <Text className="font-semibold" style={{ fontSize: 12, color: '#1d4ed8' }}>
                {vehicleMeta.vehicle_type.charAt(0).toUpperCase() + vehicleMeta.vehicle_type.slice(1)}
              </Text>
            </View>
            {vehicleMeta.customer_name ? (
              <View className="flex-row items-center gap-1">
                <KIcon name="user" size={13} color="#94a3b8" />
                <Text className="text-slate-500 font-medium" style={{ fontSize: 13 }}>{vehicleMeta.customer_name}</Text>
              </View>
            ) : null}
          </View>
        )}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 14, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats cards */}
        <View className="flex-row gap-2 mb-4">
          <View
            className="flex-1 rounded-2xl p-3 items-center"
            style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f5f9' }}
          >
            <View className="w-8 h-8 rounded-xl items-center justify-center mb-1.5" style={{ backgroundColor: '#eff6ff' }}>
              <KIcon name="clock" size={15} color="#2563eb" />
            </View>
            <Text className="text-slate-900 font-extrabold text-xl">{allVisits.length}</Text>
            <Text className="text-slate-400 font-bold uppercase tracking-wider text-center" style={{ fontSize: 10 }}>Kunjungan</Text>
          </View>
          <View
            className="flex-1 rounded-2xl p-3 items-center"
            style={{ backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0' }}
          >
            <View className="w-8 h-8 rounded-xl items-center justify-center mb-1.5" style={{ backgroundColor: '#dcfce7' }}>
              <KIcon name="cash" size={15} color="#16a34a" />
            </View>
            <Text className="font-extrabold" style={{ fontSize: 17, color: '#16a34a' }}>
              {fmtIDR(vehicleMeta?.total_spent ?? 0)}
            </Text>
            <Text className="font-bold uppercase tracking-wider" style={{ fontSize: 10, color: '#16a34a', opacity: 0.7 }}>Total</Text>
          </View>
          <View
            className="flex-1 rounded-2xl p-3 items-center"
            style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#f1f5f9' }}
          >
            <View className="w-8 h-8 rounded-xl items-center justify-center mb-1.5" style={{ backgroundColor: '#fef3c7' }}>
              <KIcon name="calendar" size={15} color="#d97706" />
            </View>
            <Text className="text-slate-900 font-extrabold text-sm text-center">{firstVisitLabel}</Text>
            <Text className="text-slate-400 font-bold uppercase tracking-wider text-center" style={{ fontSize: 10 }}>Pertama</Text>
          </View>
        </View>

        {/* Date filter */}
        <View className="bg-white rounded-2xl p-4 mb-4" style={{ borderWidth: 1, borderColor: '#f1f5f9' }}>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-slate-800 font-bold" style={{ fontSize: 14 }}>Riwayat Kunjungan</Text>
            <Text className="text-slate-400" style={{ fontSize: 12 }}>{filtered.length} entri · {fmtIDR(totalSpent)}</Text>
          </View>

          <View
            className="flex-row rounded-xl p-0.5"
            style={{ backgroundColor: '#f1f5f9' }}
          >
            {([
              { id: 'all', label: 'Semua' },
              { id: '30d', label: '30 Hari' },
              { id: '90d', label: '90 Hari' },
            ] as { id: DateFilter; label: string }[]).map((f) => (
              <TouchableOpacity
                key={f.id}
                onPress={() => setDateFilter(f.id)}
                className="flex-1 items-center py-1.5 rounded-xl"
                style={{
                  backgroundColor: dateFilter === f.id ? '#fff' : 'transparent',
                  shadowColor: dateFilter === f.id ? '#0f172a' : undefined,
                  shadowOffset: dateFilter === f.id ? { width: 0, height: 1 } : undefined,
                  shadowOpacity: dateFilter === f.id ? 0.08 : 0,
                  shadowRadius: dateFilter === f.id ? 4 : 0,
                  elevation: dateFilter === f.id ? 2 : 0,
                }}
              >
                <Text
                  className="font-bold"
                  style={{ fontSize: 12, color: dateFilter === f.id ? '#0f172a' : '#94a3b8' }}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Visit list */}
        {filtered.length === 0 ? (
          <View className="items-center py-12">
            <KIcon name="clock" size={28} color="#94a3b8" />
            <Text className="text-slate-700 font-bold text-sm mt-3">Belum ada kunjungan</Text>
            <Text className="text-slate-400 text-xs mt-1">dalam periode ini</Text>
          </View>
        ) : (
          <View className="gap-2">
            {filtered.map((item) => (
              <VisitEntry key={item.id} item={item} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
