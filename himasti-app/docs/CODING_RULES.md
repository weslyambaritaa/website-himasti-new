# Coding Rules

## General

- Baca struktur proyek sebelum menulis kode.
- Gunakan pola dan konvensi yang sudah ada di repository.
- Jangan mengganti stack, framework, atau library tanpa alasan kuat.
- Jangan menghapus fitur yang sudah berjalan tanpa instruksi.
- Buat perubahan sekecil dan seaman mungkin.
- Hindari duplikasi kode.
- Gunakan penamaan bahasa Inggris yang konsisten pada kode dan database.
- Gunakan `snake_case` untuk tabel dan kolom database.
- Gunakan nama model singular dan nama tabel plural.

## Database

- Gunakan foreign key.
- Tambahkan index pada slug, status, tanggal publish, dan foreign key bila diperlukan.
- Gunakan nullable hanya untuk data yang benar-benar opsional.
- Gunakan boolean untuk status aktif sederhana.
- Jangan menyimpan beberapa gambar dalam satu kolom teks.

## Backend

- Gunakan form request atau validation layer.
- Gunakan authorization pada backend.
- Gunakan transaction untuk proses yang menyimpan banyak data terkait.
- Hindari query N+1 dengan eager loading.
- Batasi data landing page menggunakan query yang jelas.

## Frontend

- Pastikan responsive.
- Gunakan komponen reusable untuk card, form, modal, tabel, pagination, dan status badge.
- Tampilkan loading, empty state, validation error, dan success message.
- Gunakan konfirmasi sebelum delete.
- Preview gambar sebelum upload bila memungkinkan.

## Media

- Validasi MIME type dan ukuran file.
- Gunakan nama file unik.
- Jangan menyimpan file binary langsung ke database.
- Simpan path file di database.

## Security

- Password harus di-hash.
- Route admin harus dilindungi autentikasi.
- Terapkan CSRF protection.
- Validasi URL eksternal.
- Sanitasi atau amankan rich text content.
- Jangan mempercayai pembatasan akses dari frontend saja.
