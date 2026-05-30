import {
  formatRupiah,
  formatCompactIDR,
  getTimeBasedGreeting,
  changePercent,
  mockDashboardData,
} from '../mockDashboardData';

describe('mockDashboardData helpers (Phase 4)', () => {
  // ── formatRupiah ────────────────────────────────────────────────
  describe('formatRupiah', () => {
    it('format angka standar dengan pemisah titik', () => {
      expect(formatRupiah(1_850_000)).toBe('Rp 1.850.000');
      expect(formatRupiah(0)).toBe('Rp 0');
      expect(formatRupiah(1000)).toBe('Rp 1.000');
    });

    it('membulatkan nilai desimal', () => {
      expect(formatRupiah(1500.7)).toBe('Rp 1.501');
    });

    it('handle nilai negatif', () => {
      expect(formatRupiah(-25_000)).toBe('-Rp 25.000');
    });
  });

  // ── formatCompactIDR ────────────────────────────────────────────
  describe('formatCompactIDR', () => {
    it('format jutaan dengan "jt"', () => {
      expect(formatCompactIDR(1_850_000)).toBe('1.9jt');
      expect(formatCompactIDR(2_000_000)).toBe('2.0jt');
    });

    it('format ribuan dengan "rb"', () => {
      expect(formatCompactIDR(25_000)).toBe('25rb');
      expect(formatCompactIDR(1_000)).toBe('1rb');
    });

    it('angka < 1000 ditampilkan apa adanya', () => {
      expect(formatCompactIDR(750)).toBe('750');
    });
  });

  // ── getTimeBasedGreeting ────────────────────────────────────────
  describe('getTimeBasedGreeting', () => {
    const mk = (h: number) => {
      const d = new Date('2026-02-15T00:00:00');
      d.setHours(h);
      return d;
    };

    it('jam 06:00 → Selamat Pagi', () => {
      expect(getTimeBasedGreeting(mk(6)).greeting).toBe('Selamat Pagi');
    });
    it('jam 12:00 → Selamat Siang', () => {
      expect(getTimeBasedGreeting(mk(12)).greeting).toBe('Selamat Siang');
    });
    it('jam 16:00 → Selamat Sore', () => {
      expect(getTimeBasedGreeting(mk(16)).greeting).toBe('Selamat Sore');
    });
    it('jam 20:00 → Selamat Malam', () => {
      expect(getTimeBasedGreeting(mk(20)).greeting).toBe('Selamat Malam');
    });
    it('jam 02:00 (dini hari) → Selamat Malam', () => {
      expect(getTimeBasedGreeting(mk(2)).greeting).toBe('Selamat Malam');
    });
  });

  // ── changePercent ───────────────────────────────────────────────
  describe('changePercent', () => {
    it('hitung kenaikan persen', () => {
      expect(changePercent(120, 100)).toBe(20);
    });
    it('hitung penurunan persen (negatif)', () => {
      expect(changePercent(80, 100)).toBe(-20);
    });
    it('previous = 0 dengan current > 0 → 100', () => {
      expect(changePercent(50, 0)).toBe(100);
    });
    it('previous = 0 & current = 0 → 0', () => {
      expect(changePercent(0, 0)).toBe(0);
    });
  });

  // ── mockDashboardData shape ────────────────────────────────────
  describe('shape data', () => {
    it('memiliki semua field utama', () => {
      expect(mockDashboardData.dailyRevenue).toBeGreaterThanOrEqual(0);
      expect(mockDashboardData.weeklyRevenue).toHaveLength(7);
      expect(mockDashboardData.totalVehicles).toBeGreaterThanOrEqual(0);
      expect(mockDashboardData.popularService.name).toBeTruthy();
      expect(mockDashboardData.vehicleStats.length).toBeGreaterThan(0);
    });
  });
});
