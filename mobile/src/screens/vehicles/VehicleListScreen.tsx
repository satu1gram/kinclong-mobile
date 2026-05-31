import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Platform,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../../navigation/types';
import { vehicleService } from '../../services/vehicleService';
import { authService } from '../../lib/authService';
import KIcon from '../../components/common/KIcon';
import type { VehicleSummary, VehicleType } from '../../types';

type Props = BottomTabScreenProps<MainTabParamList, 'Vehicles'>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtIDR(n: number) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  return 'Rp ' + n.toLocaleString('id-ID');
}

function timeAgo(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (d < 1)   return 'hari ini';
  if (d === 1) return 'kemarin';
  if (d < 30)  return `${d} hari lalu`;
  if (d < 60)  return '1 bln lalu';
  return `${Math.floor(d / 30)} bln lalu`;
}

const TYPE_BADGE: Record<VehicleType, { label: string; bg: string; text: string }> = {
  motor:  { label: 'S',  bg: '#ede9fe', text: '#5b21b6' },
  mobil:  { label: 'M',  bg: '#dbeafe', text: '#1d4ed8' },
  pickup: { label: 'L',  bg: '#d1fae5', text: '#065f46' },
  bus:    { label: 'XL', bg: '#fef3c7', text: '#92400e' },
  truk:   { label: 'XL', bg: '#fef3c7', text: '#92400e' },
};

const TYPE_LABEL: Record<VehicleType, string> = {
  motor: 'Motor', mobil: 'Mobil', pickup: 'Pickup/SUV', bus: 'Bus', truk: 'Truk',
};

// ─── Vehicle Card ─────────────────────────────────────────────────────────────

