# PRD — Kinclong Mobile App

## Problem Statement
Membangun aplikasi mobile manajemen car wash bernama **Kinclong** menggunakan React Native + TypeScript. Memberikan pengalaman mobile yang cepat dan responsif untuk pemilik serta operator car wash dalam mengelola operasional bisnis sehari-hari.

## Architecture
- **Framework**: Expo SDK 51 + React Native 0.74 + TypeScript (strict)
- **Navigation**: React Navigation v6 (Stack + Bottom Tabs)
- **Backend (planned)**: Supabase (Auth, PostgreSQL, Realtime)
- **Backend (Phase 3 current)**: **Mock auth service** (in-memory + AsyncStorage) — no network
- **Styling**: NativeWind v4 (Tailwind CSS for React Native)
- **State Management**: Zustand v5
- **i18n**: i18next + react-i18next (ID default, EN)
- **Testing**: Jest + jest-expo + @testing-library/react-native

## User Personas
- **Owner**: Akses penuh (dashboard, antrean, layanan, laporan, pengaturan, subscription)
- **Operator**: Akses operasional (antrean, dashboard terbatas)
- **Kiosk User**: Input antrean saja (mode kiosk)

## Core Requirements
1. Manajemen antrean kendaraan real-time
2. Laporan bisnis (harian/mingguan/bulanan)
3. Manajemen layanan & harga
4. Mode Kiosk untuk input cepat
5. Subscription plan & pembayaran
6. Multi-role access (owner/operator/kiosk)
7. Dual language (Bahasa Indonesia & English)

## What's Been Implemented

### Phase 1 — Setup ✅
- Project root `/app/mobile/`, NativeWind v4 + Metro/Babel + Jest configured
- Navigation: `RootNavigator` (auth gating) + `AuthNavigator` + `MainNavigator`
- i18n: ID + EN locales (60+ keys)
- Type definitions: User, CarWash, QueueItem, Service, Report, Subscription
- Stores: authStore + queueStore (Zustand)

