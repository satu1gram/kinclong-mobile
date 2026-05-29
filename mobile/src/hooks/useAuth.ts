import { useAuthStore } from '../store/authStore';

/**
 * hooks/useAuth.ts - Custom hook untuk mengakses auth state
 *
 * Abstraksi atas authStore yang menambahkan:
 * - Helper flags: isOwner, isOperator, isKioskUser, isAuthenticated
 * - Semua actions: signIn, signOut, clearError
 *
 * Gunakan hook ini di komponen, bukan langsung useAuthStore,
 * agar perubahan store tidak mempengaruhi komponen secara langsung.
 */
export function useAuth() {
  const { user, isLoading, error, signIn, signOut, clearError } = useAuthStore();

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    isOwner: user?.role === 'owner',
    isOperator: user?.role === 'operator',
    isKioskUser: user?.role === 'kiosk_user',
    signIn,
    signOut,
    clearError,
  };
}
