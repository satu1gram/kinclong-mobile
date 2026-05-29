import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../types';

/**
 * lib/authService.ts — MOCK Auth Service (no backend)
 *
 * Implementasi mock auth tanpa Supabase / backend.
 * State user disimpan in-memory + sesi aktif dipersist ke AsyncStorage,
 * sehingga refresh app tetap mempertahankan login.
 *
 * Arsitektur tetap sama: Screen → authStore → authService → (mock store)
 * Saat siap integrasi Supabase, cukup ganti file ini — public API sama.
 *
 * ## Akun demo seed (selalu tersedia)
 * - Email   : demo@kinclong.id
 * - Password: password123
 *
 * Pendaftaran baru langsung "auto-confirmed" (tidak butuh email verification).
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SignUpData {
  email:        string;
  password:     string;
  fullName:     string;
  carwashName:  string;
  phone?:       string;
}

export interface MockSession {
  user:        User;
  accessToken: string;
  expiresAt:   number; // epoch ms
}

type AuthEvent =
  | 'SIGNED_IN'
  | 'SIGNED_OUT'
  | 'TOKEN_REFRESHED'
  | 'INITIAL_SESSION';

type AuthListener = (event: AuthEvent, session: MockSession | null) => void;

interface StoredUser {
  user:     User;
  password: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SESSION_STORAGE_KEY = '@kinclong/auth/session';
const SIMULATED_DELAY_MS  = 350; // simulasi network latency agar UX terasa real

// ─── Helpers ──────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

function randomId(prefix = ''): string {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function makeSession(user: User): MockSession {
  return {
    user,
    accessToken: `mock_${randomId('tok_')}`,
    expiresAt:   Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 hari
  };
}

// ─── In-memory mock DB ────────────────────────────────────────────────────────

const seedUser: User = {
  id:         'demo-user-001',
  email:      'demo@kinclong.id',
  full_name:  'Demo Owner',
  role:       'owner',
  carwash_id: 'demo-carwash-001',
  phone:      '081234567890',
  is_active:  true,
  created_at: '2025-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z',
};

const users = new Map<string, StoredUser>([
  [seedUser.email, { user: seedUser, password: 'password123' }],
]);

let listeners: AuthListener[] = [];

function emit(event: AuthEvent, session: MockSession | null) {
  listeners.forEach((cb) => {
    try { cb(event, session); } catch { /* listener error tidak boleh crash */ }
  });
}

// ─── Auth Service (public API) ────────────────────────────────────────────────

export const authService = {
  /**
   * Login dengan email & password.
   * @throws Error pesan Indonesia jika gagal
   */
  signIn: async (email: string, password: string): Promise<MockSession> => {
    await delay(SIMULATED_DELAY_MS);
    const key = email.trim().toLowerCase();
    const record = users.get(key);

    if (!record || record.password !== password) {
      throw new Error('Email atau kata sandi salah. Periksa kembali dan coba lagi.');
    }
    if (!record.user.is_active) {
      throw new Error('Akun ini telah dinonaktifkan. Hubungi administrator.');
    }

    const session = makeSession(record.user);
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    emit('SIGNED_IN', session);
    return session;
  },

  /**
   * Mock OAuth Google — langsung login dengan akun demo Google fiktif.
   * Akun otomatis di-create jika belum ada.
   */
  signInWithGoogle: async (): Promise<MockSession> => {
    await delay(SIMULATED_DELAY_MS + 300);

    const googleEmail = 'google.demo@kinclong.id';
    let record = users.get(googleEmail);

    if (!record) {
      const newUser: User = {
        id:         randomId('google-'),
        email:      googleEmail,
        full_name:  'Google Demo User',
        role:       'owner',
        carwash_id: randomId('cw-'),
        avatar_url: 'https://lh3.googleusercontent.com/a/default-user',
        is_active:  true,
        created_at: nowIso(),
        updated_at: nowIso(),
      };
      record = { user: newUser, password: '__oauth__' };
      users.set(googleEmail, record);
    }

    const session = makeSession(record.user);
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    emit('SIGNED_IN', session);
    return session;
  },

  /**
   * Daftar akun baru — auto-confirmed (tanpa email verification).
   * @returns session aktif setelah pendaftaran berhasil
   * @throws Error jika email sudah terdaftar
   */
  signUp: async ({
    email, password, fullName, carwashName, phone,
  }: SignUpData): Promise<MockSession> => {
    await delay(SIMULATED_DELAY_MS);
    const key = email.trim().toLowerCase();

    if (users.has(key)) {
      throw new Error('Email sudah terdaftar. Silakan masuk dengan akun yang ada.');
    }
    if (password.length < 8) {
      throw new Error('Kata sandi terlalu lemah. Gunakan minimal 8 karakter.');
    }

    const newUser: User = {
      id:         randomId('user-'),
      email:      key,
      full_name:  fullName.trim(),
      role:       'owner',
      carwash_id: randomId('cw-'),
      phone:      phone?.trim() ?? undefined,
      is_active:  true,
      created_at: nowIso(),
      updated_at: nowIso(),
    };

    users.set(key, { user: newUser, password });

    // Catatan: carwashName akan dipakai saat integrasi DB outlet sesungguhnya.
    void carwashName;

    const session = makeSession(newUser);
    await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    emit('SIGNED_IN', session);
    return session;
  },

  /** Logout — hapus session aktif. */
  signOut: async (): Promise<void> => {
    await delay(150);
    await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
    emit('SIGNED_OUT', null);
  },

  /**
   * Kirim "link" reset password (mock — tidak ada email sungguhan).
   * Selalu sukses jika format email valid.
   */
  resetPassword: async (email: string): Promise<void> => {
    await delay(SIMULATED_DELAY_MS);
    if (!email.includes('@')) {
      throw new Error('Format email tidak valid.');
    }
    // Diam-diam sukses meski email tidak terdaftar (anti enumeration)
  },

  /** Restore sesi dari AsyncStorage. Null = belum login. */
  getSession: async (): Promise<MockSession | null> => {
    try {
      const raw = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const session = JSON.parse(raw) as MockSession;

      if (session.expiresAt < Date.now()) {
        await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  /**
   * Fetch profil lengkap user — di mock impl, sama dengan session.user.
   * Disediakan untuk kompatibilitas API dengan service Supabase masa depan.
   */
  getUserProfile: async (userId: string): Promise<User | null> => {
    for (const { user } of users.values()) {
      if (user.id === userId) return user;
    }
    return null;
  },

  /**
   * Subscribe ke perubahan auth state.
   * @returns object dengan `.data.subscription.unsubscribe()` (Supabase-compat)
   */
  onAuthStateChange: (callback: AuthListener) => {
    listeners.push(callback);
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            listeners = listeners.filter((l) => l !== callback);
          },
        },
      },
    };
  },

  // ── Helpers khusus testing ──────────────────────────────────────
  __test__: {
    /** Reset semua state mock — dipakai di setup test. */
    reset: async () => {
      await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      listeners = [];
      users.clear();
      users.set(seedUser.email, { user: seedUser, password: 'password123' });
    },
    /** Tambah user mock untuk skenario test. */
    addUser: (user: User, password: string) => {
      users.set(user.email.toLowerCase(), { user, password });
    },
    /** Cek apakah listener terpasang. */
    listenerCount: () => listeners.length,
  },
};
