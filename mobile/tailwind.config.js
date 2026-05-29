/**
 * tailwind.config.js — Konfigurasi Tailwind/NativeWind
 *
 * Color palette di sini HARUS sinkron dengan src/theme/colors.ts.
 * Jika menambah warna baru di colors.ts, tambahkan juga di sini
 * agar Tailwind classes (bg-primary-500, text-accent-600, dll) tersedia.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ── Brand Primary: Blue #3B82F6 ─────────────────────────────
        primary: {
          50:      '#EFF6FF',
          100:     '#DBEAFE',
          200:     '#BFDBFE',
          300:     '#93C5FD',
          400:     '#60A5FA',
          500:     '#3B82F6', // Brand Blue — warna utama tombol & aksi
          600:     '#2563EB',
          700:     '#1D4ED8',
          800:     '#1E40AF',
          900:     '#1E3A8A',
          DEFAULT: '#3B82F6',
        },
        // ── Brand Accent: Orange #F97316 ─────────────────────────────
        accent: {
          50:      '#FFF7ED',
          100:     '#FFEDD5',
          200:     '#FED7AA',
          300:     '#FDBA74',
          400:     '#FB923C',
          500:     '#F97316', // Brand Orange — highlight & CTA sekunder
          600:     '#EA580C',
          700:     '#C2410C',
          800:     '#9A3412',
          900:     '#7C2D12',
          DEFAULT: '#F97316',
        },
      },
    },
  },
  plugins: [],
};
