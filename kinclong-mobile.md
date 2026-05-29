## Roadmap Eksekusi Prompt untuk Kinclong Mobile App

Berikut adalah roadmap prompt berformat modular untuk digunakan dengan AI Coder. Setiap prompt dirancang untuk fase terpisah dan diakhiri dengan instruksi berhenti yang Anda minta.

---

### Fase 1: Arsitektur & Setup Project
**Tujuan:** Inisialisasi project React Native + TypeScript, setup tools utama, dan struktur folder.

```markdown
Saya ingin membuat aplikasi mobile Kinclong dengan React Native + TypeScript. Buatkan project awal dengan struktur folder yang jelas untuk screens, components, hooks, lib, store, types, dan assets. Sertakan konfigurasi:
- React Navigation
- Supabase client
- i18n dengan react-i18next
- Tailwind/NativeWind atau Styled Components
- Testing dasar dengan Vitest / Jest
- TypeScript config yang support React Native

Buat file utama seperti App.tsx, navigation/RootNavigator.tsx, lib/supabase.ts, dan i18n/i18n.config.ts. Berikan komentar arsitektur singkat di setiap file utama.

Kerjakan fase ini saja. Setelah selesai, berikan ringkasan dan tunggu persetujuan saya sebelum melangkah lebih jauh.
```

---

### Fase 2: Design System & UI Primitives
**Tujuan:** Membangun dasar desain visual dan komponen UI reusable.

```markdown
Bangun design system dasar untuk Kinclong Mobile App. Buat file tema yang berisi:
- warna brand (biru #3B82F6, oranye #F97316, netral putih/abu)
- tipografi
- radius, spacing, shadow

Lalu buat komponen UI dasar:
- Button
- Input
- Card
- TextHeading
- Badge

Komponen harus modular, mudah digunakan, dan siap untuk styling ulang. Sertakan dokumentasi singkat penggunaan dalam komentar.

Kerjakan fase ini saja. Setelah selesai, berikan ringkasan dan tunggu persetujuan saya sebelum melangkah lebih jauh.
```

---

### Fase 3: Auth Flow
**Tujuan:** Implementasi login, register, dan auth guard page.

```markdown
Implementasi halaman auth untuk Kinclong:
- LoginScreen
- RegisterScreen
- AuthStack navigation
- Auth context / store untuk state user
- Supabase auth service untuk login/register/logout

Pastikan:
- validasi email + password
- error handling jelas
- redirect setelah login ke app utama
- proteksi route untuk user yang belum login

Kerjakan fase ini saja. Setelah selesai, berikan ringkasan dan tunggu persetujuan saya sebelum melangkah lebih jauh.
```

---

### Fase 4: Dashboard Owner
**Tujuan:** Membangun layar dashboard dengan ringkasan bisnis.

```markdown
Bangun Dashboard Owner untuk Kinclong:
- card ringkasan omzet
- statistik kendaraan
- grafik sederhana (placeholder)
- greeting dinamis berdasarkan waktu
- layout responsif untuk mobile

Gunakan data dummy dahulu dengan bentuk:
- dailyRevenue
- weeklyRevenue
- totalVehicles
- popularService

Kerjakan fase ini saja. Setelah selesai, berikan ringkasan dan tunggu persetujuan saya sebelum melangkah lebih jauh.
```

---

### Fase 5: Queue & Kiosk
**Tujuan:** Implementasi antrean real-time dasar dan mode kiosk untuk check-in cepat.

```markdown
Buat halaman Queue dan Kiosk:
- QueueScreen: daftar kendaraan dengan status Antri/Dicuci/Selesai/Lunas
- Update status kendaraan
- Search by plate
- KioskScreen: form input plat nomor, pilih layanan, hitung total harga, submit antrian
- Reset form setelah submit

Gunakan mock data untuk sementara dan struktur form yang mudah dihubungkan ke backend nanti.

Kerjakan fase ini saja. Setelah selesai, berikan ringkasan dan tunggu persetujuan saya sebelum melangkah lebih jauh.
```

---

### Fase 6: Vehicle History & Search
**Tujuan:** Membangun layar riwayat kendaraan dan detail kendaraan.

```markdown
Buat fitur Vehicle History:
- VehicleListScreen dengan search by plate
- VehicleDetailScreen menampilkan info kendaraan dan riwayat kunjungan
- filter tanggal dasar
- tampilan history entry dengan layanan, harga, tanggal

Pastikan UI mudah dibaca dan layout data logis.

Kerjakan fase ini saja. Setelah selesai, berikan ringkasan dan tunggu persetujuan saya sebelum melangkah lebih jauh.
```

---

### Fase 7: Service Management
**Tujuan:** Implementasi manajemen layanan dan kategori.

```markdown
Bangun halaman Service Management:
- daftar layanan per kategori
- halaman Add/Edit Service
- fields: nama layanan, harga, durasi, ukuran kendaraan, aktif/non-aktif
- sorting dan kategori

Gunakan state lokal atau store sementara agar fitur siap terhubung ke backend.

Kerjakan fase ini saja. Setelah selesai, berikan ringkasan dan tunggu persetujuan saya sebelum melangkah lebih jauh.
```

---

### Fase 8: Team & Role Management
**Tujuan:** Fiturnya untuk invite staff dan manajemen role.

```markdown
Buat halaman Team Management:
- TeamListScreen menampilkan owner/operator/admin
- invite staff via email
- status invitation pending
- tombol edit role dan hapus member

Pastikan UI role terlihat jelas dan action mudah diakses.

Kerjakan fase ini saja. Setelah selesai, berikan ringkasan dan tunggu persetujuan saya sebelum melangkah lebih jauh.
```

---

### Fase 9: Subscription & Payment Flow
**Tujuan:** Implementasi plan selection dan upload bukti pembayaran.

```markdown
Bangun Subscription screen:
- current plan card
- list paket Free / Starter / Pro
- detail billing cycle dan fitur
- upload bukti pembayaran image
- tampilan status pending

Buat UI copy-able info pembayaran dan form upload image dengan feedback sukses/gagal.

Kerjakan fase ini saja. Setelah selesai, berikan ringkasan dan tunggu persetujuan saya sebelum melangkah lebih jauh.
```

---

### Fase 10: Settings, i18n & Offline Awareness
**Tujuan:** Tambahkan bahasa, setting app, dan indicator offline.

```markdown
Implementasi Settings screen:
- language toggle ID / EN
- logout button
- about app version
- network status indicator

Setup i18n:
- i18n/id.json
- i18n/en.json
- hook useTranslation
- persist language preference

Tambahkan offline awareness dasar dengan indikator status jaringan.

Kerjakan fase ini saja. Setelah selesai, berikan ringkasan dan tunggu persetujuan saya sebelum melangkah lebih jauh.
```

---

### Fase 11: Testing & Polish
**Tujuan:** Tambahkan unit test dan integrasi sederhana.

```markdown
Tambahkan test untuk:
- utilitas form dan validation
- auth flow
- dashboard rendering
- button/input component

Gunakan Vitest atau Jest dengan setup yang sesuai React Native. Pastikan ada contoh test file untuk satu screen dan satu komponen.

Kerjakan fase ini saja. Setelah selesai, berikan ringkasan dan tunggu persetujuan saya sebelum melangkah lebih jauh.
```

---

## Catatan
- Setiap prompt fokus pada satu area utama.
- Jangan gabungkan beberapa fase ke dalam satu langkah besar.
- Gunakan hasil setiap fase sebagai fondasi untuk fase berikutnya.

Jika Anda ingin, saya bisa juga buatkan versi roadmap yang lebih ringkas dengan hanya 6 fase utama.