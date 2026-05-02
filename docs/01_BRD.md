# Business Requirements Document (BRD)
## Sistem Blog API

---

| Atribut | Detail |
|---|---|
| **Nama Proyek** | Blog REST API System |
| **Versi Dokumen** | 1.0 |
| **Tanggal Dibuat** | 2 Mei 2026 |
| **Dibuat Oleh** | System Analyst |
| **Status** | Draft |

---

## 1. Latar Belakang

Dibutuhkan sebuah backend API sederhana yang dapat mengelola konten blog secara terstruktur. API ini harus dapat melayani berbagai jenis klien (web, mobile) tanpa terikat pada satu tampilan antarmuka tertentu. Fokus utama pada tahap pertama ini adalah sistem autentikasi pengguna dan pengelolaan artikel dasar.

---

## 2. Tujuan Proyek

- Membangun RESTful API sebagai fondasi sistem blog
- Menyediakan sistem autentikasi yang aman (register & login)
- Menyediakan fitur pengelolaan artikel blog (CRUD)
- Menyediakan fitur komentar pada artikel

---

## 3. Ruang Lingkup (Scope)

### ✅ In Scope — Yang Termasuk dalam Proyek Ini

- Registrasi akun pengguna baru
- Login dan logout pengguna
- Pengelolaan artikel (buat, baca, ubah, hapus)
- Pengelolaan komentar pada artikel
- Pembedaan hak akses berdasarkan peran (Admin, Author, Reader)

### ❌ Out of Scope — Yang Tidak Termasuk

- Tampilan antarmuka (frontend/UI)
- Upload gambar atau media
- Notifikasi email
- Fitur pencarian artikel (akan ditambahkan di versi berikutnya)
- Fitur like / bookmark artikel

---

## 4. Pemangku Kepentingan (Stakeholders)

| Peran | Deskripsi | Kepentingan Utama |
|---|---|---|
| **Reader** | Pengguna umum yang membaca konten | Bisa membaca artikel dan memberikan komentar |
| **Author** | Pengguna yang membuat konten | Bisa membuat, mengedit, dan menghapus artikel miliknya |
| **Admin** | Pengelola sistem | Bisa mengelola semua user, artikel, dan komentar |

---

## 5. Kebutuhan Bisnis (Business Requirements)

### BR-01 — Manajemen Pengguna (Autentikasi)

- Sistem harus memungkinkan seseorang untuk **mendaftar akun baru** menggunakan nama lengkap, alamat email, dan kata sandi
- Sistem harus memungkinkan pengguna terdaftar untuk **masuk** ke dalam sistem menggunakan email dan kata sandi
- Sistem harus memungkinkan pengguna yang sedang login untuk **keluar** dari sistem
- Setiap akun pengguna memiliki **satu peran**: Admin, Author, atau Reader
- Email yang digunakan untuk mendaftar harus **unik** — tidak boleh ada dua akun dengan email yang sama

### BR-02 — Manajemen Artikel

- Seorang Author harus bisa **membuat artikel baru** dengan judul dan isi konten
- Seorang Author hanya boleh **mengubah dan menghapus artikel miliknya sendiri**
- Semua pengguna (termasuk yang belum login) harus bisa **membaca daftar artikel** dan **membaca detail satu artikel**
- Artikel memiliki dua kondisi: **Draft** (belum dipublikasi) dan **Published** (sudah dipublikasi)
- Hanya artikel berstatus **Published** yang dapat dilihat oleh Reader

### BR-03 — Manajemen Komentar

- Pengguna yang **sudah login** bisa memberikan komentar pada artikel yang sudah dipublikasikan
- Pengguna hanya boleh **menghapus komentar miliknya sendiri**
- Admin bisa **menghapus komentar siapapun**
- Semua orang (termasuk yang belum login) bisa **membaca komentar** pada sebuah artikel

### BR-04 — Keamanan Akses

- Hanya pengguna yang sudah login yang boleh membuat artikel dan komentar
- Seorang Author tidak boleh mengubah atau menghapus artikel milik Author lain
- Admin memiliki akses penuh ke semua data

---

## 6. Asumsi

- Setiap pengguna memiliki alamat email yang unik
- Koneksi internet tersedia saat mengakses API
- Peran default pengguna baru yang mendaftar adalah **Reader**
- Author hanya bisa menjadi Author jika diubah oleh Admin

---

## 7. Batasan (Constraints)

- Tidak menggunakan layanan berbayar di tahap awal
- Harus menggunakan teknologi open-source

---

## 8. Kriteria Keberhasilan

Proyek dianggap berhasil apabila:

- [ ] Pengguna dapat mendaftar dan login dengan sukses
- [ ] Author dapat membuat, mengubah, dan menghapus artikel miliknya
- [ ] Reader dapat membaca artikel yang sudah dipublikasikan
- [ ] Pengguna login dapat memberikan dan menghapus komentar miliknya
- [ ] Admin memiliki kontrol penuh atas semua data
- [ ] Sistem menolak akses yang tidak memiliki izin dengan respons yang jelas
