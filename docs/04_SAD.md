# System Architecture Design (SAD)
## Sistem Blog API

---

| Atribut | Detail |
|---|---|
| **Nama Proyek** | Blog REST API System |
| **Versi Dokumen** | 1.0 |
| **Tanggal Dibuat** | 2 Mei 2026 |
| **Dibuat Oleh** | System Analyst |
| **Pola Arsitektur** | Clean Architecture |
| **Referensi** | BRD v1.0, SRS v1.0, ERD v1.0 |

---

## 1. Pendahuluan

Dokumen ini menguraikan arsitektur perangkat lunak untuk sistem Blog REST API. Sistem ini dirancang menggunakan konsep **Clean Architecture** (berdasarkan prinsip Robert C. Martin). Tujuan utama dari pendekatan ini adalah untuk memisahkan logika bisnis inti (core business rules) dari detail infrastruktur (seperti framework Express.js dan database MySQL), sehingga sistem menjadi lebih mudah untuk diuji (testable), dikelola (maintainable), dan tidak bergantung erat pada alat (framework/database independent).

---

## 2. Prinsip Clean Architecture

Clean Architecture membagi perangkat lunak menjadi lapisan-lapisan (layers) konsentris. Aturan dasarnya adalah **Dependency Rule**: *Ketergantungan source code hanya boleh mengarah ke dalam.* Bagian dalam arsitektur tidak boleh tahu apa-apa tentang bagian luarnya.

Arsitektur sistem Blog API ini dibagi menjadi 4 lapisan (layer) utama:

1. **Entities (Domain Layer)**
2. **Use Cases (Application Layer)**
3. **Interface Adapters (Adapter Layer)**
4. **Frameworks & Drivers (Infrastructure Layer)**

---

## 3. Detail Lapisan Arsitektur

### 3.1 Entities (Enterprise Business Rules)
Merupakan objek bisnis tingkat perusahaan atau aplikasi. Entitas mengenkapsulasi aturan bisnis yang paling umum dan tingkat tinggi.
- **User Entity**: Merepresentasikan pengguna sistem dengan atribut `id`, `name`, `email`, `password`, dan `role`.
- **Article Entity**: Merepresentasikan tulisan blog dengan atribut `id`, `user_id`, `title`, `content`, `status`, dsb.
- **Comment Entity**: Merepresentasikan komentar pada sebuah artikel.

### 3.2 Use Cases (Application Business Rules)
Berisi aturan bisnis spesifik aplikasi. Lapisan ini mengorkestrasi aliran data dari dan ke entitas, serta mengarahkan entitas tersebut untuk menggunakan aturan bisnis guna mencapai tujuan Use Case. Lapisan ini meliputi fungsionalitas utama seperti:
- **Auth**: `RegisterUser`, `LoginUser`, `LogoutUser`
- **Article**: `CreateArticle`, `GetArticles`, `GetArticleDetail`, `UpdateArticle`, `DeleteArticle`
- **Comment**: `CreateComment`, `DeleteComment`

### 3.3 Interface Adapters
Merupakan kumpulan adapter yang mengkonversi data dari format yang paling nyaman bagi *Use Cases* dan *Entities*, menjadi format yang paling nyaman bagi lapisan eksternal (*Web*, *Database*).
- **Controllers**: Mengubah request HTTP dari Express menjadi parameter untuk Use Case, dan mengubah hasil Use Case menjadi response HTTP (JSON).
- **Repositories (Data Access Adapters)**: Implementasi dari *interface* repositori yang didefinisikan di Use Case. Bertugas melakukan *query* SQL ke MySQL (menggunakan *driver* database) tanpa Use Case mengetahui adanya MySQL.

### 3.4 Frameworks & Drivers (Infrastructure)
Lapisan terluar yang umumnya terdiri dari framework dan *tools*. Pada sistem ini:
- **Web Framework**: Express.js (Node.js runtime)
- **Database**: MySQL Server
- **Security & Utilities**: `bcrypt` untuk hashing password, `jsonwebtoken` (JWT) untuk autentikasi token.

---

## 4. Struktur Direktori

Berdasarkan Clean Architecture, struktur *source code* akan diorganisir sebagai berikut:

