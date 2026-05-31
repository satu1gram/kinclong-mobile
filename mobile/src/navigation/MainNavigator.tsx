import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import type { MainTabParamList } from './types';
import DashboardScreen    from '../screens/dashboard/DashboardScreen';
import QueueScreen        from '../screens/queue/QueueScreen';
import ServicesScreen     from '../screens/services/ServicesScreen';
import ReportsScreen      from '../screens/reports/ReportsScreen';
import SettingsScreen     from '../screens/settings/SettingsScreen';
import VehicleListScreen  from '../screens/vehicles/VehicleListScreen';
import TeamListScreen     from '../screens/team/TeamListScreen';
import KIcon              from '../components/common/KIcon';
import type { KIconName } from '../components/common/KIcon';
import { useAuthStore }   from '../store/authStore';
import { useQueueStore }  from '../store/queueStore';

// ─── Visible tab definitions ─────────────────────────────────────────────────

type TabDef = { route: keyof MainTabParamList; icon: KIconName; label: string };

const LEFT_TABS: TabDef[] = [
  { route: 'Queue',   icon: 'queue',   label: 'Antrian'  },
  { route: 'Reports', icon: 'history', label: 'Riwayat'  },
];
const RIGHT_TABS: TabDef[] = [
  { route: 'Vehicles', icon: 'car', label: 'Kendaraan' },
];

// Routes that map to the "More" button highlight
const MORE_ROUTES: (keyof MainTabParamList)[] = ['Dashboard', 'Services', 'Settings', 'Team'];

// ─── More sheet items ─────────────────────────────────────────────────────────

type MoreItem = {
  icon: KIconName;
  label: string;
  sub?: string;
  danger?: boolean;
  action: (nav: any, setOpen: (b: boolean) => void) => void;
};

