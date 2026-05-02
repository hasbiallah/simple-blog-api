# API Documentation
## Sistem Blog API

---

| Atribut | Detail |
|---|---|
| **Nama Proyek** | Blog REST API System |
| **Versi API** | v1.0 |
| **Base URL** | `http://localhost:3000/api` |
| **Format Data** | JSON |
| **Autentikasi** | Bearer Token (JWT) |
| **Tanggal Dibuat** | 2 Mei 2026 |

---

## 1. Informasi Umum

### 1.1 Base URL

```
http://localhost:3000/api
```

Semua endpoint menggunakan prefix `/api`. Contoh endpoint lengkap:
```
POST http://localhost:3000/api/auth/register
```

### 1.2 Format Request

- Semua request body harus menggunakan format **JSON**
- Sertakan header `Content-Type: application/json` pada setiap request yang memiliki body

### 1.3 Autentikasi

Endpoint yang membutuhkan login harus menyertakan token di header:

```
Authorization: Bearer <token_dari_login>
```

### 1.4 Format Respons Standar

**Sukses:**
```json
{
  "success": true,
  "message": "Deskripsi singkat hasil",
  "data": { }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Deskripsi error yang dapat dibaca manusia",
  "errors": [ ]
}
```

### 1.5 Daftar HTTP Status Code

| Kode | Arti |
|---|---|
| `200` | OK — Request berhasil |
| `201` | Created — Data berhasil dibuat |
| `400` | Bad Request — Input tidak valid |
| `401` | Unauthorized — Token tidak ada atau tidak valid |
| `403` | Forbidden — Tidak memiliki izin |
| `404` | Not Found — Data tidak ditemukan |
| `409` | Conflict — Konflik data (misal: email duplikat) |
| `500` | Internal Server Error — Kesalahan pada server |

---

## 2. Autentikasi (`/auth`)

---

### POST `/auth/register`

**Deskripsi:** Mendaftarkan akun pengguna baru ke sistem.

**Akses:** Publik (tidak perlu token)

**Request Body:**

```json
{
  "name": "Budi Santoso",
  "email": "budi@email.com",
  "password": "password123"
}
```

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `name` | string | Ya | Min. 2 karakter, maks. 100 karakter |
| `email` | string | Ya | Format email valid, harus unik |
| `password` | string | Ya | Min. 8 karakter |

**Respons Sukses — `201 Created`:**

```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "id": 1,
    "name": "Budi Santoso",
    "email": "budi@email.com",
    "role": "reader",
    "created_at": "2026-05-02T10:00:00.000Z"
  }
}
```

**Respons Error:**

| Kode | Kondisi | Contoh Pesan |
|---|---|---|
| `400` | Field tidak lengkap atau format salah | `"Email tidak valid"` |
| `409` | Email sudah terdaftar | `"Email sudah digunakan"` |

```json
{
  "success": false,
  "message": "Email sudah digunakan",
  "errors": []
}
```

---

### POST `/auth/login`

**Deskripsi:** Login menggunakan email dan password. Mengembalikan JWT token.

**Akses:** Publik (tidak perlu token)

**Request Body:**

```json
{
  "email": "budi@email.com",
  "password": "password123"
}
```

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `email` | string | Ya | Format email valid |
| `password` | string | Ya | Tidak boleh kosong |

**Respons Sukses — `200 OK`:**

```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Budi Santoso",
      "email": "budi@email.com",
      "role": "reader"
    }
  }
}
```

> ⚠️ **Simpan `token` ini.** Token digunakan di header `Authorization` untuk mengakses endpoint yang membutuhkan login. Token berlaku selama **24 jam**.

**Respons Error:**

| Kode | Kondisi | Contoh Pesan |
|---|---|---|
| `400` | Format email tidak valid | `"Format email tidak valid"` |
| `401` | Email atau password salah | `"Email atau password salah"` |

---

### POST `/auth/logout`

**Deskripsi:** Mengakhiri sesi pengguna dan menginvalidasi token aktif.

**Akses:** Perlu login 🔒

**Header yang Dibutuhkan:**
```
Authorization: Bearer <token>
```

**Request Body:** Tidak ada

**Respons Sukses — `200 OK`:**

```json
{
  "success": true,
  "message": "Logout berhasil",
  "data": null
}
```

**Respons Error:**

| Kode | Kondisi |
|---|---|
| `401` | Token tidak disertakan atau sudah tidak valid |

---

## 3. Artikel (`/articles`)

---

### GET `/articles`

**Deskripsi:** Mengambil daftar semua artikel yang berstatus `published`. Mendukung paginasi.

**Akses:** Publik (tidak perlu token)

**Query Parameters (Opsional):**

