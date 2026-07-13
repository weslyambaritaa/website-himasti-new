# Content Workflow

## Alur Konten

```text
Admin membuat konten
↓
Sistem memvalidasi input
↓
Data disimpan sebagai draft atau aktif
↓
Admin melakukan publish/enable
↓
Website publik mengambil data aktif
↓
Konten ditampilkan
```

## Aturan Tampil

### Banner

Tampil jika:

```text
is_shown = true
```

Urutan:

```text
order_number ASC
```

### Berita

Tampil jika:

```text
status = published
published_at <= waktu sekarang
```

Urutan:

```text
published_at DESC
```

### Event

Tampil jika status bukan draft dan sesuai filter halaman.

Landing page memprioritaskan event:

```text
upcoming
ongoing
```

### Divisi

Tampil jika:

```text
is_active = true
```

### Anggota Divisi

Tampil jika:

```text
is_active = true
```

Urutan:

```text
order_number ASC
```

### Program Kerja

Tampil jika:

```text
is_published = true
```

### Instagram Post

Tampil jika:

```text
is_shown = true
```

### Layanan

Tampil jika:

```text
is_active = true
```

## Landing Page Limits

Rekomendasi jumlah data:

```text
Berita: 3
Event: 3
Program kerja unggulan: 3-6
Dokumentasi: 6
Instagram post: 6
Layanan: semua data aktif
```

## Penghapusan Data

Gunakan soft delete untuk konten penting agar data dapat dipulihkan.

Saat mengganti gambar:

1. upload gambar baru;
2. simpan path baru;
3. hapus file lama setelah penyimpanan berhasil.
