# Deployment HIMASTI dengan Docker

Dokumen ini menjelaskan kebutuhan runtime image aplikasi HIMASTI. PostgreSQL, domain,
reverse proxy, dan HTTPS dikelola di luar container aplikasi.

## Build image

Jalankan dari folder `himasti-app`:

```bash
docker build -t himasti-app:latest .
```

## Port dan health check

- Port internal container: `80`
- Health check: `GET /up`

## Environment wajib

Container menerima konfigurasi saat dijalankan. Jangan memasukkan `.env` production ke
source code atau Docker image.

Minimal environment:

```env
APP_NAME=HIMASTI
APP_ENV=production
APP_KEY=<Laravel application key>
APP_DEBUG=false
APP_URL=https://domain-yang-digunakan
ASSET_URL=
APP_TIMEZONE=Asia/Jakarta

DB_CONNECTION=pgsql
DB_HOST=<host PostgreSQL eksternal>
DB_PORT=5432
DB_DATABASE=<nama database>
DB_USERNAME=<user database>
DB_PASSWORD=<password database>
```

Tambahkan pula konfigurasi API user dan SSO sesuai lingkungan deployment.

## Persistent storage

Direktori berikut harus dipasang sebagai volume persistent:

```text
/var/www/html/storage/app/public
```

Direktori tersebut menyimpan logo, banner, berita, kegiatan, dokumentasi, foto anggota,
logo divisi, layanan, dan unggahan publik lain. Data unggahan tidak boleh bergantung pada
lifecycle container.

Contoh menjalankan image:

```bash
docker run -d \
  --name himasti-app \
  -p 8080:80 \
  --env-file .env.production \
  --mount source=himasti_uploads,target=/var/www/html/storage/app/public \
  himasti-app:latest
```

## Database migration

Migration sengaja tidak dijalankan otomatis oleh entrypoint. Setelah koneksi database
siap, deployer dapat menjalankan:

```bash
docker exec himasti-app php artisan migrate --force
```

Jangan menggunakan `migrate:fresh` pada database production karena perintah tersebut
menghapus seluruh tabel dan data.

## Cache production

Setelah environment final tersedia, cache dapat dibuat melalui:

```bash
docker exec himasti-app php artisan optimize
```

Jika environment berubah, bersihkan dan buat ulang cache:

```bash
docker exec himasti-app php artisan optimize:clear
docker exec himasti-app php artisan optimize
```

## Pemeriksaan

```bash
docker ps
docker logs himasti-app
docker exec himasti-app php artisan migrate:status
```

Buka endpoint `/up` untuk health check dan halaman utama untuk memeriksa aset serta
koneksi PostgreSQL.
