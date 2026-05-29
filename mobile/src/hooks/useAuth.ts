import { useAuthStore } from '../store/authStore';
import type { SignUpData } from '../lib/authService';

/**
 * hooks/useAuth.ts — Custom hook untuk mengakses auth state
 *
 * Abstraksi atas authStore dengan tambahan:
 * - Role helper flags: isOwner, isOperator, isKioskUser
 * - isAuthenticated: shortcut untuk !!user
 * - Semua actions dari store
 *
 * Gunakan hook ini di komponen, bukan langsung useAuthStore,
 * agar logic pembantu terpusat dan mudah di-refactor.
 *
 * @example
 * const { user, isOwner, signIn, signOut } = useAuth();
 */
export function useAuth() {
  const {
    user,
    isLoading,
    isInitialized,
    error,
    needsEmailVerification,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    clearError,
  } = useAuthStore();

  return {
    user,
    isLoading,
    isInitialized,
    error,
    needsEmailVerification,

    // ── Computed ─────────────────────────────────────────────
    isAuthenticated: !!user,
    isOwner:         user?.role === 'owner',
    isOperator:      user?.role === 'operator',
    isKioskUser:     user?.role === 'kiosk_user',

    // ── Actions ──────────────────────────────────────────────
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    resetPassword,
    clearError,
  };
}

// Re-export SignUpData so screens don't need to import from lib directly
export type { SignUpData };
