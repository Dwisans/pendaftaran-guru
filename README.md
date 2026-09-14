# Sistem Pendaftaran Guru (Teacher Recruitment System)

Aplikasi rekrutmen guru untuk English Cafe — monorepo berisi 2 package:

| Package | Path | Teknologi |
|---|---|---|
| Backend (API) | `recruitment-api/` | Laravel 12 + Sanctum + Socialite |
| Frontend (UI) | `recruitment-ui/` | React 19 + Vite 8 + Tailwind v4 |

## Kebutuhan (Prerequisites)

- **PHP** >= 8.2 + Composer
- **Node.js** + npm
- **Database**: MySQL atau SQLite (default Laravel)

## Instalasi

### 1. Langkah otomatis (recommended)

Di direktori `recruitment-api/`:

```bash
composer run setup
```

Perintah ini menjalankan: `composer install` → salin `.env` → generate `APP_KEY` → `migrate` → `npm install` → `npm run build`.

### 2. Langkah manual

**Backend — `recruitment-api/`:**

```bash
composer install
copy .env.example .env        # Windows
# cp .env.example .env        # Linux/macOS
php artisan key:generate
php artisan migrate
php artisan storage:link      # wajib untuk upload dokumen CV/KTP/Sertifikat
php artisan db:seed           # opsional, untuk data contoh
```

**Frontend — `recruitment-ui/`:**

```bash
npm install
```

### 3. Konfigurasi Database

Ubah `.env` di `recruitment-api/` sesuai database yang dipakai.

- **SQLite** (default): buat file `database/database.sqlite`, lalu set `DB_CONNECTION=sqlite`.
- **MySQL**: set `DB_CONNECTION=mysql`, `DB_HOST=127.0.0.1`, `DB_PORT=3307`, `DB_DATABASE=dbrekrutmen_guru`, `DB_USERNAME=`, `DB_PASSWORD=`.

Ubah juga `QUEUE_CONNECTION=database`, `CACHE_STORE=database`, `SESSION_DRIVER=database` agar sesuai project.

## Menjalankan Aplikasi

Jalankan backend + frontend sekaligus dari `recruitment-api/`:

```bash
composer run dev
```

Ini menjalankan secara bersamaan: `php artisan serve` (API di port **8000**), `queue:listen`, `pail` (log), dan Vite dev server (UI di port **5173**).

Atau jalankan terpisah:

```bash
# Terminal 1 — backend
php artisan serve

# Terminal 2 — worker queue
php artisan queue:listen --tries=1 --timeout=0

# Terminal 3 — frontend
npm run dev          # dari direktori recruitment-ui/
```

Akses aplikasi di: **http://localhost:5173**

## Akun Default (dari `db:seed`)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@rekrutmen.com` | `password123` |
| HRD | `hrd@rekrutmen.com` | `password123` |
| Pelamar | `siti@gmail.com` | `password123` |

## Google OAuth (Opsional)

1. Buat Google OAuth credentials di Google Cloud Console.
2. Masukkan di `recruitment-api/.env`:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback
```

## Perintah Berguna

### Backend (`recruitment-api/`)

```bash
composer run test          # jalankan PHPUnit (SQLite :memory:)
./vendor/bin/pint          # format kode PHP
```

### Frontend (`recruitment-ui/`)

```bash
npm run lint               # ESLint
npm run build              # build production
npm run preview            # preview hasil build
```

## Struktur Routes API

| Prefix | Akses | Fungsi |
|---|---|---|
| `/api/branches`, `/api/job-openings` | Public | Data landing page |
| `/api/register`, `/api/login`, `/api/auth/google*` | Public | Autentikasi |
| `/api/me`, `/api/logout` | Login | Session user |
| `/api/admin/*` | ADMIN | Manajemen user/cabang/laporan |
| `/api/hrd/*` | HRD | Manajemen lamaran & lowongan |
| `/api/internal/reports` | ADMIN + HRD | Laporan bersama |
| `/api/applicant/*` | PELAMAR | Dashboard, profil, daftar, dokumen |

## Catatan Penting

- Sebelum melamar, pelamar **wajib upload CV + KTP** terlebih dahulu.
- Dokumen yang diizinkan: `pdf`, `jpg`, `png` (maks 2MB). Jenis: `CV`, `KTP`, `CERTIFICATE`.
- Status lamaran: `Submitted`, `Under Review`, `Interview`, `Accepted`, `Rejected` — hanya status `Submitted` yang bisa dibatalkan.
- CORS hanya mengizinkan `localhost:5173` dan `127.0.0.1:5173`.