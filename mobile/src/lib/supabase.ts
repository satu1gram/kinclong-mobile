import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

/**
 * lib/supabase.ts - Singleton Supabase client
 *
 * Instance tunggal yang digunakan di seluruh aplikasi.
 * Konfigurasi:
 * - storage: AsyncStorage untuk persistensi session di React Native
 * - autoRefreshToken: true → token diperbarui otomatis sebelum expired
 * - persistSession: true → session tersimpan antar restart app
 * - detectSessionInUrl: false → tidak diperlukan di React Native
 *
 * Environment variables (prefix EXPO_PUBLIC_ agar di-bundle):
 * - EXPO_PUBLIC_SUPABASE_URL: URL project Supabase
 * - EXPO_PUBLIC_SUPABASE_ANON_KEY: Anon (public) key
 */

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[Kinclong] Missing Supabase env vars. Copy .env.example → .env dan isi kredensial.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