### Phase 2 — Design System ✅
- Theme tokens: colors, typography, spacing, shadows
- Components: Button (6 variants, 5 sizes, fullWidth), Card (3 variants + pressable), Input (focus/multiline/disabled), TextHeading (h1–h4, 5 colors), Badge (6 variants, 3 sizes, dot indicator), Loading
- Tailwind config dengan primary (#3B82F6) + accent (#F97316) palette

### Phase 3 — Auth Flow ✅ (2026-02)
- **Mock auth service** (`lib/authService.ts`):
  - In-memory user store + AsyncStorage session persistence
  - `signIn`, `signUp`, `signOut`, `resetPassword`, `getSession`, `signInWithGoogle`, `onAuthStateChange`
  - Auto-confirms registrations (no email verification)
  - Seed user: `demo@kinclong.id` / `password123`
  - `__test__` helpers untuk reset state di test
- **authStore** (Zustand): user/isLoading/isInitialized/error/needsEmailVerification + actions
- **useAuth hook**: role flags (isOwner/isOperator/isKioskUser) + computed `isAuthenticated`
- **Validation utils** (`utils/validation.ts`): email/password/required/match + form-level helpers
- **Screens**:
  - `LoginScreen`: email/password + demo hint + Google OAuth + error banner + forgot password link
  - `RegisterScreen`: car wash + owner data + password (3 cards) + Google OAuth + error banner
  - `ForgotPasswordScreen`: email reset (mock — selalu sukses untuk format valid)
- **Auth Guard**: `RootNavigator` switch berdasarkan `user` & `isInitialized` (loading state)
- **data-testid** lengkap di semua interactive elements untuk e2e testing
- **Tests**: 64/64 passing (validation, store integration, screen render & interaction)

### Phase 4 — Dashboard Owner ✅ (2026-02)
- **Mock data layer** (`lib/mockDashboardData.ts`):
  - Shape: `dailyRevenue`, `weeklyRevenue[7]`, `totalVehicles`, `popularService`, `vehicleStats[]`, `activeQueue`
  - Helpers: `formatRupiah` (id-ID), `formatCompactIDR` (jt/rb), `getTimeBasedGreeting`, `changePercent`
- **Reusable dashboard components** (`components/dashboard/`):
  - `GreetingHeader` — sapaan dinamis (Pagi/Siang/Sore/Malam) + nama user + subtitle
  - `RevenueCard` — `featured` (accent solid) & default variants + trend indicator (↑↓ %)
  - `MiniBarChart` — pure RN, 7-bar chart (highest bar di-highlight accent), no external chart libs
- **DashboardScreen** rewrite:
  - Greeting header dengan emoji waktu
  - Card omzet hari ini (featured) + trend vs kemarin
  - Quick stats grid (total kendaraan, antrean aktif)
  - Grafik mingguan (7 hari) + total
  - Breakdown jenis kendaraan dengan progress bar
  - Layanan terlaris dengan stats transaksi & pendapatan
  - Pull-to-refresh + layout mobile-friendly (responsif via flex)
- **i18n keys baru**: `welcome_subtitle`, `weekly_revenue`, `total_vehicles`, `active_queue`, `by_vehicle_type`, `popular_service`
- **Tests**: 96/96 passing total (+32 dari Phase 4: helpers, GreetingHeader, RevenueCard, MiniBarChart, DashboardScreen)

## Test Credentials
Lihat `/app/memory/test_credentials.md`.

## Prioritized Backlog

### P1 — Next Phase: Core Features
- [ ] **Queue Management** (Antrean Kendaraan)
  - CRUD antrean + status (waiting → in_progress → done/cancelled)
  - Real-time updates antar device (mocked dulu, Supabase later)
  - Daftar antrean dengan filter & sort
- [ ] **Service & Pricing Management**
  - CRUD layanan (nama, harga per vehicle type, durasi)
  - Active/inactive toggle
- [ ] **Business Reports & Dashboard**
  - Live stats (antrean hari ini, pendapatan, completion rate)
  - Period filter (harian/mingguan/bulanan/tahunan)
  - Breakdown per vehicle type & per service

### P2 — Advanced Features
- [ ] **Kiosk Mode**: Layar input cepat (tanpa bottom tab), nomor antrean otomatis
- [ ] **Subscription Plans**: Free/Basic/Pro/Enterprise + payment (Midtrans/Stripe)
- [ ] **Multi-role / Team Management**: Invite operator, assign role per outlet

### P2 — Real Backend Integration
- [ ] Replace mock auth with Supabase (`lib/supabase.ts` + restore `authService.ts`)
- [ ] PostgreSQL schema (users, carwashes, queues, services, subscriptions)
- [ ] RLS policies per role
- [ ] Realtime channels untuk queue updates

### P3 — Polish & Deploy
- [ ] Onboarding tutorial untuk owner baru
- [ ] Push notifications (Expo Notifications)
- [ ] Offline-first dengan sync queue
- [ ] App icon, splash screen, branding final
- [ ] EAS Build → TestFlight / Play Console

## File Architecture (Current)
```
/app/mobile/
├── App.tsx
├── app.config.ts, babel.config.js, tailwind.config.js, jest.config.js
├── jest.setup.ts (mocks AsyncStorage + url polyfill)
├── src/
│   ├── components/common/  (Button, Card, Input, TextHeading, Badge, Loading)
│   ├── hooks/              (useAuth, useI18n)
│   ├── i18n/               (i18n.config.ts + locales/id.json + en.json)
│   ├── lib/                (authService.ts [mock], supabase.ts [stub])
│   ├── navigation/         (RootNavigator, AuthNavigator, MainNavigator, types.ts)
│   ├── screens/auth/       (Login, Register, ForgotPassword) + __tests__/
│   ├── screens/...         (dashboard, queue, services, reports, kiosk, settings, subscription)
│   ├── store/              (authStore, queueStore)
│   ├── theme/              (colors, typography, spacing, shadows)
│   ├── types/              (index.ts — global domain types)
│   ├── utils/              (validation.ts + __tests__/)
│   └── __tests__/          (auth integration)
```
