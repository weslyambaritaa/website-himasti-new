# System Architecture

## Pembagian Sistem

Sistem dibagi menjadi dua area utama.

## 1. Public Website

Area publik dapat diakses tanpa autentikasi.

Bagian utamanya:

```text
/
/berita
/berita/{slug}
/event
/event/{slug}
/dokumentasi
/dokumentasi/{slug}
/divisi
/divisi/{slug}
```

Landing page hanya menampilkan data pilihan atau data terbaru. Halaman indeks menampilkan data lengkap dengan pagination.

## 2. Admin Panel

Area admin harus dilindungi middleware autentikasi.

Struktur umum:

```text
/admin/login
/admin/dashboard
/admin/banners
/admin/profile
/admin/news
/admin/events
/admin/divisions
/admin/division-members
/admin/work-programs
/admin/documentations
/admin/instagram-posts
/admin/services
/admin/users
/admin/settings
```

## Aliran Data

```text
Admin Form
↓
Validation
↓
Controller/Service
↓
Model
↓
Database
↓
Public Controller
↓
Landing Page / Public Page
```

## Prinsip Arsitektur

- Gunakan satu tabel `divisions` untuk semua divisi.
- Gunakan satu tabel `division_members` untuk seluruh anggota.
- Gunakan satu tabel `work_programs` untuk seluruh program kerja.
- Gunakan tabel terpisah `documentation_images` agar dokumentasi tidak dibatasi lima gambar.
- Gunakan slug untuk URL publik.
- Gunakan status publish atau aktif untuk menentukan visibilitas konten.
- Gunakan soft delete bila diperlukan.
