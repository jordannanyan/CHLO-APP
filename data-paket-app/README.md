# DataKu - Aplikasi Pembelian Paket Data Internet

Aplikasi e-commerce berbasis React untuk membeli paket data internet dari berbagai provider di Indonesia.

---

## Cara Menjalankan

### 1. Jalankan JSON Server (Backend Mock)

```bash
npx json-server --watch db.json --port 3001
```

### 2. Jalankan Aplikasi React

```bash
npm run dev
```

Buka browser di `http://localhost:5173`.

### Kredensial Demo

| Field    | Value          |
|----------|----------------|
| Email    | user@demo.com  |
| Password | demo123        |

---

## Struktur Proyek

```
src/
  components/
    ui/               # Komponen UI generik (Button, Badge, Modal, Skeleton, dll)
    layout/           # Navbar dan AppLayout
    PackageCard.tsx   # Kartu paket data
    CheckoutModal.tsx # Modal pembelian 3-langkah
  pages/
    Login/            # Halaman login dengan validasi form
    Dashboard/        # Halaman utama dengan statistik & paket populer
    Packages/         # Daftar paket dengan filter & pagination
    PackageDetail/    # Detail paket individual
    Transactions/     # Riwayat transaksi
  services/
    api.ts            # Konfigurasi Axios
    authService.ts    # Login via JSON Server
    packageService.ts # Ambil & filter paket
    transactionService.ts # Buat & ambil transaksi
  store/
    authStore.ts      # Zustand store untuk autentikasi (persist ke localStorage)
    modalStore.ts     # Zustand store untuk state checkout modal
  types/
    index.ts          # Semua TypeScript interface
  utils/
    format.ts         # formatCurrency (IDR) dan formatDate (id-ID)
  router/
    index.tsx         # React Router v6 dengan protected routes
```

---

## Fitur

- **Autentikasi**: Login dengan validasi form, state persisten via `zustand/middleware/persist`
- **Protected Routes**: Halaman utama hanya bisa diakses setelah login
- **Daftar Paket**: 20 paket dari 5 provider (Telkomsel, Indosat, XL, AXIS, Three)
- **Filter**: Filter berdasarkan provider, rentang harga, rentang kuota
- **Pencarian**: Cari paket berdasarkan nama
- **Pagination**: Tampil 8 paket per halaman
- **Detail Paket**: Halaman detail lengkap dengan benefit list
- **Checkout Modal**: Alur 3 langkah — isi nomor, konfirmasi, sukses
- **Riwayat Transaksi**: Semua transaksi user dengan status badge
- **Loading States**: Skeleton loading di semua halaman
- **Error States**: Pesan error dengan tombol retry

---

## Keputusan Desain

### State Management
- **Zustand** dipilih karena ringan dan tidak memerlukan boilerplate seperti Redux. Auth state di-persist ke `localStorage` sehingga session tetap aktif setelah refresh.
- Modal checkout menggunakan store terpisah (`modalStore`) agar dapat dipanggil dari komponen mana pun (PackageCard, PackageDetailPage) tanpa prop drilling.

### Service Layer
- API call dipisahkan ke service layer (`services/`) agar halaman tetap bersih dan logika fetching mudah diganti/di-mock saat testing.
- `packageService.getPackages()` melakukan filtering di sisi klien karena json-server tidak mendukung `gte`/`lte` secara langsung untuk rentang harga dan kuota.

### Optimistic UI di Checkout
- Saat user mengklik "Bayar Sekarang", state langsung diupdate secara optimistik. Jika API gagal, state di-rollback ke langkah konfirmasi. Ini memberikan feedback instan ke user.

### Race Condition Prevention
- `useRef(isSubmitting)` digunakan di `CheckoutModal` untuk mencegah double-submit jika user mengklik tombol bayar lebih dari sekali sebelum response kembali.

---

## Trade-offs

| Keputusan | Trade-off |
|-----------|-----------|
| Filtering di sisi klien | Lebih mudah diimplementasi dengan json-server, tapi tidak scalable untuk data besar di produksi |
| Persist auth di localStorage | Mudah diimplementasi, tapi kurang aman dibanding httpOnly cookie untuk token JWT di produksi |
| Tidak ada refresh token | Cukup untuk demo, di produksi perlu mekanisme token expiry dan refresh |
| json-server sebagai backend | Cepat untuk prototyping, harus diganti dengan API nyata di produksi |

---

## Tech Stack

| Library | Versi | Kegunaan |
|---------|-------|----------|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 6 | Build tool & dev server |
| Tailwind CSS | v4 | Utility-first styling |
| Zustand | 5 | State management |
| React Router DOM | 6 | Client-side routing |
| Axios | 1 | HTTP client |
| json-server | - | Mock REST API |

## Jawaban Pertanyaan

--- 10.000 ITEM ---

"Jika paket data mencapai 10.000 item, ada dua strategi:

  Pertama, server-side pagination. json-server sebenarnya
  support parameter _page dan _limit — semua filtering dan
  paging dilakukan di server, client hanya terima data
  yang ditampilkan di halaman itu saja.

  Kedua, jika tetap butuh render banyak item sekaligus,
  gunakan virtual scrolling dengan library react-window.
  Hanya DOM element yang terlihat di viewport yang
  di-render — performa tetap smooth meski data ribuan."

--- LAZY LOADING ---

"Perlu lazy loading? Ya, sangat perlu.
Saya merekomendasikan route-based code splitting dengan
React.lazy() dan Suspense.

Halaman Detail dan Checkout tidak perlu di-load saat
user masih di Dashboard. Ini memangkas initial bundle size
dan mempercepat first load secara signifikan."

--- API LAMBAT ---

"Jika API lambat lebih dari 3 detik, ada dua lapisan:
  Pertama, axios timeout saya set ke 10 detik —
  jika lebih dari itu, request otomatis dibatalkan
  dan error state ditampilkan.

  Kedua, skeleton loading muncul selama fetch berlangsung,
  jadi user tidak melihat halaman kosong dan tidak
  merasa app-nya hang."

--- NETWORK FAILURE ---

"Jika network failure, ErrorState component muncul
dengan pesan 'Gagal memuat data. Periksa koneksi Anda.'
dan tombol 'Coba Lagi' yang akan trigger refetch.

Ini saya terapkan konsisten di semua halaman —
Dashboard, Packages, Detail, dan Transactions."

