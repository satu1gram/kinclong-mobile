import { create } from 'zustand';
import type { QueueItem, QueueStatus } from '../types';

/**
 * store/queueStore.ts - State management antrean kendaraan (Zustand)
 *
 * Mengelola state antrean lokal dan mendukung update real-time.
 * Pada Phase 2, store ini akan dihubungkan ke Supabase Realtime
 * channel untuk sync antrean lintas device.
 *
 * Pattern:
 * - setQueues: initial load dari Supabase
 * - addQueue: insert baru (dari kiosk / form tambah)
 * - updateQueueStatus: perubahan status (waiting → in_progress → done)
 * - removeQueue: hapus (cancelled/deleted)
 */

interface QueueState {
  queues: QueueItem[];
  activeQueue: QueueItem | null;
  isLoading: boolean;
  error: string | null;

  setQueues: (queues: QueueItem[]) => void;
  addQueue: (queue: QueueItem) => void;
  updateQueueStatus: (id: string, status: QueueStatus) => void;
  removeQueue: (id: string) => void;
  setActiveQueue: (queue: QueueItem | null) => void;
  clearError: () => void;
}

export const useQueueStore = create<QueueState>((set) => ({
  queues: [],
  activeQueue: null,
  isLoading: false,
  error: null,

  setQueues: (queues) => set({ queues }),

  addQueue: (queue) =>
    set((state) => ({ queues: [queue, ...state.queues] })),

  updateQueueStatus: (id, status) =>
    set((state) => ({
      queues: state.queues.map((q) =>
        q.id === id ? { ...q, status, updated_at: new Date().toISOString() } : q
      ),
    })),

  removeQueue: (id) =>
    set((state) => ({ queues: state.queues.filter((q) => q.id !== id) })),

  setActiveQueue: (queue) => set({ activeQueue: queue }),

  clearError: () => set({ error: null }),
}));
