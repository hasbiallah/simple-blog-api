# Entity Relationship Diagram (ERD)
## Sistem Blog API

---

| Atribut | Detail |
|---|---|
| **Nama Proyek** | Blog REST API System |
| **Versi Dokumen** | 1.0 |
| **Tanggal Dibuat** | 2 Mei 2026 |
| **Dibuat Oleh** | System Analyst |
| **Database** | MySQL |

---

## 1. Apa itu ERD?

ERD (Entity Relationship Diagram) adalah gambaran visual tentang **struktur database** — tabel apa saja yang ada, kolom apa yang ada di setiap tabel, dan bagaimana tabel-tabel tersebut saling berhubungan.

**Konsep dasar yang perlu dipahami:**

| Istilah | Artinya | Contoh |
|---|---|---|
| **Entity** | Tabel dalam database | `users`, `articles` |
| **Attribute** | Kolom dalam tabel | `name`, `email`, `title` |
| **Primary Key (PK)** | Kolom ID unik tiap baris | `id` |
| **Foreign Key (FK)** | Kolom yang merujuk ke tabel lain | `user_id` di tabel articles |
| **Relasi 1:N** | Satu baris tabel A bisa punya banyak baris tabel B | 1 user bisa punya banyak artikel |
| **Relasi M:N** | Banyak baris A bisa terhubung ke banyak baris B | Artikel dan Tag (tidak dipakai di sistem ini) |

---

## 2. Daftar Entity (Tabel)

Sistem blog ini memiliki **3 tabel utama:**

| No | Nama Tabel | Deskripsi |
|---|---|---|
| 1 | `users` | Menyimpan data semua pengguna sistem |
| 2 | `articles` | Menyimpan data semua artikel blog |
| 3 | `comments` | Menyimpan data semua komentar |

---

## 3. Diagram ERD (Format Teks)

```
+------------------+          +----------------------+          +------------------+
|     USERS        |          |      ARTICLES        |          |     COMMENTS     |
+------------------+          +----------------------+          +------------------+
| PK  id           |          | PK  id               |          | PK  id           |
|     name         |          | FK  user_id  ────────┼──────┐   | FK  user_id      |
|     email        |◄─────────┤     title            |      │   | FK  article_id   |
|     password     |    1:N   |     content          |      │   |     content      |
|     role         |          |     status           |      │   |     created_at   |
|     created_at   |          |     created_at       |      │   +------------------+
|     updated_at   |          |     updated_at       |      │          │
+------------------+          +----------------------+      │          │
        ▲                               ▲                   │          │
        │                               │                   └──────────┘
        │ 1:N (user membuat komentar)   │ 1:N (artikel punya banyak komentar)
        └───────────────────────────────┘


RELASI:
users    ──(1:N)──► articles   : Satu user bisa membuat banyak artikel
users    ──(1:N)──► comments   : Satu user bisa membuat banyak komentar
articles ──(1:N)──► comments   : Satu artikel bisa punya banyak komentar
```

---

## 4. Detail Setiap Tabel

### 4.1 Tabel `users`

**Fungsi:** Menyimpan data semua pengguna yang terdaftar di sistem.

| Kolom | Tipe Data | Nullable | Default | Keterangan |
|---|---|---|---|---|
| `id` | INT, AUTO_INCREMENT | Tidak | - | Primary Key |
| `name` | VARCHAR(100) | Tidak | - | Nama lengkap pengguna |
| `email` | VARCHAR(150) | Tidak | - | Email unik, digunakan untuk login |
| `password` | VARCHAR(255) | Tidak | - | Password yang sudah di-hash dengan bcrypt |
| `role` | ENUM('admin','author','reader') | Tidak | 'reader' | Peran pengguna dalam sistem |
| `created_at` | TIMESTAMP | Tidak | CURRENT_TIMESTAMP | Waktu akun dibuat |
| `updated_at` | TIMESTAMP | Tidak | CURRENT_TIMESTAMP ON UPDATE | Waktu data terakhir diubah |

**Constraint:**
- `email` harus UNIQUE
- `role` hanya boleh bernilai: `admin`, `author`, atau `reader`

**Contoh data:**
```
id | name          | email               | password | role   | created_at
---|---------------|---------------------|----------|--------|-------------------
1  | Admin Utama   | admin@blog.com      | $2b$10.. | admin  | 2026-05-01 08:00
2  | Budi Santoso  | budi@email.com      | $2b$10.. | author | 2026-05-01 09:00
3  | Ani Rahayu    | ani@email.com       | $2b$10.. | reader | 2026-05-01 10:00
```

