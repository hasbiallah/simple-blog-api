# Software Requirements Specification (SRS)
## Sistem Blog API

---

| Atribut | Detail |
|---|---|
| **Nama Proyek** | Blog REST API System |
| **Versi Dokumen** | 1.0 |
| **Tanggal Dibuat** | 2 Mei 2026 |
| **Dibuat Oleh** | System Analyst |
| **Referensi** | BRD v1.0, Use Case v1.0 |

---

## 1. Pendahuluan

### 1.1 Tujuan Dokumen

Dokumen SRS ini menjelaskan secara **teknis dan detail** semua kebutuhan fungsional dan non-fungsional dari sistem Blog API. Dokumen ini menjadi acuan utama bagi tim developer dalam membangun sistem.

### 1.2 Perbedaan SRS dengan BRD

| Aspek | BRD | SRS |
|---|---|---|
| **Bahasa** | Non-teknis, bahasa bisnis | Teknis, bahasa sistem |
| **Audiens** | Klien, stakeholder | Developer, QA |
| **Isi** | APA yang dibutuhkan | BAGAIMANA sistem bekerja |
| **Contoh** | "Pengguna bisa login" | "Sistem memvalidasi email & password, menghasilkan JWT dengan expiry 24 jam" |

### 1.3 Teknologi yang Digunakan

| Komponen | Teknologi |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MySQL |
| **Autentikasi** | JSON Web Token (JWT) |
| **Enkripsi Password** | bcrypt |
| **Bahasa** | JavaScript / TypeScript |

---

## 2. Deskripsi Umum Sistem

### 2.1 Perspektif Sistem

Sistem ini adalah **RESTful API** yang berdiri sendiri (standalone). Sistem menerima request dalam format JSON dan mengembalikan respons dalam format JSON. Sistem tidak memiliki antarmuka visual.

### 2.2 Arsitektur Umum

```
[Client: Web / Mobile / Postman]
            |
            | HTTP Request (JSON)
            ▼
    [Blog REST API Server]
            |
     ┌──────┴──────┐
     |             |
[Auth Middleware] [Route Handler]
     |             |
     └──────┬──────┘
            |
     [Business Logic]
            |
            ▼
      [Database: MySQL]
```

### 2.3 Peran Pengguna & Hak Akses

| Fitur | Guest | Reader | Author | Admin |
|---|---|---|---|---|
| Register | ✅ | ❌ | ❌ | ❌ |
| Login | ✅ | ✅ | ✅ | ✅ |
| Logout | ❌ | ✅ | ✅ | ✅ |
| Lihat artikel published | ✅ | ✅ | ✅ | ✅ |
| Buat artikel | ❌ | ❌ | ✅ | ✅ |
| Edit artikel sendiri | ❌ | ❌ | ✅ | ✅ |
| Hapus artikel sendiri | ❌ | ❌ | ✅ | ✅ |
| Hapus artikel siapapun | ❌ | ❌ | ❌ | ✅ |
| Buat komentar | ❌ | ✅ | ✅ | ✅ |
| Hapus komentar sendiri | ❌ | ✅ | ✅ | ✅ |
| Hapus komentar siapapun | ❌ | ❌ | ❌ | ✅ |

---

## 3. Kebutuhan Fungsional

### 3.1 Modul Autentikasi

---

#### FR-01 — Register

**Deskripsi:** Sistem menyediakan endpoint untuk mendaftarkan akun baru.

**Input yang Diterima:**

| Field | Tipe | Wajib | Aturan Validasi |
|---|---|---|---|
| `name` | string | Ya | Minimal 2 karakter, maksimal 100 karakter |
| `email` | string | Ya | Format email valid, unik di database |
| `password` | string | Ya | Minimal 8 karakter |

**Proses Sistem:**
1. Validasi semua field input
2. Periksa apakah email sudah terdaftar di database
3. Jika belum ada, hash password menggunakan bcrypt (salt rounds: 10)
4. Simpan data pengguna baru ke database dengan peran default `reader`
5. Kembalikan respons sukses (tidak menyertakan password dalam respons)

