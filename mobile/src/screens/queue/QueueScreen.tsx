import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useQueueStore } from '../../store/queueStore';
import type { QueueStatus } from '../../types';

/**
 * screens/queue/QueueScreen.tsx
 *
 * Manajemen antrean real-time:
 * - List antrean aktif (waiting & in_progress)
 * - Kartu per kendaraan dengan tombol update status
 *
 * TODO Phase 2: Supabase Realtime subscription
 * TODO Phase 2: Modal tambah kendaraan baru
 * TODO Phase 3: Filter & sorting berdasarkan status/waktu
 */

const STATUS_STYLES: Record<QueueStatus, string> = {
  waiting:     'bg-amber-100 text-amber-700',
  in_progress: 'bg-blue-100 text-blue-700',
  done:        'bg-green-100 text-green-700',
  cancelled:   'bg-red-100 text-red-700',
};

export default function QueueScreen() {
  const { t } = useTranslation();
  const { queues } = useQueueStore();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      {/* Header */}
      <View className="bg-white border-b border-slate-100 px-5 py-4 flex-row items-center justify-between">
        <Text className="text-xl font-bold text-slate-800">{t('queue.title')}</Text>
        <Button title={t('queue.add_vehicle')} size="sm" onPress={() => {}} />
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {queues.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Text className="text-5xl mb-3">🚗</Text>
            <Text className="text-slate-500 text-base text-center font-medium">
              {t('queue.empty_queue')}
            </Text>
          </View>
        ) : (
          queues.map((queue) => (
            <Card key={queue.id} padding="md" className="mb-3">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center gap-2">
                  <View className="bg-blue-800 rounded-xl w-10 h-10 items-center justify-center">
                    <Text className="text-white font-bold">{queue.queue_number}</Text>
                  </View>
                  <View>
                    <Text className="font-semibold text-slate-800">{queue.vehicle_plate}</Text>
                    <Text className="text-xs text-slate-500 capitalize">{queue.vehicle_type}</Text>
                  </View>
                </View>
                <View className={`px-2.5 py-1 rounded-full ${STATUS_STYLES[queue.status]}`}>
                  <Text className="text-xs font-semibold">
                    {t(`queue.${queue.status}`)}
                  </Text>
                </View>
              </View>
              <Text className="text-sm text-slate-500 mb-3">
                {queue.services.map((s) => s.service_name).join(' · ')}
              </Text>
              <View className="flex-row justify-between items-center pt-2 border-t border-slate-50">
                <Text className="font-semibold text-blue-800">
                  Rp {queue.total_price.toLocaleString('id-ID')}
                </Text>
                {queue.status !== 'done' && queue.status !== 'cancelled' && (
                  <Button
                    title={
                      queue.status === 'waiting'
                        ? t('queue.start_service')
                        : t('queue.complete_service')
                    }
                    size="sm"
                    onPress={() => {}}
                  />
                )}
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
