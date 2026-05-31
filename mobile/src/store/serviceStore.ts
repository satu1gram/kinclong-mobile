/**
 * store/serviceStore.ts — Service State Management (API-connected)
 *
 * Menggantikan MOCK_SERVICES dengan real API calls.
 * Mendukung fetch saat initialize + optimistic local updates.
 */

import { create } from 'zustand';
import type { Service } from '../types';
import { serviceApiService } from '../services/serviceApiService';
import { authService } from '../lib/authService';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ServiceState {
  services:   Service[];
  isLoading:  boolean;
  error:      string | null;
  tenantId:   string | null;

  initialize:       () => Promise<void>;
  fetchServices:    () => Promise<void>;
  setServices:      (services: Service[]) => void;
  addService:       (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateService:    (id: string, updates: Partial<Service>) => Promise<void>;
  deleteService:    (id: string) => Promise<void>;
  toggleServiceStatus: (id: string) => Promise<void>;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useServiceStore = create<ServiceState>((set, get) => ({
  services:  [],
  isLoading: false,
  error:     null,
  tenantId:  null,

  // ── initialize ──────────────────────────────────────────────
  initialize: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });

    try {
      const tenantId = await authService.getTenantId();
      if (!tenantId) {
        set({ isLoading: false, error: 'Tenant belum dikonfigurasi.' });
        return;
      }
      set({ tenantId });
      const services = await serviceApiService.fetchServices(tenantId);
      set({ services, isLoading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat layanan.';
      set({ isLoading: false, error: msg });
    }
  },

  // ── fetchServices ────────────────────────────────────────────
  fetchServices: async () => {
    const { tenantId } = get();
    if (!tenantId) { await get().initialize(); return; }

    set({ isLoading: true, error: null });
    try {
      const services = await serviceApiService.fetchServices(tenantId);
      set({ services, isLoading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat layanan.';
      set({ isLoading: false, error: msg });
    }
  },

  setServices: (services) => set({ services }),

  // ── addService ───────────────────────────────────────────────
  addService: async (partial) => {
    const { tenantId } = get();
    if (!tenantId) throw new Error('Tenant belum dikonfigurasi.');

    // Optimistic
    const tempId = `temp_${Date.now()}`;
    const temp: Service = {
      ...partial,
      id:         tempId,
      carwash_id: tenantId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    set((s) => ({ services: [...s.services, temp] }));

    try {
      const created = await serviceApiService.createService(tenantId, partial);
      set((s) => ({ services: s.services.map((sv) => (sv.id === tempId ? created : sv)) }));
    } catch (err) {
      set((s) => ({ services: s.services.filter((sv) => sv.id !== tempId) }));
      throw err;
    }
  },

  // ── updateService ────────────────────────────────────────────
  updateService: async (id, updates) => {
    const { tenantId, services } = get();
    if (!tenantId) throw new Error('Tenant belum dikonfigurasi.');

    // Optimistic
    set((s) => ({
      services: s.services.map((sv) =>
        sv.id === id ? { ...sv, ...updates, updated_at: new Date().toISOString() } : sv
      ),
    }));

    try {
      await serviceApiService.updateService(tenantId, id, updates);
    } catch (err) {
      // Rollback
      set({ services });
      throw err;
    }
  },

  // ── deleteService ────────────────────────────────────────────
  deleteService: async (id) => {
    const { services } = get();

    // Optimistic removal
    set((s) => ({ services: s.services.filter((sv) => sv.id !== id) }));

    try {
      await serviceApiService.deleteService(id);
    } catch (err) {
      set({ services });
      throw err;
    }
  },

  // ── toggleServiceStatus ──────────────────────────────────────
  toggleServiceStatus: async (id) => {
    // Optimistic
    set((s) => ({
      services: s.services.map((sv) =>
        sv.id === id ? { ...sv, is_active: !sv.is_active, updated_at: new Date().toISOString() } : sv
      ),
    }));

    try {
      await serviceApiService.toggleServiceActive(id);
    } catch (err) {
      // Rollback: toggle kembali
      set((s) => ({
        services: s.services.map((sv) =>
          sv.id === id ? { ...sv, is_active: !sv.is_active } : sv
        ),
      }));
      throw err;
    }
  },
}));