```text
src/
├── core/                       # 1. Lapisan Dalam (Domain / Entities)
│   ├── entities/               # Definisi Class/Type Entitas (User, Article, Comment)
│   └── interfaces/             # Kontrak/Interface (IUserRepository, IArticleRepository)
├── use_cases/                  # 2. Lapisan Aplikasi (Use Cases)
│   ├── auth/                   # Register, Login, Logout Use Cases
│   ├── article/                # Create, Edit, Delete, Read Article Use Cases
│   └── comment/                # Create, Delete Comment Use Cases
├── adapters/                   # 3. Lapisan Antarmuka
│   ├── controllers/            # HTTP Controllers (menerima input HTTP, memanggil Use Case)
│   └── repositories/           # Implementasi akses MySQL berdasarkan interface core
├── infrastructure/             # 4. Lapisan Infrastruktur & Framework
│   ├── web/                    # Express app, Routes, dan Middlewares (termasuk Auth Middleware)
│   ├── database/               # Konfigurasi & Koneksi MySQL
│   └── security/               # Implementasi Hash (bcrypt) dan Token (JWT)
└── main.js / index.js          # Entry Point & Dependency Injection (Composition Root)
```

---

## 5. Aliran Proses (Data Flow) - Contoh Kasus

### Skenario: Membuat Artikel Baru (`POST /api/articles`)

1. **Client (Web/Mobile)** mengirim HTTP `POST` request beserta `Authorization: Bearer <token>` dan JSON *body* ke `/api/articles`.
2. **Infrastructure Layer (Express Router & Middleware)**:
   - `AuthMiddleware` memverifikasi JWT token. Jika valid, ID user dari token diteruskan dalam *request object*.
   - Router mengarahkan *request* ke `ArticleController`.
3. **Adapter Layer (ArticleController)**:
   - Mengekstrak data `title`, `content` dari HTTP *body* dan `user_id` dari token.
   - Memanggil fungsionalitas utama di `CreateArticleUseCase`.
4. **Application Layer (CreateArticleUseCase)**:
   - Menerima DTO (Data Transfer Object) dari *controller*.
   - Menginstansiasi `Article Entity` dan memastikan aturan bisnis (contoh: validasi role "author").
   - Memanggil `IArticleRepository.save(article)` untuk persistensi data.
5. **Adapter Layer (ArticleRepository MySQL)**:
   - Menjalankan `INSERT INTO articles ...` ke server database menggunakan driver MySQL.
6. **Infrastructure Layer (MySQL Database)**:
   - Menyimpan data dan mengembalikan konfirmasi (ID *insert*).
7. **Proses Kembali**:
   - Repository mengembalikan data ke Use Case.
   - Use Case mengembalikan *result* ke Controller.
   - Controller menyusun JSON respons HTTP berstatus `201 Created` dan mengirimkannya kembali ke **Client**.

---

## 6. Komponen dan Relasi Utama (High Level)

```text
  [HTTP Client]
       │
       ▼
┌──────────────────────────────────────────┐
│  Infrastructure Layer (Frameworks)       │
│  - Express.js (Router, Web Server)       │
│  - JWT Auth Middleware                   │
└──────┬───────────────────────────────────┘
       │ Request Data
       ▼
┌──────────────────────────────────────────┐
│  Adapter Layer (Controllers)             │
│  - AuthController, ArticleController     │
│  - Menyusun Data Transfer Object (DTO)   │
└──────┬───────────────────────────────────┘
       │ DTO (Input)
       ▼
┌──────────────────────────────────────────┐
│  Application Layer (Use Cases)           │
│  - Aturan bisnis & orkestrasi            │
│  - LoginUser, CreateArticle, dll         │
└──────┬─────────────────────────────┬─────┘
       │ DTO / Interface             │
       ▼                             ▼
┌──────────────────────┐  ┌──────────────────────┐
│  Domain Layer        │  │  Adapter Layer       │
│  (Entities)          │  │  (Repositories)      │
│  - Aturan bisnis     │  │  - UserRepository    │
│    tingkat tinggi    │  │  - ArticleRepository │
└──────────────────────┘  └──────────┬───────────┘
                                     │ SQL Query
                                     ▼
                          ┌──────────────────────┐
                          │  Infrastructure      │
                          │  - MySQL Database    │
                          └──────────────────────┘
```

Dengan struktur ini, perubahan pada database atau web framework di masa depan dapat dilakukan di *Infrastructure Layer* atau *Adapter Layer* tanpa perlu mengubah logika bisnis utama di *Use Cases* maupun *Entities*.
