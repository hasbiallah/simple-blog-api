# Use Case Diagram & Deskripsi
## Sistem Blog API

---

| Atribut | Detail |
|---|---|
| **Nama Proyek** | Blog REST API System |
| **Versi Dokumen** | 1.0 |
| **Tanggal Dibuat** | 2 Mei 2026 |
| **Dibuat Oleh** | System Analyst |

---

## 1. Daftar Aktor

Aktor adalah **pihak yang berinteraksi** dengan sistem. Aktor diambil dari Stakeholders di BRD.

| Aktor | Deskripsi | Hak Akses |
|---|---|---|
| **Guest** | Pengguna yang belum login | Baca artikel & komentar, Register, Login |
| **Reader** | Pengguna yang sudah login (peran default) | Semua hak Guest + tambah/hapus komentar milik sendiri |
| **Author** | Pengguna dengan peran Author | Semua hak Reader + kelola artikel milik sendiri |
| **Admin** | Pengelola sistem | Akses penuh ke semua fitur |

> **Catatan:** Aktor bersifat hierarkis. Author mewarisi semua hak Reader, Admin mewarisi semua hak Author.

---

## 2. Use Case Diagram (Format Teks)

```
+------------------------------------------------------------------+
|                      SISTEM BLOG API                             |
|                                                                  |
|  +------------------+      +----------------------------+        |
|  |  AUTENTIKASI     |      |  MANAJEMEN ARTIKEL         |        |
|  |                  |      |                            |        |
|  |  [ Register ]    |      |  [ Lihat Daftar Artikel ]  |        |
|  |  [ Login    ]    |      |  [ Lihat Detail Artikel ]  |        |
|  |  [ Logout   ]    |      |  [ Buat Artikel ]          |        |
|  +------------------+      |  [ Edit Artikel ]          |        |
|                            |  [ Hapus Artikel ]         |        |
|                            |  [ Publish Artikel ]       |        |
|                            +----------------------------+        |
|                                                                  |
|  +------------------+                                           |
|  |  KOMENTAR        |                                           |
|  |                  |                                           |
|  |  [ Lihat Komentar]                                           |
|  |  [ Buat Komentar ]                                           |
|  |  [ Hapus Komentar]                                           |
|  +------------------+                                           |
+------------------------------------------------------------------+

AKTOR & KETERHUBUNGAN:

Guest  ──────────────────► [ Register ]
Guest  ──────────────────► [ Login ]
Guest  ──────────────────► [ Lihat Daftar Artikel ]
Guest  ──────────────────► [ Lihat Detail Artikel ]
Guest  ──────────────────► [ Lihat Komentar ]

Reader ──────────────────► (mewarisi semua akses Guest)
Reader ──────────────────► [ Logout ]
Reader ──────────────────► [ Buat Komentar ]
Reader ──────────────────► [ Hapus Komentar (milik sendiri) ]

Author ──────────────────► (mewarisi semua akses Reader)
Author ──────────────────► [ Buat Artikel ]
Author ──────────────────► [ Edit Artikel (milik sendiri) ]
Author ──────────────────► [ Hapus Artikel (milik sendiri) ]
Author ──────────────────► [ Publish Artikel (milik sendiri) ]

Admin  ──────────────────► (mewarisi semua akses Author)
Admin  ──────────────────► [ Hapus Artikel (semua) ]
Admin  ──────────────────► [ Hapus Komentar (semua) ]
```

---

## 3. Deskripsi Use Case (Use Case Description)

Setiap Use Case dijelaskan secara detail di bawah ini. Format ini menjelaskan **skenario normal** dan **skenario alternatif** (ketika sesuatu tidak berjalan sesuai rencana).

---

### UC-01 — Register (Daftar Akun)

| Atribut | Detail |
|---|---|
| **ID** | UC-01 |
| **Nama** | Register |
| **Aktor** | Guest |
| **Deskripsi** | Pengguna baru mendaftarkan akun dengan mengisi data diri |
| **Kondisi Awal** | Pengguna belum memiliki akun |
| **Kondisi Akhir** | Akun baru berhasil dibuat dengan peran Reader |

**Skenario Normal (Happy Path):**
1. Guest mengisi nama, email, dan kata sandi
2. Sistem memeriksa apakah email sudah terdaftar
3. Email belum terdaftar → sistem menyimpan data akun baru
4. Sistem mengembalikan respons berhasil

**Skenario Alternatif:**
- **Email sudah terdaftar** → Sistem menolak dan memberikan pesan error
- **Format email tidak valid** → Sistem menolak dan memberikan pesan error
- **Kata sandi terlalu pendek** → Sistem menolak dan memberikan pesan error

---

### UC-02 — Login

| Atribut | Detail |
|---|---|
| **ID** | UC-02 |
| **Nama** | Login |
| **Aktor** | Guest |
| **Deskripsi** | Pengguna terdaftar masuk ke sistem menggunakan email dan kata sandi |
| **Kondisi Awal** | Pengguna memiliki akun terdaftar |
| **Kondisi Akhir** | Pengguna mendapatkan token akses (access token) |

