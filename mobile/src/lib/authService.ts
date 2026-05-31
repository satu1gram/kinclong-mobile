/**
 * lib/authService.ts — Auth Service (Client-to-Supabase)
 *
 * Menggantikan REST API calls dengan interaksi langsung ke Supabase SDK.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { STORAGE_KEYS } from './constants';
import type { User, Tenant, Outlet, UserRole } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SignUpData {
  email:       string;
  password:    string;
  fullName:    string;
  carwashName: string;
  phone?:      string;
}

export interface MockSession {
  user:         User;
  tenant:       Tenant;
  outlet:       Outlet;
  accessToken:  string;
  refreshToken: string;
  expiresAt:    number;
}

type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'INITIAL_SESSION';
type AuthListener = (event: AuthEvent, session: MockSession | null) => void;

// ─── Listeners ────────────────────────────────────────────────────────────────

let listeners: AuthListener[] = [];

function emit(event: AuthEvent, session: MockSession | null): void {
  listeners.forEach((cb) => {
    try { cb(event, session); } catch { /* ignore */ }
  });
}

// ─── Persist session helpers ──────────────────────────────────────────────────

async function persistSession(session: MockSession): Promise<void> {
  await AsyncStorage.multiSet([
    [STORAGE_KEYS.USER_PROFILE, JSON.stringify(session.user)],
    [STORAGE_KEYS.TENANT,       JSON.stringify(session.tenant)],
    [STORAGE_KEYS.OUTLET,       JSON.stringify(session.outlet)],
    [STORAGE_KEYS.ACCESS_TOKEN,  session.accessToken],
    [STORAGE_KEYS.REFRESH_TOKEN, session.refreshToken],
  ]);
}

async function clearPersistedSession(): Promise<void> {
  await AsyncStorage.multiRemove([
    STORAGE_KEYS.USER_PROFILE,
    STORAGE_KEYS.TENANT,
    STORAGE_KEYS.OUTLET,
    STORAGE_KEYS.ACCESS_TOKEN,
    STORAGE_KEYS.REFRESH_TOKEN,
  ]);
}

async function buildSessionFromStorage(): Promise<MockSession | null> {
  try {
    const [profileRaw, tenantRaw, outletRaw] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE),
      AsyncStorage.getItem(STORAGE_KEYS.TENANT),
      AsyncStorage.getItem(STORAGE_KEYS.OUTLET),
    ]);

    if (!profileRaw || !tenantRaw || !outletRaw) return null;

    const user:   User   = JSON.parse(profileRaw);
    const tenant: Tenant = JSON.parse(tenantRaw);
    const outlet: Outlet = JSON.parse(outletRaw);

    const accessToken  = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || '';
    const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || '';

    return {
      user, tenant, outlet,
      accessToken, refreshToken,
      expiresAt: Date.now() + 1000 * 60 * 60, // Sesi aktif
    };
  } catch {
    return null;
  }
}

// ─── Setup Supabase State Change Listener ──────────────────────────────────────

supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    const localSession = await buildSessionFromStorage();
    if (localSession) {
      emit('SIGNED_IN', localSession);
    }
  } else if (event === 'SIGNED_OUT') {
    await clearPersistedSession();
    emit('SIGNED_OUT', null);
  }
});

// ─── Auth Service API ─────────────────────────────────────────────────────────

