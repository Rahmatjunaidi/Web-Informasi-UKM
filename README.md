# Sistem Informasi Pengelolaan UKM UPJ

Sistem Informasi Pengelolaan Unit Kegiatan Mahasiswa (UKM) Universitas Pembangunan Jaya berbasis Next.js 15, TypeScript, Prisma ORM, MySQL, Tailwind CSS, Shadcn UI, dan Auth.js.

Dokumen desain sistem tersedia pada folder `docs/`.

## Teknologi yang Digunakan

* Next.js 15 (App Router)
* TypeScript
* Prisma ORM
* MySQL
* Tailwind CSS
* Shadcn UI
* Auth.js
* JWT Session
* Role Based Access Control (RBAC)

## Role Pengguna

### SUPER_ADMIN

Memiliki akses penuh terhadap seluruh fitur sistem:

* Manajemen UKM
* Manajemen Anggota
* Manajemen Kegiatan
* Manajemen Keuangan
* Manajemen Pengumuman
* Manajemen Website

### MEMBER

Memiliki akses sesuai hak yang diberikan oleh sistem.

## Struktur Project

```txt
app/
components/
config/
lib/
prisma/
public/
types/
docs/
```

## Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/Rahmatjunaidi/Web-Informasi-UKM.git
cd Web-Informasi-UKM
```

### 2. Install Dependency

```bash
npm install
```

### 3. Buat File Environment

Salin file `.env.example` menjadi `.env`

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 4. Konfigurasi Database

Buat database MySQL:

```sql
CREATE DATABASE ukm_management;
```

Kemudian sesuaikan isi file `.env`:

```env
<<<<<<< HEAD
DATABASE_URL=""
AUTH_SECRET=""
AUTH_URL="http://localhost:3000"
=======
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
AUTH_URL="https://portal-ukm-upj.vercel.app"
>>>>>>> 7d254c3 (fix: production url)
```

### 5. Generate Prisma Client

```bash
npm run prisma:generate
```

### 6. Jalankan Migration

```bash
npm run prisma:migrate
```

### 7. Jalankan Seeder

```bash
npm run db:seed
```

### 8. Jalankan Development Server

```bash
npm run dev
```

Akses aplikasi melalui:

```txt
https://portal-ukm-upj.vercel.app
```

## Build Production

```bash
npm run build
npm start
```

## Script

| Script                  | Keterangan                     |
| ----------------------- | ------------------------------ |
| npm run dev             | Menjalankan development server |
| npm run build           | Build production               |
| npm run start           | Menjalankan production server  |
| npm run lint            | Menjalankan ESLint             |
| npm run prisma:generate | Generate Prisma Client         |
| npm run prisma:migrate  | Menjalankan migration database |
| npm run prisma:studio   | Membuka Prisma Studio          |
| npm run db:seed         | Menjalankan seeder database    |

## Modul Sistem

### Dashboard

Menampilkan ringkasan data sistem.

### UKM

* Tambah UKM
* Edit UKM
* Hapus UKM
* Detail UKM

### Anggota

* Tambah Anggota
* Edit Anggota
* Hapus Anggota
* Detail Anggota

### Kegiatan

* Tambah Kegiatan
* Edit Kegiatan
* Hapus Kegiatan
* Detail Kegiatan

### Keuangan

* Pemasukan
* Pengeluaran
* Kategori Keuangan
* Persetujuan Transaksi

### Pengumuman

* Tambah Pengumuman
* Edit Pengumuman
* Hapus Pengumuman

### Website

* Pengaturan Website
* Informasi UKM
* Landing Page

## Authentication

Authentication menggunakan Auth.js dengan Credentials Provider.

Fitur:

* Login
* Register
* Session Management
* JWT Authentication
* Role Based Access Control

## Catatan

* File `.env` tidak boleh diunggah ke GitHub.
* Gunakan `.env.example` sebagai contoh konfigurasi.
* Pastikan database telah dibuat sebelum menjalankan migration.
* Untuk deployment production gunakan secret yang kuat dan aman.

## Developer

Universitas Pembangunan Jaya
Program Studi Informatika
Software Engineering Project

Developed by:

* Rahmat Junaidi Nasution
* Nadia
