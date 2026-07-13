# HIMASTI Website Documentation

Dokumentasi ini menjadi sumber konteks utama untuk pengembangan website Himpunan Mahasiswa Informatika Institut Teknologi Del.

## Tujuan Sistem

Website terdiri dari dua bagian:

1. Website publik/landing page untuk menampilkan informasi himpunan.
2. Admin panel untuk login dan mengelola seluruh konten yang tampil pada website publik.

## Urutan Membaca

Codex harus membaca file berikut secara berurutan:

1. `PROJECT_CONTEXT.md`
2. `SYSTEM_ARCHITECTURE.md`
3. `PUBLIC_WEBSITE_REQUIREMENTS.md`
4. `ADMIN_PANEL_REQUIREMENTS.md`
5. `DATABASE_DESIGN.md`
6. `ROLES_AND_PERMISSIONS.md`
7. `CONTENT_WORKFLOW.md`
8. `ROUTES_AND_MODULES.md`
9. `CODING_RULES.md`
10. `OPEN_QUESTIONS.md`

## Prinsip Utama

- Konten website publik berasal dari database.
- Konten dikelola melalui admin panel.
- Data yang tidak aktif, belum dipublikasikan, atau disembunyikan tidak boleh tampil di website publik.
- Struktur database harus fleksibel dan tidak membuat tabel terpisah untuk setiap divisi.
- Codex tidak boleh langsung mengubah kode sebelum memahami sistem dan mengajukan pertanyaan yang diperlukan.
