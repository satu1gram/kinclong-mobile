import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import DashboardScreen from '../DashboardScreen';
import { useAuthStore } from '../../../store/authStore';
import { GreetingHeader } from '../../../components/dashboard/GreetingHeader';
import { RevenueCard } from '../../../components/dashboard/RevenueCard';
import { MiniBarChart } from '../../../components/dashboard/MiniBarChart';
import { mockDashboardData } from '../../../lib/mockDashboardData';

/**
 * Tests untuk Phase 4 — Dashboard Owner
 * - GreetingHeader (greeting dinamis)
 * - RevenueCard (featured + non-featured + trend)
 * - MiniBarChart (render 7 bar)
 * - DashboardScreen (integrasi semua komponen)
 */

function renderWithNav(node: React.ReactElement) {
  return render(<NavigationContainer>{node}</NavigationContainer>);
}

// ────────────────────────────────────────────────────────────────────────────
describe('GreetingHeader', () => {
  it('tampilkan nama user', () => {
    const { getByTestId } = render(<GreetingHeader name="Budi Santoso" />);
    expect(getByTestId('greeting-name').props.children).toBe('Budi Santoso');
  });

  it('subtitle muncul jika diberikan', () => {
    const { getByText } = render(
      <GreetingHeader name="Budi" subtitle="Pemilik Outlet Pusat" />
    );
    expect(getByText('Pemilik Outlet Pusat')).toBeTruthy();
  });

  it('jam 9 pagi → render "Selamat Pagi"', () => {
    const now = new Date('2026-02-15T09:00:00');
    const { getByText } = render(<GreetingHeader name="X" now={now} />);
    expect(getByText(/Selamat Pagi/)).toBeTruthy();
  });

  it('jam 20 malam → render "Selamat Malam"', () => {
    const now = new Date('2026-02-15T20:00:00');
    const { getByText } = render(<GreetingHeader name="X" now={now} />);
    expect(getByText(/Selamat Malam/)).toBeTruthy();
  });
});

// ────────────────────────────────────────────────────────────────────────────
describe('RevenueCard', () => {
  it('featured: tampilkan label + value Rupiah', () => {
    const { getByTestId, getByText } = render(
      <RevenueCard
        label="Omzet Hari Ini"
        value={1_850_000}
        featured
        testID="rev-card"
      />
    );
    expect(getByTestId('rev-card')).toBeTruthy();
    expect(getByText('Omzet Hari Ini')).toBeTruthy();
    expect(getByText('Rp 1.850.000')).toBeTruthy();
  });

  it('trend indicator naik (↑) bila value > previous', () => {
    const { getByText } = render(
      <RevenueCard label="X" value={120_000} previous={100_000} featured />
    );
    expect(getByText(/↑ 20\.0%/)).toBeTruthy();
  });

  it('trend indicator turun (↓) bila value < previous', () => {
    const { getByText } = render(
      <RevenueCard label="X" value={80_000} previous={100_000} />
    );
    expect(getByText(/↓ 20\.0%/)).toBeTruthy();
  });

  it('tidak render trend bila previous tidak diberikan', () => {
    const { queryByText } = render(
      <RevenueCard label="X" value={50_000} />
    );
    expect(queryByText(/↑/)).toBeNull();
    expect(queryByText(/↓/)).toBeNull();
  });
});

// ────────────────────────────────────────────────────────────────────────────
describe('MiniBarChart', () => {
  it('render 1 bar per data point', () => {
    const { getByTestId } = render(
      <MiniBarChart data={mockDashboardData.weeklyRevenue} />
    );
    expect(getByTestId('mini-bar-chart')).toBeTruthy();
    // 7 hari → 7 bars
    expect(getByTestId('bar-sen')).toBeTruthy();
    expect(getByTestId('bar-sel')).toBeTruthy();
    expect(getByTestId('bar-rab')).toBeTruthy();
    expect(getByTestId('bar-kam')).toBeTruthy();
    expect(getByTestId('bar-jum')).toBeTruthy();
    expect(getByTestId('bar-sab')).toBeTruthy();
    expect(getByTestId('bar-min')).toBeTruthy();
  });

  it('render label "Pendapatan 7 hari"', () => {
    const { getByText } = render(
      <MiniBarChart data={mockDashboardData.weeklyRevenue} />
    );
    expect(getByText(/Pendapatan 7 hari/)).toBeTruthy();
  });
});

// ────────────────────────────────────────────────────────────────────────────
describe('DashboardScreen', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: {
        id:         'u1',
        email:      'demo@kinclong.id',
        full_name:  'Budi Santoso',
        role:       'owner',
        carwash_id: 'cw1',
        is_active:  true,
        created_at: '2025-01-01',
        updated_at: '2025-01-01',
      },
      isLoading:              false,
      isInitialized:          true,
      error:                  null,
      needsEmailVerification: false,
    });
  });

  it('render screen dengan semua section utama', () => {
    const { getByTestId } = renderWithNav(<DashboardScreen />);
    expect(getByTestId('dashboard-screen')).toBeTruthy();
    expect(getByTestId('greeting-header')).toBeTruthy();
    expect(getByTestId('card-daily-revenue')).toBeTruthy();
    expect(getByTestId('card-total-vehicles')).toBeTruthy();
    expect(getByTestId('card-active-queue')).toBeTruthy();
    expect(getByTestId('card-weekly-chart')).toBeTruthy();
    expect(getByTestId('card-vehicle-breakdown')).toBeTruthy();
    expect(getByTestId('card-popular-service')).toBeTruthy();
  });

  it('tampilkan nama user dari authStore', () => {
    const { getByTestId } = renderWithNav(<DashboardScreen />);
    expect(getByTestId('greeting-name').props.children).toBe('Budi Santoso');
  });

  it('tampilkan nilai omzet hari ini dalam Rupiah', () => {
    const { getByTestId } = renderWithNav(<DashboardScreen />);
    const valueText = getByTestId('card-daily-revenue-value').props.children;
    expect(valueText).toBe('Rp 1.850.000');
  });

  it('tampilkan breakdown 5 jenis kendaraan', () => {
    const { getByTestId } = renderWithNav(<DashboardScreen />);
    expect(getByTestId('vehicle-stat-motor')).toBeTruthy();
    expect(getByTestId('vehicle-stat-mobil')).toBeTruthy();
    expect(getByTestId('vehicle-stat-pickup')).toBeTruthy();
    expect(getByTestId('vehicle-stat-bus')).toBeTruthy();
    expect(getByTestId('vehicle-stat-truk')).toBeTruthy();
  });

  it('tampilkan nama popular service', () => {
    const { getByText } = renderWithNav(<DashboardScreen />);
    expect(getByText('Cuci Mobil Premium')).toBeTruthy();
  });

  it('fallback nama "Pengguna" bila user belum login', () => {
    useAuthStore.setState({ user: null });
    const { getByTestId } = renderWithNav(<DashboardScreen />);
    expect(getByTestId('greeting-name').props.children).toBe('Pengguna');
  });
});