**Output:**
- **Sukses (201):** Data pengguna yang baru dibuat (tanpa password)
- **Gagal (400):** Pesan validasi error
- **Gagal (409):** Email sudah terdaftar

---

#### FR-02 — Login

**Deskripsi:** Sistem memverifikasi kredensial dan mengeluarkan JWT.

**Input yang Diterima:**

| Field | Tipe | Wajib | Aturan Validasi |
|---|---|---|---|
| `email` | string | Ya | Format email valid |
| `password` | string | Ya | Tidak boleh kosong |

**Proses Sistem:**
1. Cari pengguna berdasarkan email di database
2. Jika tidak ditemukan, kembalikan error
3. Bandingkan password input dengan hash di database menggunakan bcrypt
4. Jika cocok, buat JWT dengan payload: `{ id, email, role }`
5. JWT memiliki masa berlaku **24 jam**
6. Kembalikan JWT kepada client

**Output:**
- **Sukses (200):** `{ token: "jwt_string", user: { id, name, email, role } }`
- **Gagal (401):** Email atau password salah
- **Gagal (400):** Validasi input gagal

---

#### FR-03 — Logout

**Deskripsi:** Sistem menginvalidasi token pengguna.

**Header yang Dibutuhkan:**
- `Authorization: Bearer <token>`

**Proses Sistem:**
1. Verifikasi token dari header Authorization
2. Masukkan token ke dalam daftar blacklist (disimpan di database atau cache)
3. Token yang sudah di-blacklist tidak bisa digunakan kembali

**Output:**
- **Sukses (200):** Pesan logout berhasil
- **Gagal (401):** Token tidak valid atau tidak disertakan

---

### 3.2 Modul Artikel

---

#### FR-04 — Lihat Daftar Artikel

**Deskripsi:** Mengembalikan daftar semua artikel berstatus `published`.

**Akses:** Publik (tidak perlu login)

**Query Parameter (Opsional):**

| Parameter | Tipe | Default | Keterangan |
|---|---|---|---|
| `page` | integer | 1 | Halaman saat ini |
| `limit` | integer | 10 | Jumlah data per halaman |

