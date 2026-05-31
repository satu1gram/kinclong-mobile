import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Platform,
  ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { queueService } from '../../services/queueService';
import { authService } from '../../lib/authService';
import KIcon from '../../components/common/KIcon';
import type { QueueItem } from '../../types';

function fmtIDR(n: number) {
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}jt`;
  return 'Rp ' + n.toLocaleString('id-ID');
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1)  return 'baru saja';
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}



// ─── Compact History Card ─────────────────────────────────────────────────────

function HistoryCard({ item }: { item: QueueItem }) {
  const serviceNames = item.services.map((s) => s.service_name).join(', ');
  return (
    <View
      className="bg-white rounded-2xl px-4 py-3 flex-row items-center gap-3"
      style={{ borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#0f172a', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 }}
    >
      <View
        className="w-9 h-9 rounded-xl items-center justify-center"
        style={{ backgroundColor: item.status === 'paid' ? '#f0fdf4' : '#fffbeb' }}
      >
        <KIcon
          name={item.status === 'paid' ? 'check-circle' : 'refresh'}
          size={18}
          color={item.status === 'paid' ? '#16a34a' : '#d97706'}
        />
      </View>
      <View className="flex-1">
        <Text
          style={{ fontSize: 17, fontWeight: '700', color: '#1e293b', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 0.5 }}
        >
          {item.vehicle_plate}
        </Text>
        <Text style={{ fontSize: 14, color: '#94a3b8', marginTop: 3 }} numberOfLines={1}>
          {item.brand ? `${item.brand} · ` : ''}{serviceNames}
        </Text>
      </View>
      <View className="items-end">
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e293b' }}>{fmtIDR(item.total_price)}</Text>
        <Text style={{ fontSize: 14, color: '#94a3b8', marginTop: 2 }}>{timeAgo(item.updated_at)}</Text>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ReportsScreen() {
  const [search,       setSearch]       = useState('');
  const [history,      setHistory]      = useState<QueueItem[]>([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const loadHistory = useCallback(async (refresh = false) => {
    try {
      const outletId = await authService.getOutletId();
      if (!outletId) { setError('Outlet belum dikonfigurasi.'); setIsLoading(false); return; }

      if (refresh) setIsRefreshing(true); else setIsLoading(true);
      const data = await queueService.fetchHistory(outletId);
      setHistory(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal memuat riwayat.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { void loadHistory(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return history;
    const q = search.toLowerCase();
    return history.filter((v) => v.vehicle_plate.toLowerCase().includes(q));
  }, [history, search]);

  const totalRevenue = useMemo(
    () => filtered.reduce((sum, v) => sum + v.total_price, 0),
    [filtered],
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#f8fafc' }} edges={['top']}>
      {/* Header */}
      <View className="bg-white border-b border-slate-100 px-4 pt-3 pb-3 flex-row items-center">
        <View className="flex-1">
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
            Kinclong Purwokerto
          </Text>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#0f172a', marginTop: 2 }}>
            Riwayat
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => loadHistory(true)}
          className="w-9 h-9 rounded-xl items-center justify-center"
          style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}
        >
          <KIcon name="download" size={16} color="#64748b" />
        </TouchableOpacity>
      </View>

      {/* Search + Stats bar */}
      <View
        className="bg-white px-4 pt-3 pb-3"
        style={{ borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}
      >
        {/* Search */}
        <View
          className="flex-row items-center rounded-xl px-3 mb-4"
          style={{ backgroundColor: '#f8fafc', borderWidth: 1.5, borderColor: '#e2e8f0', height: 50 }}
        >
          <KIcon name="search" size={18} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Cari nomor plat..."
            placeholderTextColor="#94a3b8"
            autoCapitalize="characters"
            style={{ flex: 1, fontSize: 17, color: '#0f172a', marginLeft: 10 }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text className="text-slate-400 text-xl px-1">×</Text>
            </TouchableOpacity>
          )}
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
            className="rounded-2xl p-3 justify-center"
            style={{ flex: 1.5, backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0' }}
          >
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#16a34a', marginBottom: 2 }}>{fmtIDR(totalRevenue)}</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#16a34a', opacity: 0.8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Hari Ini</Text>
          </View>
        </View>
      </View>

      {/* List */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 12, fontSize: 15, color: '#64748b' }}>Memuat riwayat...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-8">
          <KIcon name="alert" size={40} color="#ef4444" />
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#ef4444', marginTop: 12, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity
            onPress={() => loadHistory()}
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
              onRefresh={() => loadHistory(true)}
              tintColor="#2563eb"
            />
          }
        >
          {filtered.length === 0 ? (
            <View className="items-center py-16">
              <View className="w-16 h-16 rounded-full bg-slate-100 items-center justify-center mb-4">
                <KIcon name="search" size={32} color="#94a3b8" />
              </View>
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#334155' }}>Tidak ditemukan</Text>
              <Text style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>Coba kata kunci lain</Text>
            </View>
          ) : (
            <View className="gap-2">
              {filtered.map((item) => (
                <HistoryCard key={item.id} item={item} />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
