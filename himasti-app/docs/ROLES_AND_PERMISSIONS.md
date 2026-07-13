# Roles and Permissions

## Super Admin

Memiliki akses penuh:

- seluruh modul CRUD;
- manajemen pengguna;
- manajemen role;
- menentukan admin divisi;
- pengaturan website;
- melihat seluruh data.

## Admin Umum

Dapat mengelola:

- banner;
- profil himpunan;
- berita;
- event;
- dokumentasi umum;
- Instagram post;
- layanan;
- divisi bila diizinkan.

Tidak dapat mengubah role super admin tanpa izin.

## Admin Divisi

Hanya dapat mengelola data divisi yang terhubung melalui `user_divisions`.

Akses admin divisi:

- profil divisinya;
- anggota divisinya;
- program kerja divisinya;
- dokumentasi yang terkait dengan divisinya atau program kerjanya.

Admin divisi tidak boleh:

- mengedit divisi lain;
- mengelola pengguna;
- mengubah pengaturan global;
- mengelola role;
- mengakses data yang tidak berada dalam scope divisinya.

## Authorization

Gunakan middleware, policy, gate, atau mekanisme authorization framework.

Jangan hanya menyembunyikan menu pada frontend. Validasi akses wajib dilakukan juga pada backend.
