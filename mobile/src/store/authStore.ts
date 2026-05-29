import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

/**
 * store/authStore.ts - State management autentikasi (Zustand)
 *
 * Mengelola siklus hidup sesi pengguna:
 * - initializeAuth: dipanggil sekali di App.tsx, mendengarkan perubahan auth
 * - signIn / signOut: aksi login/logout
 * - user: profil lengkap dari tabel 'users' Supabase
 *
 * Supabase auth state changes otomatis didengarkan lewat listener,
 * sehingga token refresh & logout di tab lain akan ter-sync.
 */

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  initializeAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  initializeAuth: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        set({ user: profile as User, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }

      // Dengarkan perubahan auth (login, logout, token refresh)
      supabase.auth.onAuthStateChange(async (_event, newSession) => {
        if (newSession?.user) {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', newSession.user.id)
            .single();
          set({ user: profile as User });
        } else {
          set({ user: null });
        }
      });
    } catch {
      set({ isLoading: false, error: 'Gagal memuat sesi. Coba lagi.' });
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // user akan diset oleh onAuthStateChange listener
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login gagal';
      set({ error: message, isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    set({ user: null, isLoading: false });
  },

  clearError: () => set({ error: null }),
}));
