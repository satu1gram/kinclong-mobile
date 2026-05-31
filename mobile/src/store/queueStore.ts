/**
 * store/queueStore.ts — Queue State Management (API-connected)
 *
 * Menggantikan mock data dengan real API calls ke backend Kinclong.
 * Menyediakan polling otomatis setiap 10 detik untuk real-time feel.
 */

import { create } from 'zustand';
import type { QueueItem, QueueStatus } from '../types';
import { queueService } from '../services/queueService';
import { authService } from '../lib/authService';
import { QUEUE_POLL_INTERVAL_MS } from '../lib/constants';

// ─── Types ────────────────────────────────────────────────────────────────────

interface QueueState {
  queues:          QueueItem[];
  isLoading:       boolean;
  isRefreshing:    boolean;
  error:           string | null;
  outletId:        string | null;
  pendingAddForm:  boolean;
  lastFetchedAt:   string | null;

  // ── Actions ───────────────────────────────────────────────────
  /** Inisialisasi store: ambil outletId lalu fetch queue pertama kali. */
  initialize:         () => Promise<void>;
  /** Refresh queue dari server. */
  fetchQueue:         () => Promise<void>;
  /** Tambah kendaraan ke antrian (API + local optimistic update). */
  addQueue:           (partial: Omit<QueueItem, 'id' | 'queue_number' | 'created_at' | 'updated_at'>) => Promise<QueueItem>;
  /** Update status antrian (API + local update). */
  updateQueueStatus:  (id: string, status: QueueStatus) => Promise<void>;
  /** Hapus dari local state (setelah cancel dsb). */
  removeQueue:        (id: string) => void;
  setQueues:          (queues: QueueItem[]) => void;
  clearError:         () => void;
  triggerAddForm:     () => void;
  dismissAddForm:     () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useQueueStore = create<QueueState>((set, get) => ({
  queues:         [],
  isLoading:      false,
  isRefreshing:   false,
  error:          null,
  outletId:       null,
  pendingAddForm: false,
  lastFetchedAt:  null,

  // ── initialize ──────────────────────────────────────────────
  initialize: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });

    try {
      const outletId = await authService.getOutletId();
      if (!outletId) {
        set({ isLoading: false, error: 'Outlet belum dikonfigurasi.' });
        return;
      }
      set({ outletId });
      const queues = await queueService.fetchQueue(outletId);
      set({ queues, isLoading: false, lastFetchedAt: new Date().toISOString() });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat antrian.';
      set({ isLoading: false, error: msg });
    }
  },

  // ── fetchQueue (refresh) ────────────────────────────────────
  fetchQueue: async () => {
    const { outletId } = get();
    if (!outletId) {
      await get().initialize();
      return;
    }

    set({ isRefreshing: true, error: null });
    try {
      const queues = await queueService.fetchQueue(outletId);
      set({ queues, isRefreshing: false, lastFetchedAt: new Date().toISOString() });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat antrian.';
      set({ isRefreshing: false, error: msg });
    }
  },

  // ── addQueue ────────────────────────────────────────────────
  addQueue: async (partial) => {
    const { outletId, queues } = get();
    if (!outletId) throw new Error('Outlet belum dikonfigurasi.');

    // Optimistic: buat item lokal dengan queue_number sementara
    const tempId = `temp_${Date.now()}`;
    const tempItem: QueueItem = {
      ...partial,
      id:           tempId,
      queue_number: (queues.length > 0 ? Math.max(...queues.map((q) => q.queue_number)) : 0) + 1,
      created_at:   new Date().toISOString(),
      updated_at:   new Date().toISOString(),
    };
    set({ queues: [tempItem, ...queues] });

    try {
      // Resolve service IDs dari ServiceItem array
      const serviceIds = partial.services.map((s) => s.service_id);

      const created = await queueService.createVisit(
        outletId,
        undefined,           // vehicleId — akan dicari backend berdasarkan plate
        partial.vehicle_plate,
        partial.vehicle_type,
        partial.brand,
        serviceIds,
        partial.total_price,
        partial.notes,
      );

      // Ganti temp item dengan data real dari server
      set((state) => ({
        queues: state.queues.map((q) => (q.id === tempId ? created : q)),
      }));

      return created;
    } catch (err: unknown) {
      // Rollback optimistic update
      set((state) => ({ queues: state.queues.filter((q) => q.id !== tempId) }));
      throw err;
    }
  },

  // ── updateQueueStatus ────────────────────────────────────────
  updateQueueStatus: async (id, status) => {
    // Optimistic update dulu
    set((state) => ({
      queues: state.queues.map((q) =>
        q.id === id ? { ...q, status, updated_at: new Date().toISOString() } : q
      ),
    }));

    try {
      if (status === 'paid') {
        const queue = get().queues.find((q) => q.id === id);
        await queueService.processPayment(id, 'cash', 0, queue?.total_price ?? 0);
      } else if (status === 'cancelled') {
        await queueService.cancelVisit(id);
      } else {
        await queueService.updateStatus(id, status);
      }
    } catch (err: unknown) {
      // Rollback: reload queue dari server
      await get().fetchQueue();
      throw err;
    }
  },

  // ── removeQueue ──────────────────────────────────────────────
  removeQueue: (id) =>
    set((state) => ({ queues: state.queues.filter((q) => q.id !== id) })),

  setQueues:      (queues) => set({ queues }),
  clearError:     () => set({ error: null }),
  triggerAddForm: () => set({ pendingAddForm: true }),
  dismissAddForm: () => set({ pendingAddForm: false }),
}));

// ─── Polling helper ───────────────────────────────────────────────────────────

let _pollInterval: ReturnType<typeof setInterval> | null = null;

export function startQueuePolling(): void {
  if (_pollInterval) return;
  _pollInterval = setInterval(() => {
    useQueueStore.getState().fetchQueue().catch(() => { /* silent */ });
  }, QUEUE_POLL_INTERVAL_MS);
}

export function stopQueuePolling(): void {
  if (_pollInterval) {
    clearInterval(_pollInterval);
    _pollInterval = null;
  }
}
