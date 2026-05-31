# Kinclong · Toast & Notifikasi Design Guide

> Versi 2.0 · Mei 2026 · File referensi: `kl-ds.jsx`, `kl-app.jsx`  
> Panduan visual: `Kinclong Toast Design Guide.html`

---

## Daftar Isi

1. [Prinsip Dasar](#1-prinsip-dasar)
2. [8 Tipe Toast](#2-8-tipe-toast)
3. [Anatomi & Spesifikasi](#3-anatomi--spesifikasi)
4. [Durasi & Timing](#4-durasi--timing)
5. [Posisi & Stacking](#5-posisi--stacking)
6. [Toast Per Konteks Kinclong](#6-toast-per-konteks-kinclong)
7. [Panduan Penulisan Teks](#7-panduan-penulisan-teks)
8. [Do & Don't](#8-do--dont)
9. [Implementasi Kode](#9-implementasi-kode)
10. [Update Log](#10-update-log)

---

## 1. Prinsip Dasar

Toast adalah notifikasi ringan yang muncul sementara untuk memberikan umpan balik terhadap aksi pengguna. Dalam Kinclong, toast mengikuti tiga prinsip:

| Prinsip | Penjelasan |
|---|---|
| **Singkat** | Teks maksimal 5–7 kata. Pengguna tidak boleh perlu membaca ulang. |
| **Kontekstual** | Tipe yang dipilih harus sesuai dengan situasi — jangan gunakan `success` untuk sesuatu yang belum selesai. |
| **Non-blocking** | Toast tidak menghalangi interaksi. Pengguna bisa terus bekerja tanpa menutupnya. |

---

## 2. 8 Tipe Toast

### 01 · Berhasil (`success`)

**Kapan digunakan:** Aksi telah selesai dengan sukses — tambah kendaraan, advance status, simpan layanan, kirim undangan.

| Varian | Background | Teks | Ikon |
|---|---|---|---|
| **Dark** (default) | `#0f172a` (ink900) | `#ffffff` | ✓ lingkaran hijau `#10b981` |
| **Soft** (in-page) | `#ecfdf5` (greenTint) | `#047857` (greenD) | ✓ lingkaran hijau |

**Contoh teks:**
- `Kendaraan ditambahkan ke antrian`
- `Status diperbarui ke Selesai`
- `Layanan berhasil disimpan`
- `Pembayaran diterima`

---

### 02 · Gagal (`error`)

**Kapan digunakan:** Operasi gagal karena error server, validasi form, atau koneksi sementara. Pengguna perlu tahu ada yang salah.

| Varian | Background | Teks | Ikon |
|---|---|---|---|
| **Dark** (default) | `#ef4444` (red) | `#ffffff` | ✕ abu transparan |
| **Soft** (in-page) | `#fef2f2` (redTint) | `#b91c1c` (redD) | ✕ merah |
| **Dengan Retry** | `#ef4444` (red) | `#ffffff` | ✕ + tombol "Coba lagi" |

**Contoh teks:**
- `Gagal menyimpan layanan`
- `Upload foto gagal. Koneksi lemah.`
- `Email sudah terdaftar`
- `Plat kendaraan tidak valid`

---

### 03 · Peringatan (`warning`)

**Kapan digunakan:** Perhatian dibutuhkan tapi bukan error — trial hampir habis, antrian mendekati kapasitas, data akan dihapus permanen.

| Varian | Background | Teks | Ikon |
|---|---|---|---|
| **Dark** (default) | `#f59e0b` (amber) | `#ffffff` | ⚠ abu transparan |
| **Soft** (in-page) | `#fffbeb` (amberTint) | `#b45309` (amberD) | ⚠ amber |
| **Dengan Aksi** | `#f59e0b` (amber) | `#ffffff` | ⚠ + tombol "Upgrade" |

**Contoh teks:**
- `Trial berakhir dalam 3 hari`
- `Antrian sudah 15 kendaraan`
- `Outlet akan dinonaktifkan`

---

### 04 · Informasi (`info`)

**Kapan digunakan:** Konfirmasi netral, panduan kontekstual, update status yang tidak kritikal.

| Varian | Background | Teks | Ikon |
|---|---|---|---|
| **Dark** (default) | `#2563eb` (blueD) | `#ffffff` | ℹ abu transparan |
| **Soft** (in-page) | `#eff6ff` (blueTint) | `#1e40af` (blueDD) | ℹ biru |

**Contoh teks:**
- `Undangan dikirim ke 3 operator`
- `2 operator menunggu konfirmasi`
- `Mode kiosk aktif`

---

### 05 · Memuat (`loading`)

**Kapan digunakan:** Proses async sedang berjalan — ekspor CSV, upload, sinkronisasi data. **Tidak auto-dismiss** — harus diganti secara manual ke `success` atau `error`.

| Varian | Background | Teks | Ikon |
|---|---|---|---|
| **Standard** | `#0f172a` (ink900) | `#ffffff` | ↻ spinner putih |

**Contoh teks:**
- `Mengekspor laporan CSV...`
- `Mengunggah data outlet (67%)`
- `Menyinkronisasi antrian...`

> ⚠ **Penting:** Setelah proses selesai, selalu ganti loading toast ke success atau error. Jangan biarkan spinner berjalan terus.

---

### 06 · Dengan Aksi (`action`)

**Kapan digunakan:** Setelah aksi destruktif atau reversible — hapus layanan, hapus anggota tim. Memberikan jendela waktu untuk membatalkan.

| Varian | Background | Teks | Tombol Aksi |
|---|---|---|---|
| **Undo (Batal)** | `#1e293b` (ink800) | `#ffffff` | "Batalkan" — bg orange |
| **Retry** | `#1e293b` (ink800) | `#ffffff` | "Coba lagi" — bg semi-transparan |

**Contoh teks:**
- `Layanan dihapus` + [Batalkan]
- `Undangan gagal dikirim` + [Retry]
- `Kendaraan dihapus dari antrian` + [Batalkan]

---

### 07 · Koneksi Terputus (`offline`)

**Kapan digunakan:** Jaringan tidak tersedia. **Persistent** — tidak auto-dismiss. Hilang otomatis saat koneksi pulih, langsung diganti oleh toast `success` "Kembali online".

| Varian | Background | Border | Teks | Ikon |
|---|---|---|---|---|
| **Offline** | `#0f172a` (ink900) | `rgba(239,68,68,0.4)` | `rgba(255,255,255,0.85)` | wifi-off merah |
| **Kembali online** | `#0f172a` (ink900) | — | `#ffffff` | wifi hijau |

**Teks standar (tidak boleh diubah):**
- Offline: `Koneksi terputus — mode offline aktif`
- Online: `Koneksi pulih — data tersinkronisasi`

---

### 08 · Sesi Berakhir (`session`)

**Kapan digunakan:** Token expired atau logout paksa dari server. **Persistent + tidak bisa dismiss** — pengguna wajib login ulang.

| Varian | Background | Teks | Tombol |
|---|---|---|---|
| **Session** | `#5b21b6` (purpleD) | `#ffffff` | "Login ulang" — bg semi-transparan |

**Teks standar:**
- `Sesi berakhir` + [Login ulang]

---

## 3. Anatomi & Spesifikasi

```
┌──────────────────────────────────────────────────────┐
│  [●icon]  Pesan singkat dan jelas     [Aksi?] [✕?]  │
│                                                       │
│  ══════════════════════════════ progress bar (3px)   │
└──────────────────────────────────────────────────────┘
```

### Elemen

| # | Elemen | Wajib | Keterangan |
|---|---|---|---|
| ① | **Ikon status** | Ya | Lingkaran 20–22px, ikon SVG 12–14px di dalam |
| ② | **Teks pesan** | Ya | font-size 14px, font-weight 600 |
| ③ | **Tombol aksi** | Opsional | Hanya untuk tipe `action`, `warning` (upgrade), `session` (login ulang) |
| ④ | **Tombol tutup** | Opsional | Hanya untuk toast persistent (loading, offline, session) |
| ⑤ | **Progress bar** | Opsional | 3px di bagian bawah, animasi lebar 100%→0% sesuai durasi |

### Token Visual

| Properti | Nilai |
|---|---|
| Tinggi minimum | `42px` |
| Padding horizontal | `16px` |
| Padding vertikal | `11px` |
| Border radius (pill) | `999px` |
| Border radius (wide) | `16px` |
| Gap antar elemen | `10px` |
| Font size teks | `14px` |
| Font weight teks | `600` |
| Ikon diameter | `20–22px` |
| Ikon SVG size | `12–14px` |
| Progress bar tinggi | `3px` |
| Max width (wide mode) | `320px` |
| Box shadow | `0 8px 28px rgba(0,0,0,0.14)` |
| Z-index | `9999` |
| Animasi masuk | `toastIn 220ms cubic-bezier(.2,.9,.3,1.2)` |
| Animasi keluar | `toastOut 180ms ease` |

---

## 4. Durasi & Timing

| Tipe | Durasi | Alasan |
|---|---|---|
| `success` | **2400ms** | Konfirmasi singkat, pengguna tidak perlu baca lama |
| `info` | **2400ms** | Informasi netral, tidak kritikal |
| `error` | **3500ms** | Pengguna perlu memahami apa yang salah |
| `warning` | **3500ms** | Memberi waktu untuk membaca dan memutuskan |
| `action` | **4000ms** | Pengguna butuh waktu untuk tap "Batalkan" |
| `loading` | **Persistent** | Hilang hanya saat proses selesai (diganti manual) |
| `offline` | **Persistent** | Hilang otomatis saat koneksi pulih |
| `session` | **Persistent** | Tidak bisa di-dismiss sama sekali |

### Progress Bar

Progress bar di bagian bawah toast memvisualisasikan sisa waktu. Lebar beranimasi dari `100%` → `0%` sesuai durasi:

```css
@keyframes toastProgress {
  from { width: 100%; }
  to   { width: 0%; }
}
/* Gunakan animation-duration sesuai durasi tipe */
```

Toast **persistent** tidak menampilkan progress bar.

---

## 5. Posisi & Stacking

### Posisi Default: Top Center

```
Jarak dari atas layar: 62px
(52px safe area dynamic island + 10px gap)

Posisi CSS:
  position: fixed;
  top: 62px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
```

**Digunakan di:** Queue, History, Vehicles, Owner Dashboard, Services, Settings, Subscription, Team, Outlets, Admin, Auth.

### Posisi Alternatif: Bottom Center (Kiosk saja)

```
Jarak dari bawah: 32px

Posisi CSS:
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
```

**Digunakan di:** Kiosk Step 1–3, Kiosk Success screen.

### Stacking (Beberapa Toast Bersamaan)

Saat lebih dari satu toast aktif, toast ditampilkan dalam urutan vertikal dengan efek skala:

| Urutan | Scale | Opacity |
|---|---|---|
| Toast terbaru (atas) | `scale(1)` | `1` |
| Toast ke-2 | `scale(0.96)` | `0.75` |
| Toast ke-3 | `scale(0.92)` | `0.5` |

**Maksimal 3 toast aktif.** Toast ke-4 akan otomatis menghapus toast paling lama.

---

## 6. Toast Per Konteks Kinclong

Daftar lengkap toast yang sudah ditentukan per halaman. Gunakan teks ini persis — jangan improvisasi.

### Halaman: Operator — Queue

| Trigger | Tipe | Teks |
|---|---|---|
| Tap "Mulai Kerjakan" (konfirmasi) | `info` | `Mulai dicuci` |
| Tap "Selesai" (konfirmasi) | `success` | `Selesai dikerjakan!` |
| Tap "Bayar (Cash)" (konfirmasi) | `payment`* | `Pembayaran diterima` |
| Submit form tambah kendaraan | `success` | `Kendaraan ditambahkan ke antrian` |
| Cari plat (tidak ditemukan) | `error` | `Kendaraan tidak ditemukan` |

*`payment` = `success` dark dengan background `DS.greenD`

### Halaman: Kiosk

| Trigger | Tipe | Teks |
|---|---|---|
| Submit konfirmasi step 3 | `info` | `Antrian #[N] dikonfirmasi` |
| Kiosk idle terlalu lama (timeout) | `warning` | `Sesi kiosk akan direset dalam 30 detik` |

### Halaman: Owner — Layanan

| Trigger | Tipe | Teks |
|---|---|---|
| Simpan layanan baru | `success` | `Layanan berhasil ditambahkan` |
| Edit layanan | `success` | `Layanan berhasil diperbarui` |
| Hapus layanan | `action` | `Layanan dihapus` + [Batalkan] |

### Halaman: Owner — Tim

| Trigger | Tipe | Teks |
|---|---|---|
| Kirim undangan | `info` | `Undangan terkirim ke operator` |
| Undangan gagal | `error` | `Undangan gagal dikirim` + [Retry] |
| Hapus anggota | `action` | `Anggota dihapus dari tim` + [Batalkan] |

### Halaman: Owner — Pengaturan

| Trigger | Tipe | Teks |
|---|---|---|
| Simpan profil outlet | `success` | `Pengaturan berhasil disimpan` |
| Toggle PIN operator aktif | `info` | `PIN operator diaktifkan` |

### Halaman: Owner — Langganan (Trial)

| Trigger | Tipe | Teks |
|---|---|---|
| 7 hari sebelum habis | `warning` | `Trial berakhir dalam 7 hari` + [Upgrade] |
| 3 hari sebelum habis | `warning` | `Trial berakhir 3 hari lagi` + [Upgrade] |
| Hari terakhir | `error` | `Trial berakhir hari ini` + [Upgrade sekarang] |

### Halaman: Admin Panel

| Trigger | Tipe | Teks |
|---|---|---|
| Setujui permintaan langganan | `success` | `Langganan tenant diaktifkan` |
| Tolak permintaan | `info` | `Permintaan ditolak` |
| Nonaktifkan tenant | `action` | `Tenant dinonaktifkan` + [Batalkan] |

### Global (semua halaman)

| Trigger | Tipe | Teks |
|---|---|---|
| Koneksi internet terputus | `offline` | `Koneksi terputus — mode offline aktif` |
| Koneksi pulih | `success` | `Koneksi pulih — data tersinkronisasi` |
| Token/sesi expired | `session` | `Sesi berakhir` + [Login ulang] |
| Export CSV selesai | `success` | `Laporan berhasil diunduh` |
| Export CSV gagal | `error` | `Gagal mengekspor laporan` + [Coba lagi] |

---

## 7. Panduan Penulisan Teks

### Struktur Kalimat

```
[Subjek opsional] + [Kata kerja pasif] + [Konteks opsional]

Contoh terbaik:
  ✅ "Kendaraan ditambahkan ke antrian"   (dengan konteks)
  ✅ "Layanan berhasil disimpan"           (singkat)
  ✅ "Pembayaran diterima"                 (minimal, jelas)

Hindari:
  ❌ "Data berhasil tersimpan ke database dengan sukses"  (terlalu panjang)
  ❌ "OK!"                                                 (tidak informatif)
  ❌ "Error 500: Internal Server Error"                   (teknikal)
```

### Nada Bahasa

| Konteks | Nada | Contoh |
|---|---|---|
| Success | Netral, faktual | `Kendaraan ditambahkan ke antrian` |
| Error | Jelas tapi tidak panik | `Gagal menyimpan. Coba lagi.` |
| Warning | Tegas tapi bersahabat | `Trial berakhir 3 hari lagi` |
| Info | Informatif, singkat | `Undangan terkirim` |
| Loading | Progresif | `Mengekspor laporan...` (titik-titik menunjukkan proses) |

### Panjang Maksimum

| Mode | Karakter maks | Kata maks |
|---|---|---|
| Pill (default) | ~40 karakter | 5–6 kata |
| Wide (dengan aksi) | ~60 karakter | 8–9 kata |

---

## 8. Do & Don't

### ✅ Lakukan

- Teks singkat, maksimal 5–7 kata untuk pill, 8–9 kata untuk wide
- Gunakan kata kerja yang jelas — "Ditambahkan", "Diterima", "Dikirim"
- Sertakan konteks objek — "Kendaraan B 1234 ABC ditambahkan"
- Tombol aksi gunakan kata kerja — "Batalkan", "Coba lagi", "Upgrade"
- Pilih tipe yang tepat — sesuaikan severity dengan situasi nyata
- Satu toast per aksi — jangan dobel untuk aksi yang sama
- Ganti loading toast ke success/error setelah proses selesai
- Tampilkan "Kembali online" saat koneksi pulih dari offline

### ❌ Hindari

- Kalimat panjang atau bertele-tele — pengguna tidak akan membacanya
- Toast untuk konfirmasi destruktif — gunakan dialog modal
- Teks teknis seperti kode error atau stack trace
- Gunakan `success` untuk operasi yang belum selesai
- Menumpuk lebih dari 3 toast aktif sekaligus
- Emoji atau ikon berlebihan di dalam teks
- Toast tanpa ikon — ikon adalah isyarat visual pertama yang dilihat
- Auto-dismiss untuk koneksi terputus atau sesi expired

---

## 9. Implementasi Kode

### Komponen `KToast` (kl-ds.jsx)

```jsx
function KToast({ msg, type = 'success', action, onAction }) {
  const BG = {
    success: DS.ink900,    error:   DS.red,
    warning: DS.amber,     info:    DS.blueD,
    loading: DS.ink900,    action:  DS.ink800,
    offline: DS.ink900,    session: DS.purpleD,
    payment: DS.greenD,
  };
  const ICON = {
    success: 'check-circle',  error:   'alert',
    warning: 'alert',         info:    'info',
    loading: 'refresh',       action:  'trash',
    offline: 'wifi-off',      session: 'lock',
    payment: 'cash',
  };
  const isWide = !!action;
  const isLoading = type === 'loading';

  return (
    <div style={{
      position: 'absolute', top: 62, left: '50%', transform: 'translateX(-50%)',
      background: BG[type], color: DS.white,
      padding: '11px 16px', borderRadius: isWide ? 16 : 999,
      fontSize: 14, fontWeight: 600,
      display: 'flex', alignItems: 'center', gap: 10,
      boxShadow: '0 8px 28px rgba(0,0,0,0.14)',
      animation: 'klDown 220ms cubic-bezier(.2,.9,.3,1.2)',
      zIndex: 9999, whiteSpace: isWide ? 'normal' : 'nowrap',
      maxWidth: isWide ? 320 : 'none', minWidth: 0,
      pointerEvents: 'none', overflow: 'hidden',
    }}>
      {isLoading
        ? <div style={{ width: 14, height: 14, borderRadius: '50%',
            border: '2.5px solid rgba(255,255,255,0.25)',
            borderTopColor: DS.white,
            animation: 'klSpin 700ms linear infinite' }} />
        : <div style={{ width: 20, height: 20, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <KIcon n={ICON[type]} size={12} color={DS.white} />
          </div>
      }
      <span style={{ flex: isWide ? 1 : 'none' }}>{msg}</span>
      {action && (
        <button onClick={onAction} style={{
          padding: '4px 10px', borderRadius: 999,
          fontSize: 12, fontWeight: 700,
          background: DS.orange, color: DS.white,
          border: 'none', cursor: 'pointer',
          fontFamily: 'inherit', flexShrink: 0,
        }}>{action}</button>
      )}
    </div>
  );
}
```

### Helper `showToast` (kl-app.jsx)

```js
const TOAST_DURATION = {
  success: 2400, info:    2400,
  error:   3500, warning: 3500,
  action:  4000, payment: 2400,
  loading: 0,    offline: 0,    session: 0,
};

const showToast = useCallback((msg, type = 'success', action, onAction) => {
  setToast({ msg, type, action, onAction });
  const dur = TOAST_DURATION[type] ?? 2400;
  if (dur > 0) setTimeout(() => setToast(null), dur);
}, []);
```

### Penggunaan

```jsx
// Berhasil
showToast('Kendaraan ditambahkan ke antrian');
showToast('Pembayaran diterima', 'payment');

// Gagal
showToast('Gagal menyimpan layanan', 'error');

// Peringatan
showToast('Trial berakhir 3 hari lagi', 'warning', 'Upgrade', () => nav('owner-subscription'));

// Informasi
showToast('Undangan terkirim ke operator', 'info');

// Memuat (persistent — ganti manual setelah selesai)
showToast('Mengekspor laporan CSV...', 'loading');
// ... setelah selesai:
showToast('Laporan berhasil diunduh', 'success');

// Dengan aksi (undo)
showToast('Layanan dihapus', 'action', 'Batalkan', () => restoreService());

// Offline (persistent)
showToast('Koneksi terputus — mode offline aktif', 'offline');

// Sesi berakhir (tidak bisa dismiss)
showToast('Sesi berakhir', 'session', 'Login ulang', () => nav('login'));
```

---

## 10. Update Log

| Tanggal | Versi | Perubahan |
|---|---|---|
| Mei 2026 | v1.0 | Rilis awal — 3 tipe: success, error, info |
| Mei 2026 | v2.0 | Ekspansi ke 8 tipe + panduan lengkap: warning, loading, action, offline, session. Tambah animasi progress bar, stacking rules, teks per konteks Kinclong, kode referensi lengkap. |

---

*Buat referensi visual interaktif, buka `Kinclong Toast Design Guide.html` — semua varian bisa dicoba langsung via tombol demo.*
