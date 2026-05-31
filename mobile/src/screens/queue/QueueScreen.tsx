import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useQueueStore, startQueuePolling, stopQueuePolling } from '../../store/queueStore';
import { useServiceStore } from '../../store/serviceStore';
import { ActionSheet } from '../../components/common/ActionSheet';
import KIcon from '../../components/common/KIcon';
import type { MainTabParamList } from '../../navigation/types';
import type { QueueItem, QueueStatus, VehicleType } from '../../types';

// ─── Constants ────────────────────────────────────────────────────────────────

type FilterKey = 'all' | 'waiting' | 'in_progress' | 'done' | 'paid';

const FILTER_LABELS: Record<FilterKey, string> = {
  all:         'Semua',
  waiting:     'Antri',
  in_progress: 'Dicuci',
  done:        'Selesai',
  paid:        'Lunas',
};

const STATUS_LABEL: Record<QueueStatus, string> = {
  waiting:     'Antri',
  in_progress: 'Dicuci',
  done:        'Selesai',
  paid:        'Lunas',
  cancelled:   'Batal',
};

const STATUS_COLORS: Record<QueueStatus, { bg: string; text: string; dot: string }> = {
  waiting:     { bg: '#ede9fe', text: '#5b21b6', dot: '#7c3aed' },
  in_progress: { bg: '#dbeafe', text: '#1d4ed8', dot: '#3b82f6' },
  done:        { bg: '#d1fae5', text: '#065f46', dot: '#10b981' },
  paid:        { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
  cancelled:   { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
};

const STATUS_BAR: Record<QueueStatus, string> = {
  waiting:     'bg-violet-500',
  in_progress: 'bg-blue-500',
  done:        'bg-green-500',
  paid:        'bg-amber-400',
  cancelled:   'bg-red-400',
};

const VEHICLE_SIZE: Record<VehicleType, string> = {
  motor:  'S',
  mobil:  'M',
  pickup: 'L',
  bus:    'XL',
  truk:   'XL',
};

const VEHICLE_LABEL: Record<VehicleType, string> = {
  motor:  'Motor',
  mobil:  'Mobil',
  pickup: 'Pickup / SUV',
  bus:    'Bus',
  truk:   'Truk',
};

const SIZE_OPTIONS: { value: string; label: string; hint: string; types: VehicleType[] }[] = [
  { value: 'S',  label: 'S',  hint: 'Motor / Mini', types: ['motor'] },
  { value: 'M',  label: 'M',  hint: 'Sedan / MPV',  types: ['mobil'] },
  { value: 'L',  label: 'L',  hint: 'SUV / Van',    types: ['pickup'] },
  { value: 'XL', label: 'XL', hint: 'Bus / Truk',   types: ['bus', 'truk'] },
];

const NEXT_STATUS: Partial<Record<QueueStatus, QueueStatus>> = {
  waiting:     'in_progress',
  in_progress: 'done',
  done:        'paid',
};

const NEXT_LABEL: Partial<Record<QueueStatus, string>> = {
  waiting:     'Mulai Kerjakan',
  in_progress: 'Selesai',
  done:        'Bayar (Lunas)',
};

function timeAgo(iso: string): string {
  const m = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60_000));
  if (m < 1)  return 'baru saja';
  if (m < 60) return `${m} mnt lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hr lalu`;
}

const fmtIDR = (n: number) =>
  'Rp ' + n.toLocaleString('id-ID');

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: QueueStatus }) {
  const c = STATUS_COLORS[status];
  return (
    <View
      style={{ backgroundColor: c.bg }}
      className="flex-row items-center self-start px-2 py-0.5 rounded-full gap-1"
    >
      <View
        style={{ backgroundColor: c.dot }}
        className="w-1.5 h-1.5 rounded-full"
      />
      <Text
        style={{ color: c.text, fontSize: 13 }}
        className="font-bold uppercase tracking-wider"
      >
        {STATUS_LABEL[status]}
      </Text>
    </View>
  );
}

