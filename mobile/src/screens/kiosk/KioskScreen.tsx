import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import type { VehicleType } from '../../types';

/**
 * screens/kiosk/KioskScreen.tsx
 *
 * Mode Kiosk - Antarmuka sentuh sederhana untuk input antrean cepat.
 * Dirancang untuk tablet / layar touch di area reception car wash.
 * Tanpa navigasi kompleks: hanya pilih kendaraan → plat → submit.
 *
 * TODO Phase 2: Submit ke Supabase & tampilkan nomor antrean
 * TODO Phase 3: Pilih layanan & tampilkan receipt
 */

const VEHICLE_OPTIONS: { type: VehicleType; label: string; icon: string }[] = [
  { type: 'motor',  label: 'Motor',  icon: '🏍️' },
  { type: 'mobil',  label: 'Mobil',  icon: '🚗' },
  { type: 'pickup', label: 'Pickup', icon: '🛻' },
  { type: 'bus',    label: 'Bus',    icon: '🚌' },
  { type: 'truk',   label: 'Truk',   icon: '🚛' },
];

export default function KioskScreen() {
  const { t } = useTranslation();
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType | null>(null);
  const [plate, setPlate] = useState('');
  const [customerName, setCustomerName] = useState('');

  const handleSubmit = () => {
    if (!selectedVehicle || !plate.trim()) return;
    // TODO Phase 2: Kirim ke Supabase, tampilkan queue number
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-800">
      <ScrollView
        contentContainerStyle={{ padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Brand Header */}
        <View className="items-center mb-8 mt-4">
          <Text className="text-white text-4xl font-bold">Kinclong</Text>
          <Text className="text-blue-200 mt-1">{t('kiosk.subtitle')}</Text>
        </View>

        {/* Vehicle Type */}
        <Text className="text-white font-semibold mb-3">{t('kiosk.select_vehicle')}</Text>
        <View className="flex-row flex-wrap gap-3 mb-6">
          {VEHICLE_OPTIONS.map((v) => (
            <TouchableOpacity
              key={v.type}
              onPress={() => setSelectedVehicle(v.type)}
              className={`flex-1 min-w-[28%] items-center py-4 rounded-2xl border-2 ${
                selectedVehicle === v.type
                  ? 'bg-white border-white'
                  : 'bg-blue-700 border-blue-600'
              }`}
            >
              <Text className="text-3xl">{v.icon}</Text>
              <Text
                className={`text-sm font-semibold mt-1 ${
                  selectedVehicle === v.type ? 'text-blue-800' : 'text-white'
                }`}
              >
                {v.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Plate Input */}
        <Text className="text-white font-semibold mb-2">{t('kiosk.enter_plate')}</Text>
        <Input
          placeholder="B 1234 ABC"
          autoCapitalize="characters"
          value={plate}
          onChangeText={(v) => setPlate(v.toUpperCase())}
          className="text-lg tracking-widest font-semibold"
        />

        {/* Customer Name */}
        <Text className="text-white font-semibold mb-2 mt-2">{t('kiosk.enter_name')}</Text>
        <Input
          placeholder={t('common.optional')}
          value={customerName}
          onChangeText={setCustomerName}
        />

        <Button
          title={t('kiosk.submit')}
          onPress={handleSubmit}
          size="lg"
          variant="secondary"
          disabled={!selectedVehicle || !plate.trim()}
          className="mt-4"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