---

### 4.2 Tabel `articles`

**Fungsi:** Menyimpan semua artikel blog yang dibuat oleh Author.

| Kolom | Tipe Data | Nullable | Default | Keterangan |
|---|---|---|---|---|
| `id` | INT, AUTO_INCREMENT | Tidak | - | Primary Key |
| `user_id` | INT | Tidak | - | Foreign Key → `users.id` (penulis artikel) |
| `title` | VARCHAR(255) | Tidak | - | Judul artikel |
| `content` | TEXT | Tidak | - | Isi konten artikel |
| `status` | ENUM('draft','published') | Tidak | 'draft' | Status publikasi artikel |
| `created_at` | TIMESTAMP | Tidak | CURRENT_TIMESTAMP | Waktu artikel dibuat |
| `updated_at` | TIMESTAMP | Tidak | CURRENT_TIMESTAMP ON UPDATE | Waktu artikel terakhir diubah |

**Constraint:**
- `user_id` adalah Foreign Key yang merujuk ke `users.id`
- Jika user dihapus, artikel terkait ikut terhapus (CASCADE DELETE)

**Contoh data:**
```
id | user_id | title                  | status    | created_at
---|---------|------------------------|-----------|-------------------
1  | 2       | Belajar Node.js Dasar  | published | 2026-05-01 10:00
2  | 2       | Tips TypeScript        | draft     | 2026-05-02 08:00
```

---

### 4.3 Tabel `comments`

**Fungsi:** Menyimpan semua komentar yang diberikan pada artikel.

| Kolom | Tipe Data | Nullable | Default | Keterangan |
|---|---|---|---|---|
| `id` | INT, AUTO_INCREMENT | Tidak | - | Primary Key |
| `user_id` | INT | Tidak | - | Foreign Key → `users.id` (pembuat komentar) |
| `article_id` | INT | Tidak | - | Foreign Key → `articles.id` (artikel yang dikomentari) |
| `content` | TEXT | Tidak | - | Isi komentar |
| `created_at` | TIMESTAMP | Tidak | CURRENT_TIMESTAMP | Waktu komentar dibuat |

**Constraint:**
- `user_id` adalah Foreign Key → `users.id`
- `article_id` adalah Foreign Key → `articles.id`
- Jika artikel dihapus, semua komentarnya ikut terhapus (CASCADE DELETE)
- Jika user dihapus, komentar yang pernah dibuat tetap ada (SET NULL — *opsional, tergantung keputusan bisnis*)

**Contoh data:**
```
id | user_id | article_id | content                        | created_at
---|---------|------------|--------------------------------|-------------------
1  | 3       | 1          | Artikel yang sangat membantu!  | 2026-05-01 11:00
2  | 3       | 1          | Terima kasih penjelasannya     | 2026-05-01 12:00
```

---

## 5. DDL — SQL untuk Membuat Tabel

> DDL (Data Definition Language) adalah skrip SQL yang digunakan untuk membuat tabel di database. Ini dibuat berdasarkan ERD di atas.

```sql
-- Buat database
CREATE DATABASE blog_api;
USE blog_api;

-- Tabel users
CREATE TABLE users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(150)  NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,
  role       ENUM('admin', 'author', 'reader') NOT NULL DEFAULT 'reader',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel articles
CREATE TABLE articles (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT           NOT NULL,
  title      VARCHAR(255)  NOT NULL,
  content    TEXT          NOT NULL,
  status     ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_articles_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
);

-- Tabel comments
CREATE TABLE comments (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT  NOT NULL,
  article_id INT  NOT NULL,
  content    TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_comments_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_comments_article
    FOREIGN KEY (article_id) REFERENCES articles(id)
    ON DELETE CASCADE
);
```

---

## 6. Ringkasan Relasi

| Dari Tabel | Ke Tabel | Tipe Relasi | Penjelasan |
|---|---|---|---|
| `users` | `articles` | One-to-Many (1:N) | 1 user bisa punya banyak artikel |
| `users` | `comments` | One-to-Many (1:N) | 1 user bisa punya banyak komentar |
| `articles` | `comments` | One-to-Many (1:N) | 1 artikel bisa punya banyak komentar |
