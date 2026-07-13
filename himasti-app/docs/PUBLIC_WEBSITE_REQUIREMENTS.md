# Public Website Requirements

## Navbar

Menu utama:

- Beranda
- Profil
- Berita
- Dokumentasi
- Divisi
- Layanan

Navbar dapat menggunakan dropdown untuk daftar divisi bila diperlukan.

## Landing Page

Urutan section yang disarankan:

1. Navbar
2. Hero/banner
3. Profil singkat himpunan
4. Visi dan misi
5. Berita terbaru
6. Event terbaru atau event mendatang
7. Daftar divisi
8. Program kerja pilihan
9. Dokumentasi terbaru
10. Postingan Instagram
11. Layanan
12. Footer

## Hero/Banner

Menampilkan banner aktif berdasarkan urutan.

Data berasal dari tabel `banners` dan hanya data dengan `is_shown = true` yang ditampilkan.

## Profil

Menampilkan:

- nama himpunan;
- deskripsi singkat;
- sejarah atau kata pengantar;
- visi;
- misi;
- logo;
- sambutan ketua bila digunakan.

## Berita

Landing page menampilkan maksimal 3 atau 4 berita terbaru yang sudah dipublikasikan.

Card berita berisi:

- cover;
- judul;
- ringkasan;
- tanggal publish;
- tombol baca selengkapnya.

Halaman `/berita` menampilkan seluruh berita dengan pagination.

## Event

Landing page menampilkan event yang akan datang atau sedang berlangsung.

Card event berisi:

- cover;
- judul;
- tanggal;
- lokasi;
- status;
- tautan detail.

## Divisi

Daftar awal:

- BPH
- MPH
- Ristek
- Humas
- Kominfo
- Pendidikan
- Danus
- Minat dan Bakat

Halaman detail divisi menampilkan:

- nama divisi;
- deskripsi;
- cover/logo;
- anggota berdasarkan urutan;
- program kerja divisi.

BPH dan MPH boleh tidak memiliki program kerja.

## Dokumentasi

Landing page menampilkan dokumentasi terbaru.

Halaman detail dokumentasi menampilkan:

- judul kegiatan;
- tanggal/waktu;
- lokasi bila ada;
- deskripsi;
- galeri gambar;
- lightbox bila tersedia.

## Instagram Posts

Menampilkan gambar yang telah dipilih admin.

Klik gambar membuka URL Instagram pada tab baru.

Hanya data aktif/shown yang ditampilkan.

## Layanan

Menampilkan card tautan eksternal seperti:

- Website IT Del
- Website SEMAT
- Website CIS

Setiap card dapat memiliki nama, ikon/logo, deskripsi, dan URL.

## Footer

Footer minimal memuat:

- nama organisasi;
- alamat atau lokasi;
- email;
- media sosial;
- copyright;
- tautan penting.
