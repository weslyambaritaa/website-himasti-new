# Admin Panel Requirements

## Login

Admin login menggunakan email dan password.

Route login:

```text
/admin/login
```

Setelah berhasil login, admin diarahkan ke:

```text
/admin/dashboard
```

## Dashboard

Dashboard menampilkan ringkasan:

- jumlah berita;
- jumlah event;
- jumlah divisi;
- jumlah program kerja;
- jumlah dokumentasi;
- jumlah banner aktif;
- konten terbaru.

## Modul CRUD

### Banner

Field:

- title;
- subtitle;
- image;
- button_text;
- button_url;
- order_number;
- is_shown.

### Profil Himpunan

Field:

- organization_name;
- short_name;
- description;
- history;
- vision;
- mission;
- logo;
- chairman_message;
- address;
- email;
- phone;
- social links.

### Berita

Field:

- title;
- slug;
- cover_image;
- excerpt;
- content;
- status;
- published_at;
- author_id.

Aksi:

- create;
- edit;
- preview;
- publish/unpublish;
- delete atau soft delete.

### Event

Field:

- title;
- slug;
- cover_image;
- description;
- location;
- start_date;
- end_date;
- registration_url;
- status;
- is_featured.

### Divisi

Field:

- name;
- slug;
- short_name;
- description;
- logo;
- cover_image;
- order_number;
- is_active.

### Anggota Divisi

Field:

- division_id;
- name;
- position;
- photo;
- order_number;
- period;
- is_active.

### Program Kerja

Field:

- division_id;
- name;
- slug;
- cover_image;
- description;
- status;
- year;
- start_date;
- end_date;
- order_number;
- is_featured;
- is_published.

### Dokumentasi

Field utama:

- title;
- slug;
- description;
- event_date;
- location;
- cover_image;
- optional work_program_id.

Gambar dokumentasi harus menggunakan multi-upload dan disimpan pada tabel `documentation_images`.

### Postingan Instagram

Field:

- title;
- image;
- instagram_url;
- order_number;
- is_shown;
- published_at.

### Layanan

Field:

- name;
- description;
- icon atau logo;
- url;
- order_number;
- is_active.

### Pengguna

Super admin dapat:

- melihat admin;
- menambah admin;
- mengubah role;
- mengatur divisi yang dikelola;
- menonaktifkan akun.

## Upload Media

Setiap upload harus memiliki:

- validasi format;
- validasi ukuran file;
- nama file unik;
- preview sebelum simpan bila memungkinkan;
- penghapusan file lama ketika gambar diganti;
- fallback image bila file tidak tersedia.