function VisitCard({
  item,
  onPress,
}: {
  item: QueueItem;
  onPress: (item: QueueItem) => void;
}) {
  const nextStatus = NEXT_STATUS[item.status];

  return (
    <TouchableOpacity
      onPress={() => onPress(item)}
      className="bg-white rounded-2xl mb-3 overflow-hidden"
      style={{ borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#0f172a', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}
      activeOpacity={0.88}
    >
      {/* Top bar color */}
      <View className={`h-1 ${STATUS_BAR[item.status]}`} />

      <View className="px-3.5 pt-3 pb-3">
        {/* Row 1: Plate + Status */}
        <View className="flex-row items-start justify-between mb-1.5">
          <View className="flex-1 pr-2">
            <Text
              className="text-slate-900 font-bold"
              style={{ fontSize: 18, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 1 }}
            >
              {item.vehicle_plate}
            </Text>
            <Text style={{ fontSize: 14, color: '#94a3b8', marginTop: 3 }}>
              {item.brand ?? VEHICLE_LABEL[item.vehicle_type]}
              {' · Ukuran '}
              {VEHICLE_SIZE[item.vehicle_type]}
            </Text>
          </View>
          <StatusBadge status={item.status} />
        </View>

        {/* Services chips */}
        <View className="flex-row flex-wrap gap-1 mb-2.5">
          {item.services.map((s) => (
            <View
              key={s.service_id}
              className="bg-slate-50 px-2 py-px rounded-md"
              style={{ borderWidth: 1, borderColor: '#e2e8f0' }}
            >
              <Text style={{ fontSize: 14, color: '#64748b', fontWeight: '500' }}>{s.service_name}</Text>
            </View>
          ))}
        </View>

        <View className="flex-row items-center justify-between mb-2 mt-1">
          <View className="flex-row items-center gap-1.5">
            <KIcon name="clock" size={13} color="#94a3b8" />
            <Text style={{ fontSize: 14, color: '#94a3b8' }}>{timeAgo(item.created_at)}</Text>
          </View>
          <Text style={{ fontSize: 16, color: '#1e293b', fontWeight: '700' }}>
            {fmtIDR(item.total_price)}
          </Text>
        </View>

        {/* Action button */}
        {nextStatus && (
          <TouchableOpacity
            onPress={() => onPress(item)}
            className="w-full py-2.5 rounded-xl items-center justify-center flex-row gap-1.5"
            style={{
              backgroundColor:
                item.status === 'waiting'     ? '#dbeafe' :
                item.status === 'in_progress' ? '#d1fae5' :
                '#fef3c7',
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: '700',
                color:
                  item.status === 'waiting'     ? '#1d4ed8' :
                  item.status === 'in_progress' ? '#065f46' :
                  '#92400e',
              }}
            >
              {NEXT_LABEL[item.status]}
            </Text>
          </TouchableOpacity>
        )}

        {item.status === 'paid' && (
          <View className="w-full py-2.5 rounded-xl items-center justify-center flex-row gap-1.5 bg-green-50">
            <Text style={{ fontSize: 15, color: '#15803d', fontWeight: '700' }}>✓ Pembayaran Diterima</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function CompactCard({ item }: { item: QueueItem }) {
  const total = item.total_price;
  return (
    <View
      className="bg-white rounded-2xl mb-2 px-3.5 py-3 flex-row items-center justify-between"
      style={{ borderWidth: 1, borderColor: '#f1f5f9' }}
    >
      <View className="flex-1 pr-3">
        <Text
          style={{ fontSize: 17, fontWeight: '700', color: '#1e293b', fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 0.5 }}
        >
          {item.vehicle_plate}
        </Text>
        <Text style={{ fontSize: 14, color: '#94a3b8', marginTop: 2 }}>
          {item.brand ?? VEHICLE_LABEL[item.vehicle_type]}
        </Text>
      </View>
      <View className="items-end">
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e293b' }}>{fmtIDR(total)}</Text>
        <Text style={{ fontSize: 14, color: '#94a3b8', marginTop: 2 }}>{timeAgo(item.updated_at)}</Text>
      </View>
    </View>
  );
}

// ─── Visit Action Sheet ───────────────────────────────────────────────────────

function VisitDetail({
  item,
  onAdvance,
  onClose,
}: {
  item: QueueItem;
  onAdvance: (id: string, status: QueueStatus) => void;
  onClose: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  const nextStatus = NEXT_STATUS[item.status];
  const statusC = STATUS_COLORS[item.status];

  const accentColor =
    item.status === 'waiting'     ? '#3b82f6' :
    item.status === 'in_progress' ? '#10b981' :
    item.status === 'done'        ? '#f59e0b' : '#64748b';

  return (
    <View>
      {/* Status + time */}
      <View className="flex-row items-center gap-2 mb-2">
        <StatusBadge status={item.status} />
        <Text className="text-slate-400 text-sm">{timeAgo(item.created_at)}</Text>
      </View>

      {/* Plate */}
      <Text
        className="text-slate-900 font-extrabold mb-1"
        style={{ fontSize: 28, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 2 }}
      >
        {item.vehicle_plate}
      </Text>
      <Text className="text-slate-400 text-base mb-4">
        {item.brand ?? VEHICLE_LABEL[item.vehicle_type]} · Ukuran {VEHICLE_SIZE[item.vehicle_type]}
        {item.customer_name ? ` · ${item.customer_name}` : ''}
      </Text>

      {/* Services summary */}
      <View
        className="rounded-2xl p-3.5 mb-4"
        style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#f1f5f9' }}
      >
        {item.services.map((s) => (
          <View
            key={s.service_id}
            className="flex-row justify-between py-1.5"
            style={{ borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}
          >
            <Text style={{ fontSize: 16, color: '#475569' }}>{s.service_name}</Text>
            <Text style={{ fontSize: 16, color: '#1e293b', fontWeight: '500' }}>
              {fmtIDR(s.price)}
            </Text>
          </View>
        ))}
        <View className="flex-row justify-between pt-2.5 mt-1">
          <Text className="text-slate-500 text-sm font-bold uppercase tracking-wider">Total</Text>
          <Text className="text-slate-900 font-extrabold text-xl">{fmtIDR(item.total_price)}</Text>
        </View>
      </View>

      {/* Action */}
      {nextStatus ? (
        <>
          <TouchableOpacity
            onPress={() => {
              if (!confirm) { setConfirm(true); return; }
              onAdvance(item.id, nextStatus);
              onClose();
            }}
            className="w-full py-3.5 rounded-2xl items-center justify-center mb-2"
            style={{ backgroundColor: confirm ? '#0f172a' : accentColor }}
          >
            <Text className="text-white font-bold text-base">
              {confirm ? 'Tap untuk konfirmasi' : NEXT_LABEL[item.status]}
            </Text>
          </TouchableOpacity>
          {confirm && (
            <TouchableOpacity onPress={() => setConfirm(false)}>
              <Text className="text-slate-400 text-sm text-center py-2">Batal</Text>
            </TouchableOpacity>
          )}
        </>
      ) : item.status === 'paid' ? (
        <View className="w-full py-3.5 rounded-2xl items-center justify-center flex-row gap-2 bg-green-50">
          <Text className="text-green-700 font-bold text-base">✓ Pembayaran Sudah Diterima</Text>
        </View>
      ) : null}
    </View>
  );
}

// ─── New Visit Form ───────────────────────────────────────────────────────────

function NewVisitForm({ onSubmit }: { onSubmit: (data: Omit<QueueItem, 'id' | 'queue_number' | 'created_at' | 'updated_at'>) => void }) {
  const { services } = useServiceStore();
  const [plate, setPlate]           = useState('');
  const [brand, setBrand]           = useState('');
  const [selectedSize, setSize]     = useState('M');
  const [selectedSvc, setSelectedSvc] = useState<Set<string>>(new Set(['basic']));

  const sizeOption = SIZE_OPTIONS.find((s) => s.value === selectedSize)!;
  const vehicleType: VehicleType = sizeOption.types[0];

  const toggle = (id: string) =>
    setSelectedSvc((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const total = services
    .filter((s) => selectedSvc.has(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  return (
    <View>
      {/* Plate */}
      <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">
        Nomor Plat
      </Text>
      <TextInput
        value={plate}
        onChangeText={(v) => setPlate(v.toUpperCase())}
        placeholder="B 1234 ABC"
        autoCapitalize="characters"
        autoFocus
        className="border-2 border-slate-200 rounded-2xl mb-4 text-center text-slate-900 font-bold"
        style={{
          padding: 18,
          fontSize: 28,
          fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
          letterSpacing: 4,
          borderColor: plate ? '#2563eb' : '#e2e8f0',
        }}
        placeholderTextColor="#94a3b8"
      />

      {/* Size */}
      <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
        Ukuran Kendaraan
      </Text>
      <View className="flex-row gap-2 mb-4">
        {SIZE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            onPress={() => setSize(opt.value)}
            className="flex-1 items-center py-2.5 rounded-xl"
            style={{
              backgroundColor: selectedSize === opt.value ? '#2563eb' : '#f8fafc',
              borderWidth: 1.5,
              borderColor:  selectedSize === opt.value ? '#2563eb' : '#e2e8f0',
            }}
          >
            <Text
              className="font-extrabold text-base"
              style={{ color: selectedSize === opt.value ? '#fff' : '#475569' }}
            >
              {opt.label}
            </Text>
            <Text
              style={{ fontSize: 13, fontWeight: '500', marginTop: 3, color: selectedSize === opt.value ? 'rgba(255,255,255,0.75)' : '#94a3b8' }}
            >
              {opt.hint}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Brand */}
      <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">
        Merk / Tipe (opsional)
      </Text>
      <TextInput
        value={brand}
        onChangeText={setBrand}
        placeholder="Toyota Avanza"
        className="border border-slate-200 rounded-xl px-3.5 py-3 mb-4"
        style={{ fontSize: 16, color: '#1e293b' }}
        placeholderTextColor="#94a3b8"
      />

      {/* Services */}
      <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
        Pilih Layanan
      </Text>
      <View className="mb-4 gap-2">
        {services.map((svc) => {
          const on = selectedSvc.has(svc.id);
          return (
            <TouchableOpacity
              key={svc.id}
              onPress={() => toggle(svc.id)}
              className="flex-row items-center justify-between rounded-xl px-3.5 py-2.5"
              style={{
                backgroundColor: on ? '#eff6ff' : '#f8fafc',
                borderWidth: 1.5,
                borderColor: on ? '#2563eb' : '#e2e8f0',
              }}
            >
              <View className="flex-row items-center gap-2.5">
                <View
                  className="w-5 h-5 rounded-full items-center justify-center"
                  style={{ backgroundColor: on ? '#2563eb' : '#e2e8f0' }}
                >
                  {on && <Text className="text-white text-xs font-bold">✓</Text>}
                </View>
                <Text
                  className="font-medium text-sm"
                  style={{ color: on ? '#1e293b' : '#64748b' }}
                >
                  {svc.name}
                </Text>
              </View>
              <Text
                className="font-semibold text-sm"
                style={{ color: on ? '#2563eb' : '#94a3b8' }}
              >
                {fmtIDR(svc.price)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Total */}
      <View
        className="flex-row justify-between items-center rounded-xl px-3.5 py-3 mb-4"
        style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}
      >
        <Text className="text-slate-500 text-sm font-semibold">Total</Text>
        <Text className="text-slate-900 font-extrabold text-xl">{fmtIDR(total)}</Text>
      </View>

      {/* Submit */}
      <TouchableOpacity
        onPress={() => {
          if (!plate.trim() || selectedSvc.size === 0) return;
          const chosenServices = services
            .filter((s) => selectedSvc.has(s.id))
            .map((s) => ({ service_id: s.id, service_name: s.name, price: s.price }));
          onSubmit({
            carwash_id:    'cw1',
            vehicle_type:  vehicleType,
            vehicle_plate: plate.trim().toUpperCase(),
            brand:         brand.trim() || undefined,
            services:      chosenServices,
            status:        'waiting',
            total_price:   total,
          });
        }}
        className="w-full py-3.5 rounded-2xl items-center"
        style={{
          backgroundColor: plate.trim() && selectedSvc.size > 0 ? '#2563eb' : '#e2e8f0',
        }}
        disabled={!plate.trim() || selectedSvc.size === 0}
      >
        <Text
          className="font-bold text-base"
          style={{ color: plate.trim() && selectedSvc.size > 0 ? '#fff' : '#94a3b8' }}
        >
          + Tambah ke Antrian
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function QueueScreen() {
  const {
    queues, updateQueueStatus, addQueue, pendingAddForm, dismissAddForm,
    isLoading, isRefreshing, error, initialize, fetchQueue,
  } = useQueueStore();
  const { initialize: initServices } = useServiceStore();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  const [search, setSearch]               = useState('');
  const [filter, setFilter]               = useState<FilterKey>('all');
  const [selectedVisit, setSelectedVisit] = useState<QueueItem | null>(null);
  const [fabOpen, setFabOpen]             = useState(false);
  const [toast, setToast]                 = useState('');

  // Initialize stores & start polling on mount
  useEffect(() => {
    void initialize();
    void initServices();
    startQueuePolling();
    return () => stopQueuePolling();
  }, []);

  useEffect(() => {
    if (pendingAddForm) {
      setFabOpen(true);
      dismissAddForm();
    }
  }, [pendingAddForm]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }, []);

  const filtered = useMemo(() => {
    return queues.filter((q) => {
      if (filter !== 'all' && q.status !== filter) return false;
      if (search.trim()) {
        const s = search.trim().toUpperCase();
        if (!q.vehicle_plate.toUpperCase().includes(s)) return false;
      }
      return true;
    });
  }, [queues, filter, search]);

  const activeItems = filtered.filter((q) => q.status !== 'paid' && q.status !== 'cancelled');
  const paidItems   = filtered.filter((q) => q.status === 'paid');

  const counts = useMemo(() => ({
    all:         queues.length,
    waiting:     queues.filter((q) => q.status === 'waiting').length,
    in_progress: queues.filter((q) => q.status === 'in_progress').length,
    done:        queues.filter((q) => q.status === 'done').length,
    paid:        queues.filter((q) => q.status === 'paid').length,
  }), [queues]);

  const handleAdvance = useCallback(async (id: string, status: QueueStatus) => {
    try {
      await updateQueueStatus(id, status);
      const labels: Record<QueueStatus, string> = {
        waiting:     'Antri', in_progress: 'Mulai dicuci',
        done: 'Selesai dikerjakan!', paid: 'Pembayaran diterima ✓', cancelled: '',
      };
      showToast(labels[status] ?? 'Status diperbarui');
    } catch {
      showToast('Gagal memperbarui status. Coba lagi.');
    }
  }, [updateQueueStatus, showToast]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View className="bg-white border-b border-slate-100">
        <View className="flex-row items-center px-4 pt-3 pb-2">
          <View className="flex-1">
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
              Kinclong Purwokerto
            </Text>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#0f172a', marginTop: 2 }}>Antrian</Text>
          </View>
        </View>

        {/* Trial banner — gradient amber→orange */}
        <LinearGradient
          colors={['#f59e0b', '#f97316']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-row items-center justify-between mx-4 mb-3 px-3 py-2.5 rounded-xl"
        >
          <View className="flex-row items-center gap-2">
            <KIcon name="crown" size={14} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>Trial Pro · 9 hari tersisa</Text>
          </View>
          <TouchableOpacity
            className="px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
          >
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Upgrade</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Search */}
        <View className="flex-row items-center bg-slate-50 mx-4 mb-3 rounded-xl px-3"
          style={{ borderWidth: 1.5, borderColor: '#e2e8f0', height: 50 }}>
          <KIcon name="search" size={18} color="#cbd5e1" />
          <TextInput
            style={{ flex: 1, fontSize: 17, color: '#0f172a', marginLeft: 10 }}
            placeholder="Cari nomor plat..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="characters"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text className="text-slate-400 text-sm px-1">✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12, gap: 6, flexDirection: 'row' }}
        >
          {(Object.keys(FILTER_LABELS) as FilterKey[]).map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => setFilter(key)}
              className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                backgroundColor: filter === key ? '#2563eb' : '#f8fafc',
                borderWidth: 1,
                borderColor: filter === key ? '#2563eb' : '#e2e8f0',
              }}
            >
              <Text
                className="text-sm font-bold"
                style={{ color: filter === key ? '#fff' : '#475569' }}
              >
                {FILTER_LABELS[key]}
              </Text>
              {counts[key] > 0 && (
                <View
                  className="px-1.5 rounded-full"
                  style={{ backgroundColor: filter === key ? 'rgba(255,255,255,0.25)' : '#e2e8f0' }}
                >
                  <Text
                    className="text-sm font-bold"
                    style={{ color: filter === key ? '#fff' : '#64748b' }}
                  >
                    {counts[key]}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Queue List ─────────────────────────────────────────────────── */}
      {isLoading && queues.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={{ marginTop: 12, fontSize: 15, color: '#64748b' }}>Memuat antrian...</Text>
        </View>
      ) : error && queues.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <KIcon name="alert" size={40} color="#ef4444" />
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#ef4444', marginTop: 12, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity
            onPress={() => fetchQueue()}
            className="mt-4 px-6 py-3 rounded-full"
            style={{ backgroundColor: '#2563eb' }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 14, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => fetchQueue()}
              tintColor="#2563eb"
            />
          }
        >
          {activeItems.length === 0 && paidItems.length === 0 ? (
            <View className="items-center justify-center py-20">
              <View className="w-14 h-14 rounded-full bg-slate-100 items-center justify-center mb-3">
                <KIcon name="car" size={28} color="#94a3b8" />
              </View>
              <Text className="text-slate-700 font-bold text-base">
                {search ? 'Tidak ditemukan' : 'Antrian kosong'}
              </Text>
              <Text className="text-slate-400 text-xs mt-1 text-center">
                {search ? 'Coba kata kunci lain' : 'Belum ada kendaraan aktif hari ini'}
              </Text>
              {!search && (
                <TouchableOpacity
                  onPress={() => setFabOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-50"
                >
                  <Text className="text-blue-600 font-semibold text-sm">+ Tambah kendaraan</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <>
              {activeItems.map((item) => (
                <VisitCard key={item.id} item={item} onPress={setSelectedVisit} />
              ))}

              {paidItems.length > 0 && (
                <>
                  <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-2 mb-2">
                    Lunas Hari Ini
                  </Text>
                  {paidItems.map((item) => (
                    <CompactCard key={item.id} item={item} />
                  ))}
                </>
              )}
            </>
          )}
        </ScrollView>
      )}

      {/* ── Toast ──────────────────────────────────────────────────────── */}
      {toast.length > 0 && (
        <View
          className="absolute top-16 self-center px-4 py-2.5 rounded-full flex-row items-center gap-2"
          style={{ backgroundColor: '#0f172a', shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 8 }}
          pointerEvents="none"
        >
          <Text className="text-white text-xs font-semibold">✓ {toast}</Text>
        </View>
      )}

      {/* ── Action Sheet: Visit Detail ──────────────────────────────────── */}
      <ActionSheet
        visible={selectedVisit !== null}
        onClose={() => setSelectedVisit(null)}
      >
        {selectedVisit && (
          <VisitDetail
            item={selectedVisit}
            onAdvance={handleAdvance}
            onClose={() => setSelectedVisit(null)}
          />
        )}
      </ActionSheet>

      {/* ── Action Sheet: New Visit ─────────────────────────────────────── */}
      <ActionSheet
        visible={fabOpen}
        onClose={() => setFabOpen(false)}
        title="Tambah Kendaraan"
      >
        <NewVisitForm
          onSubmit={(data) => {
            addQueue(data);
            setFabOpen(false);
            showToast('Kendaraan ditambahkan ke antrian');
          }}
        />
      </ActionSheet>
    </SafeAreaView>
  );
}
