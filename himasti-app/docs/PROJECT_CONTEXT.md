# Project Context

## Nama Proyek

Website Himpunan Mahasiswa Informatika Institut Teknologi Del.

## Tujuan

Membangun website resmi himpunan yang berfungsi sebagai pusat informasi organisasi, berita, kegiatan, dokumentasi, divisi, program kerja, dan layanan terkait kampus.

## Pengguna Sistem

### Pengunjung Publik

Pengunjung dapat:

- melihat landing page;
- membaca berita;
- melihat event;
- melihat profil himpunan;
- melihat divisi dan anggota;
- melihat program kerja;
- melihat dokumentasi kegiatan;
- membuka postingan Instagram;
- membuka tautan layanan eksternal.

Pengunjung tidak perlu login.

### Admin

Admin dapat login ke admin panel dan melakukan CRUD terhadap konten website.

Perubahan yang dilakukan admin akan tersimpan ke database dan ditampilkan pada website publik sesuai status aktif atau publish.

## Konsep Utama

```text
Admin login
↓
Admin mengelola konten
↓
Data disimpan ke database
↓
Website publik membaca data aktif
↓
Konten tampil pada landing page atau halaman publik
```

## Scope Awal

Sistem berfokus pada:

- landing page publik;
- halaman publik tambahan;
- autentikasi admin;
- dashboard admin;
- CRUD konten;
- manajemen media/gambar;
- kontrol publish, aktif, shown, dan urutan tampil.

Fitur komunitas, forum, komentar, akun mahasiswa umum, dan sistem keanggotaan belum termasuk scope awal.