const MORE_ITEMS: MoreItem[] = [
  {
    icon: 'home', label: 'Dashboard', sub: 'Analitik & laporan',
    action: (nav) => nav.navigate('Dashboard'),
  },
  {
    icon: 'wrench', label: 'Layanan', sub: 'Kelola daftar layanan',
    action: (nav) => nav.navigate('Services'),
  },
  {
    icon: 'users', label: 'Tim & Akses', sub: 'Kelola peran staf',
    action: (nav) => nav.navigate('Team'),
  },
  {
    icon: 'settings', label: 'Pengaturan', sub: 'Outlet & akun',
    action: (nav) => nav.navigate('Settings'),
  },
  {
    icon: 'kiosk', label: 'Mode Kiosk', sub: 'Self-service pelanggan',
    action: (nav) => nav.getParent()?.navigate('Kiosk'),
  },
  {
    icon: 'crown', label: 'Langganan', sub: 'Upgrade plan',
    action: (nav) => nav.getParent()?.navigate('Subscription'),
  },
];

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets             = useSafeAreaInsets();
  const [moreOpen, setMoreOpen] = useState(false);
  const { signOut }        = useAuthStore();
  const { triggerAddForm } = useQueueStore();

  const activeRoute = state.routes[state.index]?.name as keyof MainTabParamList;

  const navigateTo = (route: keyof MainTabParamList) => {
    const target = state.routes.find((r) => r.name === route);
    if (!target) return;
    const event = navigation.emit({
      type: 'tabPress',
      target: target.key,
      canPreventDefault: true,
    });
    if (!event.defaultPrevented) navigation.navigate(route as never);
  };

  const onFab = () => {
    navigateTo('Queue');
    triggerAddForm();
  };

  const openMore = () => setMoreOpen(true);
  const closeMore = () => setMoreOpen(false);

  const handleMoreItem = (item: MoreItem) => {
    closeMore();
    setTimeout(() => item.action(navigation, setMoreOpen), 120);
  };

  const handleLogout = () => {
    closeMore();
    setTimeout(() => signOut(), 120);
  };

  const TabBtn = ({ route, icon, label }: TabDef) => {
    const active = activeRoute === route;
    return (
      <TouchableOpacity
        onPress={() => navigateTo(route)}
        style={styles.tab}
        activeOpacity={0.7}
      >
        <KIcon name={icon} size={24} color={active ? '#2563eb' : '#94a3b8'} />
        <Text style={[styles.tabLabel, { color: active ? '#2563eb' : '#94a3b8' }]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const moreActive = MORE_ROUTES.includes(activeRoute);

  return (
    <>
      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {LEFT_TABS.map((t) => <TabBtn key={t.route} {...t} />)}

        {/* FAB */}
        <View style={styles.fabWrap}>
          <TouchableOpacity onPress={onFab} style={styles.fab} activeOpacity={0.85}>
            <KIcon name="plus" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {RIGHT_TABS.map((t) => <TabBtn key={t.route} {...t} />)}

        {/* More (Lainnya) */}
        <TouchableOpacity onPress={openMore} style={styles.tab} activeOpacity={0.7}>
          <KIcon name="more" size={24} color={moreActive ? '#2563eb' : '#94a3b8'} />
          <Text style={[styles.tabLabel, { color: moreActive ? '#2563eb' : '#94a3b8' }]}>
            Lainnya
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Lainnya Bottom Sheet ─────────────────────────────────────── */}
      <Modal
        visible={moreOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeMore}
      >
        {/* Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          onPress={closeMore}
          activeOpacity={1}
        />

        {/* Sheet */}
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          {/* Handle */}
          <View style={styles.handle} />

          <Text style={styles.sheetTitle}>Menu</Text>

          {/* Main options */}
          {MORE_ITEMS.map((item, i) => (
            <React.Fragment key={item.label}>
              {i === 4 && <View style={styles.divider} />}
              <TouchableOpacity
                onPress={() => handleMoreItem(item)}
                style={styles.sheetRow}
                activeOpacity={0.7}
              >
                <View style={[styles.sheetIconBox, i >= 4 && { backgroundColor: '#eff6ff' }]}>
                  <KIcon name={item.icon} size={19} color={i >= 4 ? '#2563eb' : '#334155'} />
                </View>
                <View style={styles.sheetRowText}>
                  <Text style={styles.sheetRowLabel}>{item.label}</Text>
                  {item.sub ? <Text style={styles.sheetRowSub}>{item.sub}</Text> : null}
                </View>
                <KIcon name="chevron-right" size={16} color="#cbd5e1" />
              </TouchableOpacity>
            </React.Fragment>
          ))}

          <View style={styles.divider} />

          {/* Logout */}
          <TouchableOpacity
            onPress={handleLogout}
            style={[styles.sheetRow, { marginBottom: 4 }]}
            activeOpacity={0.7}
          >
            <View style={[styles.sheetIconBox, { backgroundColor: '#fef2f2' }]}>
              <KIcon name="logout" size={19} color="#ef4444" />
            </View>
            <View style={styles.sheetRowText}>
              <Text style={[styles.sheetRowLabel, { color: '#ef4444' }]}>Keluar dari Akun</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
    paddingTop: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  fabWrap: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -26,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.45)',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingTop: 10,
    paddingHorizontal: 16,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 20,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94a3b8',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 12,
  },
  sheetIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetRowText: {
    flex: 1,
  },
  sheetRowLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1e293b',
  },
  sheetRowSub: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 6,
  },
});

// ─── Navigator ────────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="Queue"
    >
      <Tab.Screen name="Queue"     component={QueueScreen} />
      <Tab.Screen name="Reports"   component={ReportsScreen} />
      <Tab.Screen name="Vehicles"  component={VehicleListScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Services"  component={ServicesScreen} />
      <Tab.Screen name="Settings"  component={SettingsScreen} />
      <Tab.Screen name="Team"      component={TeamListScreen} />
    </Tab.Navigator>
  );
}
