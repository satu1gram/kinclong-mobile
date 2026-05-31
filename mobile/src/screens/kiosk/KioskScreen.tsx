import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueueStore } from '../../store/queueStore';
import { useServiceStore } from '../../store/serviceStore';
import KIcon from '../../components/common/KIcon';
import type { VehicleType } from '../../types';

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_OPTIONS = [
  { value: 'S',  label: 'S',  hint: 'Motor / Mini', type: 'motor'  as VehicleType },
  { value: 'M',  label: 'M',  hint: 'Sedan / MPV',  type: 'mobil'  as VehicleType },
  { value: 'L',  label: 'L',  hint: 'SUV / Van',    type: 'pickup' as VehicleType },
  { value: 'XL', label: 'XL', hint: 'Bus / Truk',   type: 'bus'    as VehicleType },
];

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({
  queueNumber,
  plate,
  total,
  onReset,
}: {
  queueNumber: number;
  plate: string;
  total: number;
  onReset: () => void;
}) {
  const [count, setCount] = useState(10);

  useEffect(() => {
    const t = setInterval(() => {
      setCount((c) => {
        if (c <= 1) { clearInterval(t); onReset(); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const progress = (count / 10) * 100;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#f0fdf4' }} edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-7">
        {/* Check circle */}
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-5"
          style={{ backgroundColor: '#dcfce7', borderWidth: 3, borderColor: '#10b981' }}
        >
          <KIcon name="check" size={36} color="#10b981" />
        </View>

        <Text
          className="text-slate-900 font-extrabold text-center mb-2"
          style={{ fontSize: 26, letterSpacing: -0.5 }}
        >
          Kendaraan Masuk!
        </Text>
        <Text className="text-slate-500 text-sm text-center mb-7 leading-relaxed">
          Kendaraan Anda sudah masuk antrian.{'\n'}Harap menunggu hingga dipanggil.
        </Text>

        {/* Queue number card */}
        <View
          className="w-full rounded-3xl px-10 py-7 items-center mb-6"
          style={{
            backgroundColor: '#fff',
            shadowColor: '#0f172a',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.08,
            shadowRadius: 24,
            elevation: 8,
            borderWidth: 1,
            borderColor: '#f1f5f9',
          }}
        >
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
            Nomor Antrian
          </Text>
          <Text
            className="font-black text-center"
            style={{ fontSize: 72, color: '#2563eb', letterSpacing: -3, lineHeight: 76 }}
          >
            #{queueNumber}
          </Text>
          <View className="flex-row items-center gap-2 mt-2">
            <Text
              className="text-slate-700 font-bold text-base"
              style={{ fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 1 }}
            >
              {plate}
            </Text>
          </View>
          <Text className="text-slate-400 text-xs mt-1">
            Rp {total.toLocaleString('id-ID')}
          </Text>
        </View>

        {/* Countdown bar */}
        <View className="w-full h-1 bg-slate-200 rounded-full mb-2 overflow-hidden">
          <View
            className="h-full bg-green-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
        <Text className="text-slate-400 text-xs mb-6">
          Reset otomatis dalam{' '}
          <Text className="text-slate-600 font-bold">{count} detik</Text>
        </Text>

        <TouchableOpacity
          onPress={onReset}
          className="flex-row items-center gap-2 px-5 py-3 rounded-2xl"
          style={{ backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0' }}
        >
          <Text className="text-slate-500 text-base">↺</Text>
          <Text className="text-slate-600 font-semibold text-sm">Mulai Baru</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Main Kiosk Screen ────────────────────────────────────────────────────────

export default function KioskScreen() {
  const { addQueue } = useQueueStore();
  const { services }  = useServiceStore();

  const [step, setStep]               = useState(1);
  const [plate, setPlate]             = useState('');
  const [selectedSize, setSize]       = useState('M');
  const [selectedSvc, setSelectedSvc] = useState<Set<string>>(new Set());
  const [note, setNote]               = useState('');
  const [done, setDone]               = useState(false);
  const [qNum, setQNum]               = useState(0);
  const [qTotal, setQTotal]           = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sizeOption   = SIZE_OPTIONS.find((s) => s.value === selectedSize)!;
  const vehicleType  = sizeOption.type;

  const toggle = (id: string) =>
    setSelectedSvc((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const total = useMemo(
    () => services.filter((s) => selectedSvc.has(s.id)).reduce((sum, s) => sum + s.price, 0),
    [services, selectedSvc]
  );

  const canProceed =
    step === 1 ? plate.trim().length >= 2 :
    step === 2 ? selectedSvc.size > 0 :
    true;

  async function handleSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const chosenServices = services
        .filter((s) => selectedSvc.has(s.id))
        .map((s) => ({ service_id: s.id, service_name: s.name, price: s.price }));

      const newQueue = await addQueue({
        carwash_id:    '',
        vehicle_type:  vehicleType,
        vehicle_plate: plate.trim().toUpperCase(),
        services:      chosenServices,
        status:        'waiting',
        total_price:   total,
        ...(note.trim() ? { notes: note.trim() } : {}),
      });

      setQNum(newQueue.queue_number);
      setQTotal(total);
      setDone(true);
    } catch {
      // Error ditangani oleh store, cukup reset submitting
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setStep(1);
    setPlate('');
    setSize('M');
    setSelectedSvc(new Set());
    setNote('');
    setDone(false);
    setQNum(0);
    setQTotal(0);
  }

  if (done) {
    return (
      <SuccessScreen
        queueNumber={qNum}
        plate={plate.trim().toUpperCase()}
        total={qTotal}
        onReset={handleReset}
      />
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: '#eff6ff' }}
      edges={['top']}
    >
      {/* Header */}
      <View className="items-center pt-7 pb-4 px-6">
        <Text
          className="font-extrabold"
          style={{ fontSize: 26, letterSpacing: -1, lineHeight: 30 }}
        >
          <Text style={{ color: '#1e40af' }}>kin</Text>
          <Text style={{ color: '#f97316', fontStyle: 'italic' }}>c</Text>
          <Text style={{ color: '#1e40af' }}>long</Text>
        </Text>
        <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
          Self-Service Kiosk
        </Text>
      </View>

      {/* Step indicator */}
      <View className="flex-row gap-1.5 px-6 mb-0 pb-0">
        {[1, 2, 3].map((s) => (
          <View
            key={s}
            className="flex-1 h-1 rounded-full"
            style={{ backgroundColor: step >= s ? '#2563eb' : '#dbeafe' }}
          />
        ))}
      </View>

      {/* Form card */}
      <View className="flex-1 bg-white rounded-t-3xl mt-4 overflow-hidden">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 22, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* ── Step 1: Plate ──────────────────────────────────────────── */}
          {step === 1 && (
            <View>
              <Text
                className="text-slate-900 font-extrabold mb-1"
                style={{ fontSize: 22, letterSpacing: -0.5 }}
              >
                Selamat Datang!
              </Text>
              <Text className="text-slate-500 text-sm leading-relaxed mb-6">
                Masukkan nomor plat kendaraan Anda untuk melanjutkan.
              </Text>

              <View
                className="rounded-2xl p-5 mb-3"
                style={{
                  backgroundColor: '#fff',
                  borderWidth: 2,
                  borderColor: plate ? '#2563eb' : '#e2e8f0',
                  shadowColor: '#0f172a',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.06,
                  shadowRadius: 12,
                  elevation: 3,
                }}
              >
                <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                  Nomor Plat Kendaraan
                </Text>
                <TextInput
                  value={plate}
                  onChangeText={(v) => setPlate(v.toUpperCase())}
                  placeholder="B 1234 ABC"
                  autoFocus
                  autoCapitalize="characters"
                  className="text-slate-900 font-bold text-center"
                  style={{
                    fontSize: 32,
                    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
                    letterSpacing: 4,
                    textAlign: 'center',
                    paddingVertical: 10,
                  }}
                  placeholderTextColor="#cbd5e1"
                />
                <Text className="text-slate-400 text-xs text-center mt-2">
                  Contoh: B 1234 ABC atau BA 2342 MAS
                </Text>
              </View>
            </View>
          )}

          {/* ── Step 2: Size + Services ─────────────────────────────────── */}
          {step === 2 && (
            <View>
              <Text
                className="text-slate-900 font-extrabold mb-1"
                style={{ fontSize: 20, letterSpacing: -0.5 }}
              >
                Pilih Layanan
              </Text>
              <View
                className="self-start flex-row items-center gap-1.5 px-2.5 py-1 rounded-full mb-5"
                style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}
              >
                <KIcon name="car" size={12} color="#64748b" />
                <Text
                  className="text-slate-700 font-semibold text-xs"
                  style={{ fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 0.5 }}
                >
                  {plate}
                </Text>
              </View>

              {/* Size selector */}
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                Ukuran Kendaraan
              </Text>
              <View className="flex-row gap-2 mb-5">
                {SIZE_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setSize(opt.value)}
                    className="flex-1 items-center py-2.5 rounded-xl"
                    style={{
                      backgroundColor: selectedSize === opt.value ? '#2563eb' : '#f8fafc',
                      borderWidth: 1.5,
                      borderColor: selectedSize === opt.value ? '#2563eb' : '#e2e8f0',
                    }}
                  >
                    <Text
                      className="font-extrabold text-base"
                      style={{ color: selectedSize === opt.value ? '#fff' : '#475569' }}
                    >
                      {opt.label}
                    </Text>
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: '600',
                        color: selectedSize === opt.value ? 'rgba(255,255,255,0.75)' : '#94a3b8',
                        marginTop: 2,
                        textAlign: 'center',
                      }}
                    >
                      {opt.hint}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Services */}
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                Pilih Layanan
              </Text>
              <View className="gap-2">
                {services.map((svc) => {
                  const on = selectedSvc.has(svc.id);
                  return (
                    <TouchableOpacity
                      key={svc.id}
                      onPress={() => toggle(svc.id)}
                      className="flex-row items-center justify-between rounded-2xl px-4 py-3.5"
                      style={{
                        backgroundColor: on ? '#eff6ff' : '#f8fafc',
                        borderWidth: 2,
                        borderColor: on ? '#2563eb' : '#e2e8f0',
                      }}
                    >
                      <View>
                        <Text
                          className="font-semibold text-sm"
                          style={{ color: on ? '#1e293b' : '#334155' }}
                        >
                          {svc.name}
                        </Text>
                        <Text className="text-slate-400 text-xs mt-0.5">
                          {svc.duration_minutes} menit estimasi
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-2.5">
                        <Text
                          className="font-bold text-sm"
                          style={{ color: on ? '#2563eb' : '#64748b' }}
                        >
                          Rp {svc.price.toLocaleString('id-ID')}
                        </Text>
                        <View
                          className="w-5 h-5 rounded-full items-center justify-center"
                          style={{ backgroundColor: on ? '#2563eb' : '#e2e8f0' }}
                        >
                          {on && <Text className="text-white text-xs font-bold">✓</Text>}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── Step 3: Confirmation ────────────────────────────────────── */}
          {step === 3 && (
            <View>
              <Text
                className="text-slate-900 font-extrabold mb-1"
                style={{ fontSize: 20, letterSpacing: -0.5 }}
              >
                Konfirmasi Pesanan
              </Text>
              <Text className="text-slate-500 text-sm mb-5">
                Periksa kembali sebelum submit.
              </Text>

              {/* Summary card */}
              <View
                className="rounded-2xl p-4 mb-4"
                style={{
                  backgroundColor: '#fff',
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  shadowColor: '#0f172a',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.05,
                  shadowRadius: 12,
                  elevation: 2,
                }}
              >
                {/* Plate + size row */}
                <View
                  className="flex-row items-center justify-between pb-3 mb-3"
                  style={{ borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}
                >
                  <View>
                    <Text className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
                      Nomor Plat
                    </Text>
                    <Text
                      className="text-slate-900 font-extrabold"
                      style={{ fontSize: 22, fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace', letterSpacing: 2 }}
                    >
                      {plate.trim().toUpperCase()}
                    </Text>
                  </View>
                  <View
                    className="px-2.5 py-1.5 rounded-xl"
                    style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' }}
                  >
                    <Text className="text-slate-700 font-bold text-sm">
                      Ukuran {selectedSize}
                    </Text>
                  </View>
                </View>

                {/* Service list */}
                {services
                  .filter((s) => selectedSvc.has(s.id))
                  .map((svc) => (
                    <View
                      key={svc.id}
                      className="flex-row justify-between py-1.5"
                      style={{ borderBottomWidth: 1, borderBottomColor: '#f8fafc' }}
                    >
                      <Text className="text-slate-600 text-sm">{svc.name}</Text>
                      <Text className="text-slate-800 text-sm font-medium">
                        Rp {svc.price.toLocaleString('id-ID')}
                      </Text>
                    </View>
                  ))}

                {/* Total */}
                <View className="flex-row justify-between items-baseline mt-3 pt-3"
                  style={{ borderTopWidth: 2, borderTopColor: '#f1f5f9' }}>
                  <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                    Total Estimasi
                  </Text>
                  <Text className="text-slate-900 font-extrabold" style={{ fontSize: 22 }}>
                    Rp {total.toLocaleString('id-ID')}
                  </Text>
                </View>
              </View>

              {/* Notes */}
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                Catatan Tambahan (opsional)
              </Text>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Contoh: ada goresan di kiri depan…"
                multiline
                numberOfLines={2}
                className="border border-slate-200 rounded-xl px-3.5 py-3 text-slate-700 text-sm mb-4"
                style={{ textAlignVertical: 'top', minHeight: 60 }}
                placeholderTextColor="#94a3b8"
              />

              {/* Info note */}
              <View
                className="flex-row gap-2 items-start rounded-xl px-3.5 py-3 mb-2"
                style={{ backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fef3c7' }}
              >
                <Text className="text-amber-600 text-sm mt-0.5">ℹ</Text>
                <Text className="text-amber-700 text-xs leading-relaxed flex-1">
                  Pembayaran dilakukan di kasir setelah kendaraan selesai dicuci.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* ── Navigation buttons ──────────────────────────────────────── */}
        <View
          className="flex-row gap-2.5 px-5 pt-3 pb-8 bg-white"
          style={{ borderTopWidth: 1, borderTopColor: '#f1f5f9' }}
        >
          {step > 1 && (
            <TouchableOpacity
              onPress={() => setStep((s) => s - 1)}
              className="flex-row items-center gap-1.5 px-4 py-3.5 rounded-2xl"
              style={{ borderWidth: 1.5, borderColor: '#e2e8f0', backgroundColor: '#f8fafc' }}
            >
              <Text className="text-slate-600 font-semibold text-sm">‹ Kembali</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => {
              if (step < 3) setStep((s) => s + 1);
              else void handleSubmit();
            }}
            disabled={!canProceed || isSubmitting}
            className="flex-1 py-3.5 rounded-2xl items-center justify-center"
            style={{
              backgroundColor: canProceed && !isSubmitting ? '#2563eb' : '#e2e8f0',
            }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                className="font-bold text-base"
                style={{ color: canProceed ? '#fff' : '#94a3b8' }}
              >
                {step < 3 ? 'Lanjut ›' : '✓ Konfirmasi & Antri'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