| Parameter | Tipe | Default | Keterangan |
|---|---|---|---|
| `page` | integer | `1` | Halaman yang ingin ditampilkan |
| `limit` | integer | `10` | Jumlah artikel per halaman |

**Contoh Request:**
```
GET /api/articles?page=1&limit=5
```

**Respons Sukses — `200 OK`:**

```json
{
  "success": true,
  "message": "Daftar artikel berhasil diambil",
  "data": [
    {
      "id": 1,
      "title": "Belajar Node.js Dasar",
      "status": "published",
      "author": {
        "id": 2,
        "name": "Budi Santoso"
      },
      "created_at": "2026-05-01T10:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Tips Menulis API yang Baik",
      "status": "published",
      "author": {
        "id": 2,
        "name": "Budi Santoso"
      },
      "created_at": "2026-05-01T12:00:00.000Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 5,
    "total_pages": 5
  }
}
```

---

### GET `/articles/:id`

**Deskripsi:** Mengambil detail satu artikel berdasarkan ID, beserta daftar komentarnya.

**Akses:** Publik (tidak perlu token)

**Path Parameter:**

| Parameter | Tipe | Keterangan |
|---|---|---|
| `id` | integer | ID artikel yang ingin dilihat |

**Contoh Request:**
```
GET /api/articles/1
```

**Respons Sukses — `200 OK`:**

```json
{
  "success": true,
  "message": "Detail artikel berhasil diambil",
  "data": {
    "id": 1,
    "title": "Belajar Node.js Dasar",
    "content": "Node.js adalah runtime JavaScript yang berjalan di sisi server...",
    "status": "published",
    "author": {
      "id": 2,
      "name": "Budi Santoso"
    },
    "comments": [
      {
        "id": 1,
        "content": "Artikel yang sangat membantu!",
        "user": {
          "id": 3,
          "name": "Ani Rahayu"
        },
        "created_at": "2026-05-01T11:00:00.000Z"
      }
    ],
    "created_at": "2026-05-01T10:00:00.000Z",
    "updated_at": "2026-05-01T10:00:00.000Z"
  }
}
```

**Respons Error:**

| Kode | Kondisi |
|---|---|
| `404` | Artikel tidak ditemukan atau berstatus draft |

---

### POST `/articles`

**Deskripsi:** Membuat artikel baru. Artikel tersimpan dengan status `draft` secara default.

**Akses:** Author, Admin 🔒

