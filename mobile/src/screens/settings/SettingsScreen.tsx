import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Switch, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import KIcon from '../../components/common/KIcon';

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View
      className="bg-white rounded-2xl overflow-hidden mb-3"
      style={{ borderWidth: 1, borderColor: '#f1f5f9' }}
    >
      <View
        className="px-4 py-2.5"
        style={{ borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}
      >
        <Text className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</Text>
      </View>
      <View className="px-4 py-3 gap-3">{children}</View>
    </View>
  );
}

// ─── Toggle Row ───────────────────────────────────────────────────────────────

function ToggleRow({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-slate-800 text-sm font-medium flex-1 mr-3">{label}</Text>
      <Switch
        value={on}
        onValueChange={setOn}
        trackColor={{ false: '#e2e8f0', true: '#2563eb' }}
        thumbColor="#ffffff"
        ios_backgroundColor="#e2e8f0"
      />
    </View>
  );
}

// ─── Settings Input ───────────────────────────────────────────────────────────

function SettingsInput({
  label, defaultValue, multiline,
}: { label: string; defaultValue: string; multiline?: boolean }) {
  const [val, setVal] = useState(defaultValue);
  return (
    <View>
      <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">{label}</Text>
      <TextInput
        value={val}
        onChangeText={setVal}
        multiline={multiline}
        numberOfLines={multiline ? 2 : 1}
        className="rounded-xl px-3.5 py-2.5 text-slate-800 text-sm"
        style={{
          borderWidth: 1.5,
          borderColor: '#e2e8f0',
          minHeight: multiline ? 60 : undefined,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const { signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert('Keluar dari Akun', 'Anda yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#f8fafc' }} edges={['top']}>
      {/* Header */}
      <View className="bg-white border-b border-slate-100 px-4 pt-3 pb-3 flex-row items-center">
        <View className="flex-1">
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">Kinclong Purwokerto</Text>
          <Text className="text-slate-900 text-lg font-bold mt-0.5">Pengaturan</Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 14, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profil Outlet */}
        <SectionCard title="Profil Outlet">
          <SettingsInput label="Nama Outlet" defaultValue="Kinclong Purwokerto" />
          <SettingsInput label="No. Telepon" defaultValue="0812-3456-7890" />
          <SettingsInput label="Alamat" defaultValue="Jl. Jenderal Soedirman No. 45, Purwokerto" multiline />
          <TouchableOpacity
            className="w-full py-3 rounded-xl items-center mt-1"
            style={{ backgroundColor: '#2563eb' }}
          >
            <Text className="text-white font-bold text-sm">✓ Simpan Perubahan</Text>
          </TouchableOpacity>
        </SectionCard>

        {/* Kebijakan Antrian */}
        <SectionCard title="Kebijakan Antrian">
          <ToggleRow label="Terima antrian walk-in" defaultOn />
          <ToggleRow label="Mode kiosk self-service" defaultOn />
          <ToggleRow label="Notifikasi status via WhatsApp" />
        </SectionCard>

        {/* Pembayaran */}
        <SectionCard title="Pembayaran">
          <ToggleRow label="Terima pembayaran tunai" defaultOn />
          <ToggleRow label="Terima QRIS / Transfer bank" defaultOn />
          <ToggleRow label="Cetak struk otomatis" />
        </SectionCard>

        {/* Keamanan */}
        <SectionCard title="Keamanan">
          <ToggleRow label="PIN operator (akses kiosk)" />
          <ToggleRow label="2FA untuk login owner" defaultOn />
        </SectionCard>

        {/* Bahaya */}
        <SectionCard title="Bahaya">
          <TouchableOpacity
            onPress={handleLogout}
            className="w-full py-3 rounded-xl items-center flex-row justify-center gap-2"
            style={{ backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca' }}
          >
            <KIcon name="logout" size={18} color="#ef4444" />
            <Text className="text-red-600 font-bold text-sm">Keluar dari Akun</Text>
          </TouchableOpacity>
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}
