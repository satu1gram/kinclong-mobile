import type { VehicleType } from '../types';

/**
 * lib/mockDashboardData.ts — Data dummy untuk DashboardScreen (Phase 4)
 *
 * Saat backend siap, ganti dengan fetch dari Supabase / API.
 * Shape stabil — komponen tidak perlu berubah saat data berpindah ke real.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VehicleStat {
  type:  VehicleType;
  label: string;
  count: number;
}

export interface DailyRevenuePoint {
  /** Label hari pendek (Sen, Sel, ...) */
  day:     string;
  /** Tanggal ISO (YYYY-MM-DD) */
  date:    string;
  /** Nominal pendapatan dalam IDR */
  revenue: number;
}

export interface PopularService {
  id:       string;
  name:     string;
  /** Jumlah transaksi 7 hari terakhir */
  count:    number;
  /** Pendapatan dari layanan ini 7 hari terakhir (IDR) */
  revenue:  number;
}

export interface DashboardData {
  /** Pendapatan hari ini (IDR) */
  dailyRevenue:   number;
  /** Pendapatan 7 hari per hari — untuk grafik */
  weeklyRevenue:  DailyRevenuePoint[];
  /** Total kendaraan yang dilayani hari ini (semua jenis) */
  totalVehicles:  number;
  /** Breakdown per jenis kendaraan (hari ini) */
  vehicleStats:   VehicleStat[];
  /** Layanan paling laris 7 hari terakhir */
  popularService: PopularService;
  /** Jumlah antrean status waiting + in_progress saat ini */
  activeQueue:    number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockDashboardData: DashboardData = {
  dailyRevenue:  1_850_000,
  totalVehicles: 42,
  activeQueue:   6,

  weeklyRevenue: [
    { day: 'Sen', date: '2026-02-09', revenue:   980_000 },
    { day: 'Sel', date: '2026-02-10', revenue: 1_240_000 },
    { day: 'Rab', date: '2026-02-11', revenue: 1_575_000 },
    { day: 'Kam', date: '2026-02-12', revenue: 1_320_000 },
    { day: 'Jum', date: '2026-02-13', revenue: 2_100_000 },
    { day: 'Sab', date: '2026-02-14', revenue: 2_650_000 },
    { day: 'Min', date: '2026-02-15', revenue: 1_850_000 },
  ],

  vehicleStats: [
    { type: 'motor',  label: 'Motor',  count: 18 },
    { type: 'mobil',  label: 'Mobil',  count: 19 },
    { type: 'pickup', label: 'Pickup', count:  3 },
    { type: 'bus',    label: 'Bus',    count:  1 },
    { type: 'truk',   label: 'Truk',   count:  1 },
  ],

  popularService: {
    id:      'svc-cuci-mobil-premium',
    name:    'Cuci Mobil Premium',
    count:   76,
    revenue: 5_320_000,
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Format angka ke Rupiah Indonesia (tanpa desimal).
 * @example formatRupiah(1850000) → "Rp 1.850.000"
 */
export function formatRupiah(amount: number): string {
  const rounded = Math.round(amount);
  const str = Math.abs(rounded).toLocaleString('id-ID');
  return `${rounded < 0 ? '-' : ''}Rp ${str}`;
}

/**
 * Format angka kompak untuk axis grafik (k, jt).
 * @example formatCompactIDR(1_850_000) → "1.9jt"; formatCompactIDR(25_000) → "25rb"
 */
export function formatCompactIDR(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}jt`;
  if (amount >= 1_000)     return `${Math.round(amount / 1_000)}rb`;
  return String(amount);
}

/**
 * Greeting dinamis berdasarkan jam (Asia/Jakarta time).
 * - 05–10 → Pagi
 * - 11–14 → Siang
 * - 15–17 → Sore
 * - 18–04 → Malam
 */
export function getTimeBasedGreeting(date: Date = new Date()): {
  greeting: string;
  emoji:    string;
} {
  const hour = date.getHours();
  if (hour >= 5  && hour < 11) return { greeting: 'Selamat Pagi',  emoji: '☀️' };
  if (hour >= 11 && hour < 15) return { greeting: 'Selamat Siang', emoji: '🌤️' };
  if (hour >= 15 && hour < 18) return { greeting: 'Selamat Sore',  emoji: '🌇' };
  return { greeting: 'Selamat Malam', emoji: '🌙' };
}

/** Persentase perubahan vs nilai sebelumnya (untuk trend indicator). */
export function changePercent(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}