**Header yang Dibutuhkan:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Judul Artikel Baru",
  "content": "Isi konten artikel yang cukup panjang...",
  "status": "draft"
}
```

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `title` | string | Ya | Min. 5 karakter, maks. 255 karakter |
| `content` | string | Ya | Min. 10 karakter |
| `status` | string | Tidak | Nilai: `draft` atau `published`. Default: `draft` |

**Respons Sukses — `201 Created`:**

```json
{
  "success": true,
  "message": "Artikel berhasil dibuat",
  "data": {
    "id": 5,
    "title": "Judul Artikel Baru",
    "content": "Isi konten artikel yang cukup panjang...",
    "status": "draft",
    "author": {
      "id": 2,
      "name": "Budi Santoso"
    },
    "created_at": "2026-05-02T10:00:00.000Z"
  }
}
```

**Respons Error:**

| Kode | Kondisi |
|---|---|
| `400` | Field wajib kosong atau tidak valid |
| `401` | Token tidak valid |
| `403` | Peran bukan Author atau Admin |

---

### PUT `/articles/:id`

**Deskripsi:** Mengubah data artikel. Author hanya bisa mengubah artikelnya sendiri. Admin bisa mengubah artikel siapapun.

**Akses:** Author (milik sendiri), Admin 🔒

**Header yang Dibutuhkan:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameter:**

| Parameter | Tipe | Keterangan |
|---|---|---|
| `id` | integer | ID artikel yang ingin diubah |

**Request Body (Semua field opsional — hanya kirim yang ingin diubah):**

```json
{
  "title": "Judul yang Diperbarui",
  "content": "Konten yang sudah diperbarui...",
  "status": "published"
}
```

**Respons Sukses — `200 OK`:**

```json
{
  "success": true,
  "message": "Artikel berhasil diperbarui",
  "data": {
    "id": 1,
    "title": "Judul yang Diperbarui",
    "content": "Konten yang sudah diperbarui...",
    "status": "published",
    "updated_at": "2026-05-02T11:00:00.000Z"
  }
}
```

**Respons Error:**

| Kode | Kondisi |
|---|---|
| `401` | Token tidak valid |
| `403` | Author mencoba mengubah artikel milik orang lain |
| `404` | Artikel tidak ditemukan |

---

### DELETE `/articles/:id`

**Deskripsi:** Menghapus artikel beserta semua komentarnya.

**Akses:** Author (milik sendiri), Admin 🔒

**Header yang Dibutuhkan:**
```
Authorization: Bearer <token>
```

**Path Parameter:**

| Parameter | Tipe | Keterangan |
|---|---|---|
| `id` | integer | ID artikel yang ingin dihapus |

**Request Body:** Tidak ada

**Respons Sukses — `200 OK`:**

```json
{
  "success": true,
  "message": "Artikel berhasil dihapus",
  "data": null
}
```

**Respons Error:**

| Kode | Kondisi |
|---|---|
| `401` | Token tidak valid |
| `403` | Author mencoba menghapus artikel milik orang lain |
| `404` | Artikel tidak ditemukan |

---

## 4. Komentar (`/articles/:id/comments`, `/comments`)

---

### POST `/articles/:id/comments`

**Deskripsi:** Menambahkan komentar pada artikel yang berstatus `published`.

**Akses:** Reader, Author, Admin 🔒

**Header yang Dibutuhkan:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Path Parameter:**

| Parameter | Tipe | Keterangan |
|---|---|---|
| `id` | integer | ID artikel yang ingin dikomentari |

**Request Body:**

```json
{
  "content": "Artikel ini sangat informatif, terima kasih!"
}
```

| Field | Tipe | Wajib | Aturan |
|---|---|---|---|
| `content` | string | Ya | Min. 1 karakter, maks. 500 karakter |

**Respons Sukses — `201 Created`:**

```json
{
  "success": true,
  "message": "Komentar berhasil ditambahkan",
  "data": {
    "id": 10,
    "content": "Artikel ini sangat informatif, terima kasih!",
    "article_id": 1,
    "user": {
      "id": 3,
      "name": "Ani Rahayu"
    },
    "created_at": "2026-05-02T11:00:00.000Z"
  }
}
```

**Respons Error:**

| Kode | Kondisi |
|---|---|
| `400` | Field content kosong |
| `401` | Token tidak valid |
| `404` | Artikel tidak ditemukan atau berstatus draft |

---

### DELETE `/comments/:id`

**Deskripsi:** Menghapus komentar berdasarkan ID. Pengguna hanya bisa menghapus komentarnya sendiri, kecuali Admin.

**Akses:** Pemilik komentar, Admin 🔒

**Header yang Dibutuhkan:**
```
Authorization: Bearer <token>
```

**Path Parameter:**

| Parameter | Tipe | Keterangan |
|---|---|---|
| `id` | integer | ID komentar yang ingin dihapus |

**Request Body:** Tidak ada

**Respons Sukses — `200 OK`:**

```json
{
  "success": true,
  "message": "Komentar berhasil dihapus",
  "data": null
}
```

**Respons Error:**

| Kode | Kondisi |
|---|---|
| `401` | Token tidak valid |
| `403` | Bukan pemilik komentar |
| `404` | Komentar tidak ditemukan |

---

## 5. Ringkasan Semua Endpoint

| Method | Endpoint | Deskripsi | Akses |
|---|---|---|---|
| `POST` | `/auth/register` | Daftar akun baru | Publik |
| `POST` | `/auth/login` | Login & dapatkan token | Publik |
| `POST` | `/auth/logout` | Logout & invalidasi token | 🔒 Login |
| `GET` | `/articles` | Daftar artikel published | Publik |
| `GET` | `/articles/:id` | Detail artikel + komentar | Publik |
| `POST` | `/articles` | Buat artikel baru | 🔒 Author, Admin |
| `PUT` | `/articles/:id` | Edit artikel | 🔒 Author (sendiri), Admin |
| `DELETE` | `/articles/:id` | Hapus artikel | 🔒 Author (sendiri), Admin |
| `POST` | `/articles/:id/comments` | Tambah komentar | 🔒 Login |
| `DELETE` | `/comments/:id` | Hapus komentar | 🔒 Pemilik, Admin |

---

## 6. Contoh Alur Penggunaan API (End-to-End)

Berikut contoh urutan request yang dilakukan dari awal sampai berhasil membuat dan membaca artikel:

```
1. POST /auth/register       → Daftar akun (dapat ID user)
2. POST /auth/login          → Login (dapat TOKEN)
3. POST /articles            → Buat artikel (gunakan TOKEN, status: draft)
4. PUT  /articles/1          → Ubah status menjadi "published"
5. GET  /articles            → Lihat daftar artikel (tanpa token)
6. GET  /articles/1          → Lihat detail artikel (tanpa token)
7. POST /articles/1/comments → Tambah komentar (gunakan TOKEN)
8. POST /auth/logout         → Logout (gunakan TOKEN)
```