**Output Sukses (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Judul Artikel",
      "author": { "id": 2, "name": "Nama Penulis" },
      "status": "published",
      "created_at": "2026-05-02T10:00:00Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "total_pages": 3
  }
}
```

---

#### FR-05 — Lihat Detail Artikel

**Deskripsi:** Mengembalikan detail satu artikel beserta komentar-komentarnya.

**Akses:** Publik (tidak perlu login)

**Output Sukses (200):**
```json
{
  "data": {
    "id": 1,
    "title": "Judul Artikel",
    "content": "Isi konten artikel...",
    "status": "published",
    "author": { "id": 2, "name": "Nama Penulis" },
    "comments": [
      {
        "id": 1,
        "content": "Isi komentar",
        "user": { "id": 3, "name": "Nama Komentator" },
        "created_at": "2026-05-02T11:00:00Z"
      }
    ],
    "created_at": "2026-05-02T10:00:00Z"
  }
}
```

**Gagal:**
- **(404):** Artikel tidak ditemukan atau berstatus Draft

---

#### FR-06 — Buat Artikel

**Akses:** Author, Admin (perlu login)

**Input:**

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `title` | string | Ya | Minimal 5 karakter, maksimal 255 karakter |
| `content` | string | Ya | Minimal 10 karakter |
| `status` | enum | Tidak | Nilai: `draft` atau `published`. Default: `draft` |

**Proses:**
1. Verifikasi token JWT dari header
2. Pastikan peran pengguna adalah `author` atau `admin`
3. Validasi field input
4. Simpan artikel dengan `user_id` dari token
5. Kembalikan data artikel yang baru dibuat

**Output:**
- **Sukses (201):** Data artikel baru
- **Gagal (401):** Token tidak valid
- **Gagal (403):** Peran tidak diizinkan

---

#### FR-07 — Edit Artikel

**Akses:** Author (hanya milik sendiri), Admin (semua)

**Proses:**
1. Verifikasi token JWT
2. Ambil artikel berdasarkan ID
3. Jika artikel tidak ditemukan → 404
4. Jika peran adalah `author` dan `user_id` artikel berbeda dengan user yang login → 403
5. Perbarui field yang dikirim (partial update diperbolehkan)
6. Simpan perubahan

**Output:**
- **Sukses (200):** Data artikel yang sudah diperbarui
- **Gagal (403):** Bukan pemilik artikel
- **Gagal (404):** Artikel tidak ditemukan

---

#### FR-08 — Hapus Artikel

**Akses:** Author (hanya milik sendiri), Admin (semua)

**Proses:**
1. Verifikasi token JWT
2. Validasi kepemilikan (sama seperti FR-07)
3. Hapus semua komentar terkait artikel ini (cascade delete)
4. Hapus artikel

**Output:**
- **Sukses (200):** Pesan berhasil dihapus
- **Gagal (403/404):** Sama seperti FR-07

---

### 3.3 Modul Komentar

---

#### FR-09 — Buat Komentar

**Akses:** Reader, Author, Admin (perlu login)

**Input:**

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `content` | string | Ya | Minimal 1 karakter, maksimal 500 karakter |

**Proses:**
1. Verifikasi token JWT
2. Periksa apakah artikel dengan ID tersebut ada dan berstatus `published`
3. Simpan komentar dengan `user_id` dari token dan `article_id` dari URL

**Output:**
- **Sukses (201):** Data komentar baru
- **Gagal (404):** Artikel tidak ditemukan atau berstatus draft

---

#### FR-10 — Hapus Komentar

**Akses:** Pemilik komentar, Admin

**Proses:**
1. Verifikasi token JWT
2. Ambil komentar berdasarkan ID
3. Jika bukan pemilik dan bukan admin → 403
4. Hapus komentar

**Output:**
- **Sukses (200):** Pesan berhasil dihapus
- **Gagal (403/404):** Tidak memiliki izin atau tidak ditemukan

---

## 4. Kebutuhan Non-Fungsional

### 4.1 Keamanan

- Password harus di-hash menggunakan **bcrypt** sebelum disimpan
- Semua endpoint yang membutuhkan autentikasi harus memvalidasi JWT
- JWT harus menggunakan secret key yang tersimpan di environment variable (bukan di kode)
- Respons error tidak boleh mengungkap detail teknis internal sistem (stack trace, query SQL, dll.)

### 4.2 Format Respons API

Semua respons menggunakan format JSON yang konsisten:

**Format Sukses:**
```json
{
  "success": true,
  "message": "Pesan sukses",
  "data": { }
}
```

**Format Error:**
```json
{
  "success": false,
  "message": "Pesan error yang dapat dibaca manusia",
  "errors": [ ]
}
```

### 4.3 Penanganan Error (HTTP Status Code)

| Kode | Kondisi |
|---|---|
| `200` | Request berhasil (GET, PUT, DELETE) |
| `201` | Data berhasil dibuat (POST) |
| `400` | Input tidak valid / validasi gagal |
| `401` | Tidak terautentikasi (token tidak ada / tidak valid) |
| `403` | Tidak memiliki izin (peran tidak sesuai) |
| `404` | Data tidak ditemukan |
| `409` | Konflik data (contoh: email sudah terdaftar) |
| `500` | Kesalahan internal server |

### 4.4 Performa

- Response time target: **< 500ms** untuk operasi baca standar
- Daftar artikel menggunakan **paginasi** untuk menghindari beban data berlebihan

---

## 5. Struktur Endpoint (Ringkasan)

| Method | Endpoint | Deskripsi | Akses |
|---|---|---|---|
| POST | `/api/auth/register` | Daftar akun baru | Guest |
| POST | `/api/auth/login` | Login | Guest |
| POST | `/api/auth/logout` | Logout | Login |
| GET | `/api/articles` | Daftar artikel published | Publik |
| GET | `/api/articles/:id` | Detail artikel | Publik |
| POST | `/api/articles` | Buat artikel | Author, Admin |
| PUT | `/api/articles/:id` | Edit artikel | Author, Admin |
| DELETE | `/api/articles/:id` | Hapus artikel | Author, Admin |
| POST | `/api/articles/:id/comments` | Buat komentar | Login |
| DELETE | `/api/comments/:id` | Hapus komentar | Pemilik, Admin |
