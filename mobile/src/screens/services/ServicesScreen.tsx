import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActionSheet } from '../../components/common/ActionSheet';
import KIcon from '../../components/common/KIcon';
import { useServiceStore } from '../../store/serviceStore';
import type { Service, VehicleType } from '../../types';

function fmtIDR(n: number) { return 'Rp ' + n.toLocaleString('id-ID'); }

// ─── Constants ────────────────────────────────────────────────────────────────

const VEHICLE_TYPES: { id: VehicleType; label: string }[] = [
  { id: 'motor', label: 'Motor' },
  { id: 'mobil', label: 'Mobil' },
  { id: 'pickup', label: 'Pickup/SUV' },
  { id: 'bus', label: 'Bus' },
  { id: 'truk', label: 'Truk' },
];

const DEFAULT_CATEGORIES = ['Cuci Mobil & Motor', 'Detailing', 'Perawatan Tambahan', 'Lainnya'];

// ─── Service Form ─────────────────────────────────────────────────────────────

function ServiceForm({
  initial,
  onSave,
}: {
  initial: Partial<Service> | null;
  onSave: (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [price, setPrice] = useState(initial?.price ? String(initial.price) : '');
  const [duration, setDuration] = useState(initial?.duration_minutes ? String(initial.duration_minutes) : '');
  const [category, setCategory] = useState(initial?.category ?? 'Cuci Mobil & Motor');
  const [isActive, setIsActive] = useState(initial?.is_active ?? true);
  const [selectedTypes, setSelectedTypes] = useState<Set<VehicleType>>(
    new Set(initial?.vehicle_types ?? ['motor', 'mobil'])
  );

  const isValid = name.trim() && Number(price) > 0 && selectedTypes.size > 0 && category.trim();

  const toggleType = (type: VehicleType) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type); else next.add(type);
      return next;
    });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Kategori */}
      <View className="mb-4">
        <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">Kategori *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
          {DEFAULT_CATEGORIES.map(c => (
            <TouchableOpacity
              key={c}
              onPress={() => setCategory(c)}
              className="px-3 py-2 rounded-xl"
              style={{
                backgroundColor: category === c ? '#eff6ff' : '#f8fafc',
                borderWidth: 1.5,
                borderColor: category === c ? '#2563eb' : '#e2e8f0',
                marginRight: 6
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: category === c ? '700' : '500', color: category === c ? '#1d4ed8' : '#64748b' }}>
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Nama & Harga */}
      <View className="mb-4">
        <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">Nama Layanan *</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Cuci Basic"
          placeholderTextColor="#94a3b8"
          className="rounded-xl px-3.5 py-3 text-slate-800"
          style={{ borderColor: '#e2e8f0', borderWidth: 1.5, fontSize: 17 }}
          autoFocus
        />
      </View>

      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">Harga (Rp) *</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="35000"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            className="rounded-xl px-3.5 py-3 text-slate-800"
            style={{ borderColor: '#e2e8f0', borderWidth: 1.5, fontSize: 17 }}
          />
        </View>
        <View className="flex-1">
          <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">Durasi (mnt)</Text>
          <TextInput
            value={duration}
            onChangeText={setDuration}
            placeholder="20"
            placeholderTextColor="#94a3b8"
            keyboardType="numeric"
            className="rounded-xl px-3.5 py-3 text-slate-800"
            style={{ borderColor: '#e2e8f0', borderWidth: 1.5, fontSize: 17 }}
          />
        </View>
      </View>

      {/* Ukuran Kendaraan */}
      <View className="mb-4">
        <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">Tipe Kendaraan *</Text>
        <View className="flex-row flex-wrap gap-2">
          {VEHICLE_TYPES.map(vt => {
            const on = selectedTypes.has(vt.id);
            return (
              <TouchableOpacity
                key={vt.id}
                onPress={() => toggleType(vt.id)}
                className="px-3 py-2 rounded-xl flex-row items-center gap-1.5"
                style={{
                  backgroundColor: on ? '#eff6ff' : '#f8fafc',
                  borderWidth: 1.5,
                  borderColor: on ? '#2563eb' : '#e2e8f0',
                }}
              >
                {on && <KIcon name="check" size={14} color="#2563eb" />}
                <Text style={{ fontSize: 14, fontWeight: '600', color: on ? '#1d4ed8' : '#64748b' }}>
                  {vt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Status Aktif */}
      <View className="flex-row items-center justify-between mb-6 p-4 rounded-xl" style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}>
        <View>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e293b' }}>Layanan Aktif</Text>
          <Text style={{ fontSize: 14, color: '#94a3b8', marginTop: 2 }}>Munculkan layanan di kasir dan kiosk</Text>
        </View>
        <Switch
          value={isActive}
          onValueChange={setIsActive}
          trackColor={{ false: '#e2e8f0', true: '#2563eb' }}
          thumbColor="#fff"
        />
      </View>

      <TouchableOpacity
        onPress={() => isValid && onSave({
          carwash_id: initial?.carwash_id ?? 'cw1',
          name: name.trim(),
          category: category.trim(),
          price: Number(price),
          duration_minutes: Number(duration) || 0,
          vehicle_types: Array.from(selectedTypes),
          is_active: isActive,
        })}
        disabled={!isValid}
        className="w-full py-3.5 rounded-2xl items-center"
        style={{ backgroundColor: isValid ? '#2563eb' : '#e2e8f0' }}
      >
        <Text className="font-bold text-lg" style={{ color: isValid ? '#fff' : '#94a3b8' }}>
          {initial ? 'Simpan Perubahan' : '+ Tambah Layanan'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function ServicesScreen() {
  const { services, addService, updateService, deleteService } = useServiceStore();
  const [editTarget, setEditTarget] = useState<Service | 'new' | null>(null);

  const handleSave = (data: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
    if (editTarget === 'new') {
      addService(data);
    } else if (editTarget) {
      updateService(editTarget.id, data);
    }
    setEditTarget(null);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Hapus Layanan', 'Apakah Anda yakin ingin menghapus layanan ini?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => deleteService(id) },
    ]);
  };

  // Group services by category and sort them
  const groupedServices = useMemo(() => {
    const groups: Record<string, Service[]> = {};
    // Sort all services alphabetically first
    const sorted = [...services].sort((a, b) => a.name.localeCompare(b.name));
    
    sorted.forEach(svc => {
      const cat = svc.category || 'Tanpa Kategori';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(svc);
    });

    // Sort categories
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [services]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#f8fafc' }} edges={['top']}>
      {/* Header */}
      <View className="bg-white border-b border-slate-100 px-4 pt-3 pb-3 flex-row items-center">
        <View className="flex-1">
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>
            Kinclong Purwokerto
          </Text>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#0f172a', marginTop: 2 }}>
            Layanan
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 14, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {groupedServices.map(([cat, svcs]) => (
          <View key={cat} className="mb-6">
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>
              {cat}
            </Text>
            
            <View className="gap-2.5">
              {svcs.map((svc) => (
                <View
                  key={svc.id}
                  className="bg-white rounded-2xl px-4 py-3.5 flex-row items-center gap-3"
                  style={{ borderWidth: 1, borderColor: '#f1f5f9', shadowColor: '#0f172a', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 2, opacity: svc.is_active ? 1 : 0.6 }}
                >
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: svc.is_active ? '#eff6ff' : '#f1f5f9' }}
                  >
                    <KIcon name="wrench" size={20} color={svc.is_active ? '#2563eb' : '#94a3b8'} />
                  </View>
                  <View className="flex-1 pr-2">
                    <Text style={{ fontSize: 17, fontWeight: '700', color: svc.is_active ? '#1e293b' : '#64748b' }}>
                      {svc.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#94a3b8', marginTop: 3 }}>
                      {fmtIDR(svc.price)} · {svc.duration_minutes} mnt
                    </Text>
                    {/* Types chips inline */}
                    <View className="flex-row gap-1 mt-2">
                      {svc.vehicle_types.map(vt => (
                        <View key={vt} className="px-1.5 py-0.5 rounded" style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}>
                          <Text style={{ fontSize: 10, fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>
                            {vt === 'pickup' ? 'SUV' : vt}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View className="items-end justify-between self-stretch py-1 gap-2">
                    <TouchableOpacity
                      onPress={() => setEditTarget(svc)}
                      className="w-9 h-9 rounded-xl items-center justify-center mb-1"
                      style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}
                    >
                      <KIcon name="edit" size={16} color="#64748b" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(svc.id)}
                      className="w-9 h-9 rounded-xl items-center justify-center"
                      style={{ backgroundColor: '#fef2f2' }}
                    >
                      <KIcon name="trash" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* FAB */}
      <View className="absolute bottom-6 right-4">
        <TouchableOpacity
          onPress={() => setEditTarget('new')}
          className="items-center justify-center flex-row gap-2 px-4 py-3 rounded-full"
          style={{ backgroundColor: '#2563eb', shadowColor: '#2563eb', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.45, shadowRadius: 14, elevation: 10 }}
          activeOpacity={0.85}
        >
          <KIcon name="plus" size={24} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <ActionSheet
        visible={editTarget !== null}
        onClose={() => setEditTarget(null)}
        title={editTarget === 'new' ? 'Tambah Layanan' : 'Edit Layanan'}
      >
        <ServiceForm
          initial={editTarget === 'new' ? null : editTarget}
          onSave={handleSave}
        />
      </ActionSheet>
    </SafeAreaView>
  );
}
