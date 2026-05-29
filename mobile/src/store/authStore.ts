import { create } from 'zustand';
import { authService, type SignUpData, type MockSession } from '../lib/authService';
import type { User } from '../types';

/**
 * store/authStore.ts — State management autentikasi (Zustand)
 *
 * Arsitektur alur auth:
 * 1. App.tsx → initializeAuth() → restore session + pasang listener
 * 2. isInitialized=false → RootNavigator render Loading
 * 3. isInitialized=true, user=null → AuthNavigator
 * 4. isInitialized=true, user!=null → MainNavigator
 * 5. signIn berhasil → listener SIGNED_IN → set user
 * 6. signOut → SIGNED_OUT → user=null → kembali ke Auth
 *
 * Semua pesan error dalam Bahasa Indonesia (di-handle di authService).
 */

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  user:                   User | null;
  isLoading:              boolean;
  isInitialized:          boolean;
  error:                  string | null;
  needsEmailVerification: boolean;

  // ── Actions ───────────────────────────────────────────────────
  initializeAuth:    () => Promise<void>;
  signIn:            (email: string, password: string) => Promise<void>;
  signInWithGoogle:  () => Promise<void>;
  signUp:            (data: SignUpData) => Promise<void>;
  signOut:           () => Promise<void>;
  resetPassword:     (email: string) => Promise<boolean>;
  clearError:        () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set) => ({
  user:                   null,
  isLoading:              false,
  isInitialized:          false,
  error:                  null,
  needsEmailVerification: false,

  // ── initializeAuth ───────────────────────────────────────────
  initializeAuth: async () => {
    try {
      const session: MockSession | null = await authService.getSession();
      if (session?.user) {
        set({ user: session.user, isInitialized: true });
      } else {
        set({ user: null, isInitialized: true });
      }
    } catch {
      set({ user: null, isInitialized: true });
    }

    // Listener untuk auth state changes
    authService.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        set({ user: session.user, isLoading: false });
      } else if (event === 'SIGNED_OUT') {
        set({ user: null, isLoading: false });
      }
    });
  },

  // ── signIn ───────────────────────────────────────────────────
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await authService.signIn(email, password);
      // user di-set otomatis via listener SIGNED_IN
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login gagal';
      set({ error: message, isLoading: false });
    }
  },

  // ── signInWithGoogle ─────────────────────────────────────────
  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      await authService.signInWithGoogle();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login Google gagal';
      set({ error: message, isLoading: false });
    }
  },

  // ── signUp ───────────────────────────────────────────────────
  signUp: async (data) => {
    set({ isLoading: true, error: null, needsEmailVerification: false });
    try {
      await authService.signUp(data);
      // Mock auto-confirms — user di-set via listener SIGNED_IN
      set({ isLoading: false });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Pendaftaran gagal';
      set({ error: message, isLoading: false });
    }
  },

  // ── signOut ──────────────────────────────────────────────────
  signOut: async () => {
    set({ isLoading: true });
    try {
      await authService.signOut();
      // user=null di-set via listener SIGNED_OUT
      set({ needsEmailVerification: false, error: null });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Logout gagal';
      set({ error: message, isLoading: false });
    }
  },

  // ── resetPassword ────────────────────────────────────────────
  resetPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await authService.resetPassword(email);
      set({ isLoading: false });
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengirim email reset';
      set({ error: message, isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
