# Kinclong — Test Credentials

## Mock Auth Service (Phase 3)
Phase 3 menggunakan **mock auth service** (in-memory + AsyncStorage). Tidak ada backend Supabase.
Akun seed berikut selalu tersedia setiap kali app dijalankan ulang.

### Demo Account (seeded)
- **Email**: `demo@kinclong.id`
- **Password**: `password123`
- **Role**: `owner`

### Google OAuth (Mock)
Klik tombol "Masuk dengan Google" / "Daftar dengan Google" untuk auto-login dengan akun:
- **Email**: `google.demo@kinclong.id`
- **Full Name**: `Google Demo User`

### Pendaftaran Baru
Email apapun bisa didaftarkan via `RegisterScreen`. Mock akan auto-confirm (tanpa email verification)
dan otomatis login. Password minimum 8 karakter.

### Catatan untuk Testing
- Mock state direset saat app restart (kecuali sesi tersimpan di AsyncStorage)
- Untuk test programmatik gunakan `authService.__test__.reset()`