function VehicleCard({ item, onPress }: { item: VehicleSummary; onPress: () => void }) {
  const badge = TYPE_BADGE[item.vehicle_type];
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      className="bg-white rounded-2xl px-4 py-3.5 flex-row items-center gap-3"
      style={{
        borderWidth: 1, borderColor: '#f1f5f9',
        shadowColor: '#0f172a', shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
      }}
    >
      {/* Type badge */}
      <View
        className="w-12 h-12 rounded-xl items-center justify-center"
        style={{ backgroundColor: badge.bg }}
      >
        <Text style={{ fontSize: 15, fontWeight: '800', color: badge.text }}>{badge.label}</Text>
      </View>

      {/* Info */}
      <View className="flex-1">
        <Text
          style={{
            fontSize: 17, fontWeight: '700', color: '#0f172a',
            fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
            letterSpacing: 0.8,
          }}
        >
          {item.plate}
        </Text>
        <Text style={{ fontSize: 14, color: '#64748b', marginTop: 3 }} numberOfLines={1}>
          {item.brand ? `${item.brand} · ` : ''}{TYPE_LABEL[item.vehicle_type]}
          {item.customer_name ? ` · ${item.customer_name}` : ''}
        </Text>
        <View className="flex-row items-center gap-2 mt-2">
          <View className="flex-row items-center gap-1.5">
            <KIcon name="clock" size={13} color="#94a3b8" />
            <Text style={{ fontSize: 13, color: '#94a3b8' }}>{item.visit_count}x kunjungan</Text>
          </View>
          <Text style={{ color: '#cbd5e1', fontSize: 13 }}>·</Text>
          <Text style={{ fontSize: 13, color: '#94a3b8' }}>{fmtIDR(item.total_spent)}</Text>
        </View>
      </View>

      {/* Right: last visit + chevron */}
      <View className="items-end gap-1.5">
        <Text style={{ fontSize: 13, color: '#94a3b8' }}>{timeAgo(item.last_visit)}</Text>
        <KIcon name="chevron-right" size={16} color="#cbd5e1" />
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

type TypeFilter = 'all' | 'mobil' | 'motor';

export default function VehicleListScreen({ navigation }: Props) {
  const [search,       setSearch]       = useState('');
  const [typeFilter,   setTypeFilter]   = useState<TypeFilter>('all');
  const [vehicles,     setVehicles]     = useState<VehicleSummary[]>([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [outletId,     setOutletId]     = useState<string | null>(null);

  // Load vehicles from API
  const loadVehicles = useCallback(async (refresh = false) => {
    try {
      let oid = outletId;
      if (!oid) {
        oid = await authService.getOutletId();
        if (oid) setOutletId(oid);
      }
      if (!oid) { setError('Outlet belum dikonfigurasi.'); setIsLoading(false); return; }

      if (refresh) setIsRefreshing(true); else setIsLoading(true);
      const result = await vehicleService.fetchVehicles(oid);
      setVehicles(result.vehicles);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal memuat kendaraan.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [outletId]);

  useEffect(() => { void loadVehicles(); }, []);

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      if (typeFilter === 'mobil' && v.vehicle_type !== 'mobil' && v.vehicle_type !== 'pickup') return false;
      if (typeFilter === 'motor' && v.vehicle_type !== 'motor') return false;
      if (search.trim()) {
        const q = search.trim().toUpperCase();
        if (
          !v.plate.toUpperCase().includes(q) &&
          !(v.brand?.toUpperCase().includes(q) ?? false) &&
          !(v.customer_name?.toUpperCase().includes(q) ?? false)
        ) return false;
      }
      return true;
    });
  }, [vehicles, search, typeFilter]);

  const totalVisits  = useMemo(() => filtered.reduce((s, v) => s + v.visit_count,  0), [filtered]);
  const totalRevenue = useMemo(() => filtered.reduce((s, v) => s + v.total_spent, 0), [filtered]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#f8fafc' }} edges={['top']}>
      {/* Header */}
      <View className="bg-white border-b border-slate-100 px-4 pt-3 pb-3">
        <Text style={{ fontSize: 13, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
          Kinclong Purwokerto
        </Text>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#0f172a', marginTop: 2 }}>
          Kendaraan
        </Text>
      </View>

      {/* Search + Filter */}
      <View
        className="bg-white px-4 pt-3 pb-3"
        style={{ borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}
      >
        {/* Search input */}
        <View
          className="flex-row items-center rounded-xl px-3 mb-4"
          style={{ backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0', height: 50 }}
        >
          <KIcon name="search" size={18} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari plat, merek, nama..."
            placeholderTextColor="#94a3b8"
            autoCapitalize="characters"
            style={{ flex: 1, fontSize: 17, color: '#0f172a', marginLeft: 10 }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={{ color: '#94a3b8', fontSize: 20, paddingLeft: 4 }}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Type filter chips */}
        <View className="flex-row gap-2.5 mb-4">
          {([
            { id: 'all',   label: 'Semua'     },
            { id: 'mobil', label: 'Mobil/SUV' },
            { id: 'motor', label: 'Motor'     },
          ] as { id: TypeFilter; label: string }[]).map((f) => (
            <TouchableOpacity
              key={f.id}
              onPress={() => setTypeFilter(f.id)}
              className="px-4 py-2 rounded-full"
              style={{
                backgroundColor: typeFilter === f.id ? '#2563eb' : '#f8fafc',
                borderWidth: 1.5,
                borderColor: typeFilter === f.id ? '#2563eb' : '#e2e8f0',
              }}
            >
              <Text
                style={{
                  fontSize: 14, fontWeight: '700',
                  color: typeFilter === f.id ? '#fff' : '#64748b',
                }}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats row */}
        <View className="flex-row gap-2.5">
          <View
            className="flex-1 rounded-2xl p-3 items-center justify-center"
            style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}
          >
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#0f172a' }}>{filtered.length}</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Kendaraan</Text>
          </View>
          <View
            className="flex-1 rounded-2xl p-3 items-center justify-center"
            style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}
          >
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#0f172a' }}>{totalVisits}</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>Kunjungan</Text>
          </View>
          <View
            className="rounded-2xl p-3 justify-center"
            style={{ flex: 1.2, backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0' }}
          >
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#16a34a', marginBottom: 2 }}>{fmtIDR(totalRevenue)}</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#16a34a', opacity: 0.8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Omset</Text>
          </View>
        </View>
      </View>

      {/* List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 12, fontSize: 15, color: '#64748b' }}>Memuat kendaraan...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-8">
          <KIcon name="alert" size={40} color="#ef4444" />
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#ef4444', marginTop: 12, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity
            onPress={() => loadVehicles()}
            className="mt-4 px-6 py-3 rounded-full"
            style={{ backgroundColor: '#2563eb' }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 14, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadVehicles(true)}
              tintColor="#2563eb"
            />
          }
        >
          {filtered.length === 0 ? (
            <View className="items-center py-16">
              <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-4">
                <KIcon name="car" size={32} color="#94a3b8" />
              </View>
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#334155' }}>Tidak ditemukan</Text>
              <Text style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>Coba kata kunci lain</Text>
            </View>
          ) : (
            <View className="gap-2">
              {filtered.map((item) => (
                <VehicleCard
                  key={item.id ?? item.plate}
                  item={item}
                  onPress={() =>
                    (navigation as any).getParent()?.navigate('VehicleDetail', { plate: item.plate })
                  }
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
