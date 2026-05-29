import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import type { SubscriptionPlanDetail } from '../../types';

/**
 * screens/subscription/SubscriptionScreen.tsx
 *
 * Paket langganan Kinclong:
 * - Tampil paket aktif pengguna
 * - Perbandingan fitur antar paket
 * - Tombol upgrade
 *
 * TODO Phase 4: Integrasi payment gateway (Midtrans/Stripe)
 */

const PLANS: SubscriptionPlanDetail[] = [
  {
    plan: 'free',
    name: 'Gratis',
    price_monthly: 0,
    price_yearly: 0,
    features: {
      max_queues_per_day: 20,
      max_services: 5,
      max_team_members: 1,
      has_reports: false,
      has_kiosk_mode: false,
      has_multi_outlet: false,
      has_api_access: false,
    },
  },
  {
    plan: 'basic',
    name: 'Basic',
    price_monthly: 99000,
    price_yearly: 990000,
    features: {
      max_queues_per_day: 100,
      max_services: 20,
      max_team_members: 3,
      has_reports: true,
      has_kiosk_mode: false,
      has_multi_outlet: false,
      has_api_access: false,
    },
  },
  {
    plan: 'pro',
    name: 'Pro',
    price_monthly: 249000,
    price_yearly: 2490000,
    features: {
      max_queues_per_day: -1,
      max_services: -1,
      max_team_members: 10,
      has_reports: true,
      has_kiosk_mode: true,
      has_multi_outlet: false,
      has_api_access: false,
    },
  },
  {
    plan: 'enterprise',
    name: 'Enterprise',
    price_monthly: 0, // Custom pricing
    price_yearly: 0,
    features: {
      max_queues_per_day: -1,
      max_services: -1,
      max_team_members: -1,
      has_reports: true,
      has_kiosk_mode: true,
      has_multi_outlet: true,
      has_api_access: true,
    },
  },
];

export default function SubscriptionScreen() {
  const { t } = useTranslation();

  const formatPrice = (plan: SubscriptionPlanDetail) => {
    if (plan.plan === 'enterprise') return 'Hubungi kami';
    if (plan.price_monthly === 0) return t('subscription.plans.free');
    return `Rp ${plan.price_monthly.toLocaleString('id-ID')}${t('subscription.per_month')}`;
  };

  const formatFeature = (value: number) =>
    value === -1 ? t('subscription.unlimited') : String(value);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="bg-white border-b border-slate-100 px-5 py-4">
        <Text className="text-xl font-bold text-slate-800">{t('subscription.title')}</Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-4">
        {PLANS.map((plan) => (
          <Card
            key={plan.plan}
            padding="md"
            className={`mb-3 border ${
              plan.plan === 'pro' ? 'border-blue-300 bg-blue-50' : 'border-slate-100'
            }`}
          >
            {plan.plan === 'pro' && (
              <View className="bg-blue-800 self-start rounded-full px-2.5 py-0.5 mb-2">
                <Text className="text-white text-xs font-semibold">Populer</Text>
              </View>
            )}
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="text-lg font-bold text-slate-800">
                  {t(`subscription.plans.${plan.plan}`)}
                </Text>
                <Text className="text-blue-800 font-semibold text-sm">
                  {formatPrice(plan)}
                </Text>
              </View>
              <Button
                title={t('subscription.choose_plan')}
                size="sm"
                variant={plan.plan === 'pro' ? 'primary' : 'outline'}
                onPress={() => {}}
              />
            </View>
            <View className="border-t border-slate-100 pt-2 gap-1">
              <Text className="text-xs text-slate-500">
                Antrean/hari: {formatFeature(plan.features.max_queues_per_day)}
              </Text>
              <Text className="text-xs text-slate-500">
                Tim: {formatFeature(plan.features.max_team_members)} anggota
              </Text>
              {plan.features.has_reports && (
                <Text className="text-xs text-green-600">Laporan bisnis</Text>
              )}
              {plan.features.has_kiosk_mode && (
                <Text className="text-xs text-green-600">Mode Kiosk</Text>
              )}
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
