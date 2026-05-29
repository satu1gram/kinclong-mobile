# PRD — Kinclong Mobile App

## Problem Statement
Membangun aplikasi mobile manajemen car wash bernama **Kinclong** menggunakan React Native + TypeScript. Memberikan pengalaman mobile yang cepat dan responsif untuk pemilik serta operator car wash dalam mengelola operasional bisnis sehari-hari.

## Architecture (Phase 1 — Completed)
- **Framework**: Expo SDK 51 + React Native 0.74 + TypeScript (strict)
- **Navigation**: React Navigation v6 (Stack + Bottom Tabs)
- **Backend**: Supabase (Auth, PostgreSQL, Realtime) — client configured
- **Styling**: NativeWind v4 (Tailwind CSS for React Native)
- **State Management**: Zustand v5
- **i18n**: i18next + react-i18next (ID default, EN)
- **Testing**: Jest + jest-expo + @testing-library/react-native

## User Personas
- **Owner**: Akses penuh (dashboard, antrean, layanan, laporan, pengaturan, subscription)
- **Operator**: Akses operasional (antrean, dashboard terbatas)
- **Kiosk User**: Input antrean saja (mode kiosk)

## Core Requirements (Static)
1. Manajemen antrean kendaraan real-time
2. Laporan bisnis (harian/mingguan/bulanan)
3. Manajemen layanan & harga
4. Mode Kiosk untuk input cepat
5. Subscription plan & pembayaran
6. Multi-role access (owner/operator/kiosk)
7. Dual language (Bahasa Indonesia & English)

## What's Been Implemented

### Phase 2 — 2026-02 (Design System & UI Primitives) ✅
- **Theme Tokens** di `src/theme/`:
  - `colors.ts`: primary (#3B82F6), accent (#F97316), neutral, semantic (success/warning/error/info)
  - `typography.ts`: fontSize (xs→5xl), fontWeight, lineHeight, letterSpacing, fontFamily
  - `spacing.ts`: 4pt grid scale, borderRadius (none→full), breakpoints
  - `shadows.ts`: none/sm/md/lg/xl — bekerja di iOS & Android
  - `index.ts`: barrel export + `theme` object default export
- **Tailwind config** diperbarui: primary + accent color palette
- **Updated Components** (backward-compatible + enhanced):
  - `Button`: +`accent` variant, +`xs`/`xl` sizes, +`fullWidth`, +`spinnerColor` per variant
  - `Card`: +`outline` variant, +pressable via `onPress` prop (Union type)
  - `Input`: +focus state border, +multiline support, +disabled state, +focus tracking
- **New Components**:
  - `TextHeading`: h1–h4 levels × 5 warna (default/primary/accent/muted/white)
  - `Badge`: 6 variants × 3 sizes × dot indicator
- **Type exports**: semua komponen export interface types-nya
- `/app/mobile/` — React Native project root
- Config files: `package.json`, `tsconfig.json`, `babel.config.js`, `metro.config.js`, `tailwind.config.js`, `jest.config.js`, `app.config.ts`
- **NativeWind v4** setup dengan `global.css` + metro integration
- **Navigation**: `RootNavigator` (auth gating) + `AuthNavigator` (Stack) + `MainNavigator` (Bottom Tabs)
- **Navigation Types**: Type-safe params untuk semua screens
- **Supabase Client**: `lib/supabase.ts` — singleton dengan AsyncStorage persistence
- **i18n**: `i18n.config.ts` + `locales/id.json` + `locales/en.json` (60+ translation keys)
- **Type Definitions**: User, CarWash, QueueItem, Service, Report, Subscription
- **Stores**: `authStore.ts` + `queueStore.ts` (Zustand v5)
- **Custom Hooks**: `useAuth.ts` (role flags) + `useI18n.ts` (language switch)
- **Common Components**: Button (5 varian) + Card (3 varian) + Input + Loading
- **Screens**: Login, Register, Dashboard, Queue, Services, Reports, Kiosk, Subscription, Settings
- **Testing**: 7/7 tests passing (authStore + Button component)

## Prioritized Backlog

### P0 — Phase 2: Supabase Integration
- [ ] Auth: signUp, signIn, password reset via Supabase
- [ ] Database: Schema PostgreSQL (users, carwashes, queues, services)
- [ ] Realtime: Supabase channel untuk queue updates
- [ ] RLS Policies per role

### P1 — Phase 3: Core Features
- [ ] Queue: CRUD antrean + update status real-time
- [ ] Services: CRUD layanan + harga per kendaraan
- [ ] Reports: Aggregated data + filter periode
- [ ] Dashboard: Live stats

### P1 — Phase 4: Advanced Features
- [ ] Kiosk Mode: Submit ke Supabase + tampil nomor antrean
- [ ] Subscription: Payment gateway (Midtrans/Stripe)
- [ ] Team Management: Invite, assign role

### P2 — Phase 5: Polish & Deploy
- [ ] Push Notifications (Expo Notifications)
- [ ] Avatar upload (Supabase Storage)
- [ ] EAS Build + Play Store / App Store
- [ ] Analytics

## Next Tasks
1. Setup database schema Supabase (tables + RLS)
2. Implement auth flow lengkap (signUp + signIn + onboarding)
3. Real-time queue management
