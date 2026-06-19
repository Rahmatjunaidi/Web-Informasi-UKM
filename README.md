<<<<<<< HEAD
# Sistem Informasi Pengelolaan UKM

Fondasi project web untuk Sistem Informasi Pengelolaan Unit Kegiatan Mahasiswa berbasis Next.js 15, TypeScript, Prisma ORM, MySQL, Tailwind CSS, Shadcn UI, dan Auth.js.

Dokumen desain sistem ada di `docs/system-design.md`.

## Stack

- Next.js 15 App Router
- TypeScript
- Prisma ORM
- MySQL
- Tailwind CSS
- Shadcn UI
- Auth.js credentials authentication
- JWT session
- Role Based Access Control

## Role

- `SUPER_ADMIN`
- `ADVISOR`
- `UKM_ADMIN`
- `MEMBER`

## Struktur Utama

```txt
app/                  Next.js App Router
app/api/auth/         Auth.js route handler
components/ui/        Komponen Shadcn UI
config/               Konfigurasi app, role, dan navigasi
lib/auth/             Permission, session helper, dan RBAC
lib/db/               Prisma Client singleton
lib/validators/       Schema validasi input
prisma/               Prisma schema, migrations, dan seed
types/                Type aplikasi dan module augmentation
docs/                 Dokumentasi desain sistem
```

## Setup Lokal

### 1. Install dependency

```bash
npm install
```

### 2. Buat file environment

Salin `.env.example` menjadi `.env`.

```bash
cp .env.example .env
```

Untuk Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 3. Konfigurasi database MySQL

Buat database MySQL:

```sql
CREATE DATABASE ukm_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Sesuaikan `DATABASE_URL` di `.env`.

```env
DATABASE_URL="mysql://root:password@localhost:3306/ukm_management"
```

Format:

```txt
mysql://USER:PASSWORD@HOST:PORT/DATABASE
```

### 4. Konfigurasi Auth.js

Isi `AUTH_SECRET` dengan string acak minimal 32 karakter.

```env
AUTH_SECRET="replace-with-a-long-random-secret"
AUTH_URL="http://localhost:3000"
```

Secret dapat dibuat dengan:

```bash
openssl rand -base64 32
```

Jika OpenSSL tidak tersedia, gunakan generator secret yang aman.

### 5. Generate Prisma Client

```bash
npm run prisma:generate
```

### 6. Jalankan migration

```bash
npm run prisma:migrate -- --name init
```

### 7. Seed data awal

```bash
npm run db:seed
```

Seed membuat role dasar dan akun super admin:

```txt
Email: admin@ukm.local
Password: password
```

Ganti password setelah login pertama pada implementasi fitur user management.

### 8. Jalankan development server

```bash
npm run dev
```

Buka:

```txt
http://localhost:3000
```

## Script

| Script | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan Next.js development server. |
| `npm run build` | Build production. |
| `npm run start` | Menjalankan build production. |
| `npm run lint` | Menjalankan ESLint. |
| `npm run typecheck` | Mengecek TypeScript tanpa emit. |
| `npm run prisma:generate` | Generate Prisma Client. |
| `npm run prisma:migrate` | Membuat dan menjalankan Prisma migration. |
| `npm run prisma:studio` | Membuka Prisma Studio. |
| `npm run db:seed` | Menjalankan seed database. |

## Authentication

Authentication menggunakan Auth.js dengan credentials provider.

File penting:

- `auth.ts`: konfigurasi provider credentials dan validasi password.
- `auth.config.ts`: konfigurasi session dan callback JWT.
- `app/api/auth/[...nextauth]/route.ts`: route handler Auth.js.
- `lib/validators/auth.ts`: validasi input login.

Session memakai strategy `jwt`. Token menyimpan:

- `id`
- `role`
- `status`

User hanya dapat login jika `status = ACTIVE`.

## Role Based Access Control

RBAC dikonfigurasi di:

- `lib/auth/permissions.ts`
- `middleware.ts`
- `lib/auth/session.ts`

Middleware menangani:

- redirect user belum login ke `/login`
- redirect user yang sudah login dari `/login` ke `/dashboard`
- validasi role berdasarkan prefix route

Server helper:

```ts
import { requireRole, requireUser } from "@/lib/auth/session";

const user = await requireUser();
await requireRole(["SUPER_ADMIN"]);
```

## Prisma

Schema database ada di `prisma/schema.prisma` dan mengikuti ERD pada `docs/system-design.md`.

Model utama:

- `Role`
- `User`
- `Student`
- `Advisor`
- `Ukm`
- `UkmMembership`
- `Activity`
- `ActivityParticipant`
- `ActivityApproval`
- `FinanceCategory`
- `FinanceTransaction`
- `FinanceApproval`
- `Announcement`

## Catatan Pengembangan Lanjutan

- Halaman fitur UKM, anggota, kegiatan, keuangan, dan pengumuman belum dibuat.
- Folder modul sudah disiapkan agar implementasi fitur bisa ditambahkan bertahap.
- Untuk production, ganti password seed dan gunakan secret environment yang kuat.
- Untuk upload file bukti transaksi atau logo UKM, gunakan object storage daripada `public/uploads`.
=======
# Web-Informasi-UKM
>>>>>>> c658a6b9f659eb8a720df3e240951db3b91c679a