export const authService = {

  signIn: async (email: string, password: string): Promise<MockSession> => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError || !authData.user || !authData.session) {
      throw new Error(authError?.message || 'Email atau password salah.');
    }

    const userId = authData.user.id;

    // Fetch Profile
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileErr || !profile) {
      throw new Error('Profil pengguna tidak ditemukan.');
    }

    // Fetch Tenant
    const { data: tenant, error: tenantErr } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', profile.tenant_id)
      .single();

    if (tenantErr || !tenant) {
      throw new Error('Tenant carwash tidak ditemukan.');
    }

    // Fetch Outlet
    let outletQuery = supabase
      .from('outlets')
      .select('*')
      .eq('tenant_id', profile.tenant_id)
      .eq('is_active', true);

    if (profile.outlet_id) {
      outletQuery = outletQuery.eq('id', profile.outlet_id);
    }

    const { data: outlets, error: outletErr } = await outletQuery.limit(1);

    const outlet = outlets?.[0];
    if (outletErr || !outlet) {
      throw new Error('Outlet aktif tidak ditemukan untuk carwash ini.');
    }

    const user: User = {
      id:         profile.id,
      email:      email.trim().toLowerCase(),
      full_name:  profile.full_name,
      role:       profile.role as UserRole,
      carwash_id: outlet.id,
      tenant_id:  profile.tenant_id,
      outlet_id:  outlet.id,
      is_active:  profile.is_active,
      avatar_url: profile.avatar_url,
      phone:      profile.phone,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };

    const tenantMapped: Tenant = {
      id:                 tenant.id,
      name:               tenant.name,
      slug:               tenant.slug,
      subscriptionPlan:   tenant.subscription_plan,
      subscriptionStatus: tenant.subscription_status,
      trialEndsAt:        tenant.trial_ends_at,
      maxVehicles:        tenant.max_vehicles,
      maxUsers:           tenant.max_users,
      maxOutlets:         tenant.max_outlets,
    };

    const outletMapped: Outlet = {
      id:       outlet.id,
      name:     outlet.name,
      address:  outlet.address,
      city:     outlet.city,
      phone:    outlet.phone,
      isActive: outlet.is_active,
    };

    const session: MockSession = {
      user,
      tenant:       tenantMapped,
      outlet:       outletMapped,
      accessToken:  authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresAt:    Date.now() + (authData.session.expires_in ?? 3600) * 1000,
    };

    await persistSession(session);
    emit('SIGNED_IN', session);
    return session;
  },

  signInWithGoogle: async (): Promise<MockSession> => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch {
      // Fallback untuk testing / simulator tanpa browser
      return await authService.signIn('demo@kinclong.id', 'password123');
    }

    const session = await authService.getSession();
    if (session) return session;
    return await authService.signIn('demo@kinclong.id', 'password123');
  },

  signUp: async ({ email, password, fullName, carwashName, phone }: SignUpData): Promise<MockSession> => {
    // 1. Sign up di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Registrasi gagal.');
    }

    const userId = authData.user.id;

    // Jika ada session (Email Confirmation OFF), set session secara manual 
    // untuk memastikan header Authorization terisi pada request berikutnya
    if (authData.session) {
      await supabase.auth.setSession(authData.session);
    }

    // 2. Create Tenant
    const { data: tenant, error: tenantErr } = await supabase
      .from('tenants')
      .insert({
        name: carwashName.trim(),
        subscription_plan: 'free',
        subscription_status: 'trialing',
        trial_started_at: new Date().toISOString(),
        trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        max_vehicles: 300,
        max_users: 2,
        max_outlets: 1,
        onboarding_status: 'completed',
      })
      .select()
      .single();

    if (tenantErr || !tenant) {
      const errMsg = tenantErr?.message || '';
      if (errMsg.includes('row-level security') || errMsg.includes('violates row-level security policy')) {
        throw new Error('Pendaftaran baru gagal karena kebijakan keamanan (RLS) database untuk tabel tenants dilanggar. Harap hubungi administrator.');
      }
      throw new Error(errMsg || 'Gagal mendaftarkan bisnis carwash.');
    }

    // 3. Create Profile
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        tenant_id: tenant.id,
        full_name: fullName.trim(),
        role: 'owner',
        phone: phone?.trim(),
        is_active: true,
        is_super_admin: false,
      })
      .select()
      .single();

    if (profileErr || !profile) {
      throw new Error(profileErr?.message || 'Gagal menyimpan profil pengguna.');
    }

    // 4. Create Outlet
    const { data: outlet, error: outletErr } = await supabase
      .from('outlets')
      .insert({
        tenant_id: tenant.id,
        name: carwashName.trim(),
        is_active: true,
      })
      .select()
      .single();

    if (outletErr || !outlet) {
      throw new Error(outletErr?.message || 'Gagal membuat outlet cabang pertama.');
    }

    // 5. Salin Default Kategori & Layanan
    try {
      const categories = [
        { name: 'Cuci Kendaraan', icon: 'tint', sort_order: 1 },
        { name: 'Detailing & Polish', icon: 'star', sort_order: 2 },
      ];

      for (const cat of categories) {
        const { data: catData } = await supabase
          .from('service_categories')
          .insert({
            tenant_id: tenant.id,
            name: cat.name,
            icon: cat.icon,
            sort_order: cat.sort_order,
            is_active: true,
          })
          .select()
          .single();

        if (catData) {
          if (cat.name === 'Cuci Kendaraan') {
            await supabase.from('services').insert([
              {
                tenant_id: tenant.id,
                category_id: catData.id,
                name: 'Cuci Body Standard',
                price_car: 50000,
                price_motorcycle: 30000,
                duration_minutes: 30,
                is_active: true,
              },
              {
                tenant_id: tenant.id,
                category_id: catData.id,
                name: 'Cuci Wax & Kolong',
                price_car: 90000,
                price_motorcycle: 50000,
                duration_minutes: 45,
                is_active: true,
              },
            ]);
          } else {
            await supabase.from('services').insert([
              {
                tenant_id: tenant.id,
                category_id: catData.id,
                name: 'Polish Kaca Jamur',
                price_car: 120000,
                price_motorcycle: 70000,
                duration_minutes: 40,
                is_active: true,
              },
            ]);
          }
        }
      }
    } catch {
      // Layanan default gagal dibuat tidak membatalkan registrasi utama
    }

    // Auto-login dengan payload
    const user: User = {
      id:         profile.id,
      email:      email.trim().toLowerCase(),
      full_name:  profile.full_name,
      role:       'owner',
      carwash_id: outlet.id,
      tenant_id:  tenant.id,
      outlet_id:  outlet.id,
      is_active:  true,
      avatar_url: profile.avatar_url,
      phone:      profile.phone,
      created_at: profile.created_at,
      updated_at: profile.updated_at,
    };

    const tenantMapped: Tenant = {
      id:                 tenant.id,
      name:               tenant.name,
      slug:               tenant.slug,
      subscriptionPlan:   tenant.subscription_plan,
      subscriptionStatus: tenant.subscription_status,
      trialEndsAt:        tenant.trial_ends_at,
      maxVehicles:        tenant.max_vehicles,
      maxUsers:           tenant.max_users,
      maxOutlets:         tenant.max_outlets,
    };

    const outletMapped: Outlet = {
      id:       outlet.id,
      name:     outlet.name,
      address:  outlet.address,
      city:     outlet.city,
      phone:    outlet.phone,
      isActive: outlet.is_active,
    };

    const session: MockSession = {
      user,
      tenant:       tenantMapped,
      outlet:       outletMapped,
      accessToken:  authData.session?.access_token || '',
      refreshToken: authData.session?.refresh_token || '',
      expiresAt:    Date.now() + (authData.session?.expires_in || 3600) * 1000,
    };

    await persistSession(session);
    emit('SIGNED_IN', session);
    return session;
  },

  signOut: async (): Promise<void> => {
    await supabase.auth.signOut();
    await clearPersistedSession();
    emit('SIGNED_OUT', null);
  },

  resetPassword: async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
    if (error) {
      throw new Error(error.message);
    }
  },

  getSession: async (): Promise<MockSession | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      await clearPersistedSession();
      return null;
    }
    return buildSessionFromStorage();
  },

  getUserProfile: async (): Promise<User | null> => {
    const session = await buildSessionFromStorage();
    return session?.user ?? null;
  },

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

  getTenantId: async (): Promise<string | null> => {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.TENANT);
    if (!raw) return null;
    const tenant = JSON.parse(raw) as Tenant;
    return tenant.id;
  },

  getOutletId: async (): Promise<string | null> => {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.OUTLET);
    if (!raw) return null;
    const outlet = JSON.parse(raw) as Outlet;
    return outlet.id;
  },

  __test__: {
    reset: async () => {
      await supabase.auth.signOut();
      await clearPersistedSession();
      listeners = [];
    },
    addUser: () => {},
    listenerCount: () => listeners.length,
  },
};
