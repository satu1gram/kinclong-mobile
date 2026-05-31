import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import KIcon, { KIconName } from './KIcon';
import { ToastConfigParams } from 'react-native-toast-message';

// Type representing custom props that can be passed to Toast.show({ props: { action: 'Retry', onAction: () => {} } })
interface CustomToastProps {
  action?: string;
  onAction?: () => void;
}

const KToastBase = ({ params, type }: { params: ToastConfigParams<CustomToastProps>, type: string }) => {
  // Use text1 for single-line short messages, or combine if necessary.
  const { text1, text2, props } = params;
  const { action, onAction } = props || {};
  
  const msg = text1 || text2 || '';

  const BG: Record<string, string> = {
    success: '#0f172a',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#2563eb',
    loading: '#0f172a',
    action: '#1e293b',
    offline: '#0f172a',
    session: '#5b21b6',
    payment: '#047857',
  };

  const ICON: Record<string, KIconName> = {
    success: 'check-circle',
    error: 'alert',
    warning: 'alert',
    info: 'info',
    loading: 'refresh',
    action: 'trash',
    offline: 'eye-off', // Fallback for wifi-off
    session: 'lock',
    payment: 'cash',
  };

  const isWide = !!action;
  const isLoading = type === 'loading';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: BG[type] || BG.success,
          borderRadius: isWide ? 16 : 999,
          maxWidth: isWide ? 320 : 'auto',
        }
      ]}
    >
      {isLoading ? (
        <View style={styles.iconContainer}>
          <ActivityIndicator size="small" color="#ffffff" />
        </View>
      ) : (
        <View style={styles.iconContainer}>
          <KIcon name={ICON[type] || 'info'} size={14} color="#ffffff" />
        </View>
      )}

      <Text style={styles.text} numberOfLines={isWide ? 2 : 1}>
        {msg}
      </Text>

      {action && (
        <TouchableOpacity onPress={onAction} style={styles.actionBtn}>
          <Text style={styles.actionText}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 5,
    minWidth: 100,
    alignSelf: 'center', // Centers the toast horizontally
  },
  iconContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    flexShrink: 1,
  },
  actionBtn: {
    backgroundColor: '#f97316',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginLeft: 10,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  }
});

export const toastConfig = {
  success: (p: any) => <KToastBase type="success" params={p} />,
  error:   (p: any) => <KToastBase type="error"   params={p} />,
  warning: (p: any) => <KToastBase type="warning" params={p} />,
  info:    (p: any) => <KToastBase type="info"    params={p} />,
  loading: (p: any) => <KToastBase type="loading" params={p} />,
  action:  (p: any) => <KToastBase type="action"  params={p} />,
  offline: (p: any) => <KToastBase type="offline" params={p} />,
  session: (p: any) => <KToastBase type="session" params={p} />,
  payment: (p: any) => <KToastBase type="payment" params={p} />,
};
