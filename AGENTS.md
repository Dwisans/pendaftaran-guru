# AGENTS.md — Teacher Recruitment System (Pendaftaran Guru)

Two-package monorepo: `recruitment-api/` (Laravel 12 API) + `recruitment-ui/` (React 19 + Vite 8 + Tailwind v4).

## Commands

### API (`recruitment-api/`)
```bash
composer run dev          # concurrently: php artisan serve (port 8000) + queue:listen + pail + npm run dev
composer run test         # config:clear then php artisan test (SQLite :memory:)
composer run setup        # composer install + .env copy + key:generate + migrate + npm install + npm build
./vendor/bin/pint         # format PHP code
```

### UI (`recruitment-ui/`)
```bash
npm run dev               # vite dev server on port 5173
npm run build             # vite build
npm run lint              # eslint .
npm run preview           # vite preview
```

## Architecture

- **Roles**: `ADMIN`, `HRD`, `PELAMAR` — stored in `users.role` column, enforced by `RoleMiddleware` (custom, registered as `role` alias in `bootstrap/app.php`).
- **Auth**: Sanctum token-based. Login stores `token` + `user` JSON in localStorage. Axios interceptor attaches `Authorization: Bearer {token}` automatically.
- **API base**: `http://localhost:8000/api` (hardcoded in `src/api/axios.js` and `Sidebar.jsx`).
- **Google OAuth**: Uses `socialiteproviders/google`. Callback at `/api/auth/google/callback` redirects to `http://localhost:5173/login?token=...&user=...`.
- **CORS**: Custom `CorsMiddleware` allows `localhost:5173` and `127.0.0.1:5173` only.
- **CSRF**: All `api/*` routes excluded from CSRF protection.
- **DB**: MySQL on port 3307 (`dbrekrutmen_guru`). Queue, cache, and session all use `database` driver.
- **Documents**: Uploaded to `storage/app/public/documents`, disk=public. Allowed: `pdf,jpg,png`, max 2MB. Types: `CV`, `KTP`, `CERTIFICATE`. `php artisan storage:link` required.

## Route Structure

| Prefix | Middleware | Purpose |
|---|---|---|
| `GET /branches`, `/job-openings` | none | Public landing page data |
| `/register`, `/login`, `/auth/google*` | none | Auth |
| `/me`, `/logout` | `auth:sanctum` | User session |
| `/admin/*` | `auth:sanctum` + `role:ADMIN` | User/branch/report CRUD |
| `/hrd/*` | `auth:sanctum` + `role:HRD` | Application/job management |
| `/internal/reports` | `auth:sanctum` + `role:ADMIN,HRD` | Shared reports |
| `/applicant/*` | `auth:sanctum` + `role:PELAMAR` | Dashboard, profile, apply, documents |

## Key Business Logic

- Registration auto-creates an `Applicant` record (default role `PELAMAR`).
- Applying requires **CV + KTP** documents uploaded first (checked in `ApplicantController::apply`).
- Applications can only be cancelled (deleted) when status is `Submitted`.
- Application statuses: `Submitted`, `Under Review`, `Interview`, `Accepted`, `Rejected`.

## Known Bugs (fix before editing related code)

- `app/Models/Application.php` — `applicant()` has **two `return` statements**; the second shadows the first.
- `app/Models/Applicant.php` — `user()` has **two `return` statements**; same issue.

## Framework Quirks

- **Tailwind v4**: Uses `@import "tailwindcss"` and `@theme` directive in `index.css`. Plugin is `@tailwindcss/vite` for Vite and `@tailwindcss/postcss` for PostCSS. **No `tailwind.config.js`** (v4 is config-free).
- **No TypeScript**: Both packages use plain JS/JSX.
- **No typecheck step**: Only lint (`eslint .`) for UI.
- **PHP code style**: Uses `laravel/pint` (Laravel's opinionated PSR-12 style, run with `./vendor/bin/pint`).

## Dashboard Routes (UI)

| Path | Role |
|---|---|
| `/dashboard` | PELAMAR (Overview) |
| `/dashboard/browse-jobs`, `/dashboard/browse-jobs/:jobId` | PELAMAR |
| `/dashboard/my-applications` | PELAMAR |
| `/dashboard/documents` | PELAMAR (upload CV/KTP/CERTIFICATE) |
| `/dashboard/profile` | PELAMAR |
| `/dashboard/hrd` | HRD |
| `/dashboard/hrd/applications` | HRD |
| `/dashboard/hrd/jobs` | HRD |
| `/dashboard/admin` | ADMIN |
| `/dashboard/admin/users` | ADMIN |
| `/dashboard/admin/branches` | ADMIN |
| `/dashboard/admin/report` | ADMIN |