**Skenario Normal:**
1. Guest memasukkan email dan kata sandi
2. Sistem memverifikasi email dan kata sandi
3. Data cocok → sistem menghasilkan token akses
4. Sistem mengembalikan token kepada pengguna

**Skenario Alternatif:**
- **Email tidak ditemukan** → Sistem menolak dengan pesan error
- **Kata sandi salah** → Sistem menolak dengan pesan error

---

### UC-03 — Logout

| Atribut | Detail |
|---|---|
| **ID** | UC-03 |
| **Nama** | Logout |
| **Aktor** | Reader, Author, Admin |
| **Deskripsi** | Pengguna yang sedang login mengakhiri sesinya |
| **Kondisi Awal** | Pengguna sedang login (memiliki token aktif) |
| **Kondisi Akhir** | Token pengguna tidak berlaku lagi |

**Skenario Normal:**
1. Pengguna mengirim permintaan logout beserta token aktifnya
2. Sistem menginvalidasi token tersebut
3. Sistem mengembalikan respons berhasil

---

### UC-04 — Lihat Daftar Artikel

| Atribut | Detail |
|---|---|
| **ID** | UC-04 |
| **Nama** | Lihat Daftar Artikel |
| **Aktor** | Guest, Reader, Author, Admin |
| **Deskripsi** | Menampilkan daftar semua artikel yang berstatus Published |
| **Kondisi Awal** | - |
| **Kondisi Akhir** | Sistem mengembalikan daftar artikel published |

**Skenario Normal:**
1. Pengguna mengakses endpoint daftar artikel
2. Sistem mengambil semua artikel berstatus Published
3. Sistem mengembalikan daftar artikel (judul, penulis, tanggal)

---

### UC-05 — Buat Artikel

| Atribut | Detail |
|---|---|
| **ID** | UC-05 |
| **Nama** | Buat Artikel |
| **Aktor** | Author, Admin |
| **Deskripsi** | Author membuat artikel baru dalam status Draft |
| **Kondisi Awal** | Pengguna sudah login dengan peran Author atau Admin |
| **Kondisi Akhir** | Artikel baru tersimpan dengan status Draft |

**Skenario Normal:**
1. Author mengirim judul dan isi konten artikel
2. Sistem memverifikasi token dan peran Author
3. Sistem menyimpan artikel dengan status Draft
4. Sistem mengembalikan data artikel yang baru dibuat

**Skenario Alternatif:**
- **Token tidak valid** → Sistem menolak dengan status 401
- **Peran bukan Author/Admin** → Sistem menolak dengan status 403
- **Judul atau konten kosong** → Sistem menolak dengan pesan validasi

---

### UC-06 — Edit Artikel

| Atribut | Detail |
|---|---|
| **ID** | UC-06 |
| **Nama** | Edit Artikel |
| **Aktor** | Author, Admin |
| **Deskripsi** | Author mengubah konten artikel miliknya sendiri |
| **Kondisi Awal** | Pengguna login sebagai Author, artikel miliknya ada |
| **Kondisi Akhir** | Artikel berhasil diperbarui |

**Skenario Alternatif:**
- **Author mencoba edit artikel milik Author lain** → Sistem menolak dengan status 403
- **Artikel tidak ditemukan** → Sistem menolak dengan status 404

---

### UC-07 — Hapus Artikel

| Atribut | Detail |
|---|---|
| **ID** | UC-07 |
| **Nama** | Hapus Artikel |
| **Aktor** | Author (milik sendiri), Admin (semua) |
| **Deskripsi** | Menghapus artikel dari sistem |
| **Kondisi Awal** | Artikel ada di sistem |
| **Kondisi Akhir** | Artikel terhapus dari sistem |

---

### UC-08 — Buat Komentar

| Atribut | Detail |
|---|---|
| **ID** | UC-08 |
| **Nama** | Buat Komentar |
| **Aktor** | Reader, Author, Admin |
| **Deskripsi** | Pengguna login memberikan komentar pada artikel Published |
| **Kondisi Awal** | Pengguna sudah login, artikel berstatus Published |
| **Kondisi Akhir** | Komentar tersimpan dan terhubung ke artikel |

**Skenario Alternatif:**
- **Artikel berstatus Draft** → Sistem menolak dengan status 404
- **Pengguna belum login** → Sistem menolak dengan status 401

---

### UC-09 — Hapus Komentar

| Atribut | Detail |
|---|---|
| **ID** | UC-09 |
| **Nama** | Hapus Komentar |
| **Aktor** | Reader (milik sendiri), Admin (semua) |
| **Deskripsi** | Menghapus komentar dari artikel |
| **Kondisi Awal** | Komentar ada di sistem |
| **Kondisi Akhir** | Komentar terhapus dari sistem |
