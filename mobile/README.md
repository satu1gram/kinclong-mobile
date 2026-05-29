# Kinclong Mobile App

Aplikasi mobile manajemen car wash berbasis **React Native + TypeScript + Expo**.

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React Native (Expo SDK 51) |
| Language | TypeScript (strict) |
| Navigation | React Navigation v6 — Stack + Bottom Tabs |
| Backend/DB | Supabase (Auth, PostgreSQL, Realtime) |
| Styling | NativeWind v4 (Tailwind CSS) |
| State | Zustand v5 |
| i18n | i18next + react-i18next (ID default, EN) |
| Testing | Jest + jest-expo + @testing-library/react-native |

## Struktur Folder

```
mobile/
├── App.tsx                    # Entry point utama
├── global.css                 # NativeWind Tailwind directives
├── app.config.ts              # Expo app configuration
├── babel.config.js            # Babel (NativeWind support)
├── metro.config.js            # Metro bundler (CSS processing)
├── tailwind.config.js         # Kinclong Tailwind theme
├── tsconfig.json              # TypeScript (strict + path aliases)
├── jest.config.js             # Jest configuration
├── jest.setup.ts              # Jest mocks (Supabase, AsyncStorage)
└── src/
    ├── assets/
    │   ├── images/            # Logo, splash, icons
    │   └── fonts/             # Custom fonts (future)
    ├── components/
    │   └── common/            # Button, Card, Input, Loading
    ├── hooks/
    │   ├── useAuth.ts         # Auth state + role helpers
    │   └── useI18n.ts         # Language switch + t()
    ├── i18n/
    │   ├── i18n.config.ts     # i18next setup
    │   └── locales/
    │       ├── id.json        # Bahasa Indonesia (default)
    │       └── en.json        # English
    ├── lib/
    │   └── supabase.ts        # Supabase singleton client
    ├── navigation/
    │   ├── types.ts           # Navigation param types
    │   ├── RootNavigator.tsx  # Auth gating (auth vs main)
    │   ├── AuthNavigator.tsx  # Login, Register stack
    │   └── MainNavigator.tsx  # Bottom tab navigator
    ├── screens/
    │   ├── auth/              # LoginScreen, RegisterScreen
    │   ├── dashboard/         # DashboardScreen
    │   ├── queue/             # QueueScreen (real-time)
    │   ├── services/          # ServicesScreen
    │   ├── reports/           # ReportsScreen
    │   ├── kiosk/             # KioskScreen (touch input)
    │   ├── subscription/      # SubscriptionScreen
    │   └── settings/          # SettingsScreen
    ├── store/
    │   ├── authStore.ts       # Auth state (Zustand)
    │   ├── queueStore.ts      # Queue state (Zustand)
    │   └── index.ts           # Barrel export
    └── types/
        └── index.ts           # Global domain types
```

## Quick Start

### 1. Clone & Install
```bash
cd mobile
yarn install
```

### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env dengan kredensial Supabase Anda
```

### 3. Jalankan
```bash
yarn start        # Expo Go (scan QR)
yarn android      # Android emulator/device
yarn ios          # iOS simulator
```

### 4. Testing
```bash
yarn test              # Run all tests
yarn test:watch        # Watch mode
yarn test:coverage     # Coverage report
yarn typescript        # TypeScript check
```

## User Roles

| Fitur | Owner | Operator | Kiosk |
|---|:---:|:---:|:---:|
| Dashboard | ✅ | ✅ | ❌ |
| Antrean (manage) | ✅ | ✅ | ❌ |
| Antrean (input) | ✅ | ✅ | ✅ |
| Layanan | ✅ | ❌ | ❌ |
| Laporan | ✅ | ❌ | ❌ |
| Pengaturan | ✅ | ✅ (terbatas) | ❌ |
| Subscription | ✅ | ❌ | ❌ |

## Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

Dapatkan dari: **Supabase Dashboard → Project Settings → API**

## Roadmap Fase

| Fase | Fokus | Status |
|---|---|---|
| Phase 1 | Architecture & Setup | ✅ Done |
| Phase 2 | Supabase Auth + Database + Realtime | ⏳ |
| Phase 3 | Core Features (Queue, Services, Reports) | ⏳ |
| Phase 4 | Kiosk Mode + Subscription + Payment | ⏳ |
| Phase 5 | Polish, Analytics & Deployment | ⏳ |
