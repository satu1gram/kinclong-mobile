/** @type {import('tailwindcss').Config} */
module.exports = {
  // Daftarkan semua file yang menggunakan Tailwind classes
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Kinclong Brand Colors
        kinclong: {
          DEFAULT: '#1e40af', // Biru utama
          light: '#3b82f6',
          dark: '#1e3a8a',
          accent: '#60a5fa',
        },
      },
    },
  },
  plugins: [],
};
