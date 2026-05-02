# Flowchart — Alur Proses Bisnis
## Sistem Blog API

---

| Atribut | Detail |
|---|---|
| **Nama Proyek** | Blog REST API System |
| **Versi Dokumen** | 1.0 |
| **Tanggal Dibuat** | 2 Mei 2026 |
| **Dibuat Oleh** | System Analyst |

---

## 1. Notasi Flowchart yang Digunakan

| Simbol | Bentuk | Arti |
|---|---|---|
| `( )` | Oval / Rounded | Start / End |
| `[ ]` | Kotak / Rectangle | Proses / Aksi |
| `< >` | Belah ketupat / Diamond | Keputusan (Ya / Tidak) |
| `-->` | Panah | Alur / Arah |

---

## 2. Flowchart: Proses Register

**Deskripsi:** Alur ketika seorang Guest ingin mendaftar akun baru.

```
        ( START )
            |
            ▼
  [ Guest mengirim data:       ]
  [ name, email, password      ]
            |
            ▼
  < Data lengkap & valid? >
     /              \
   Tidak            Ya
    |                |
    ▼                ▼
[ Kirim error    [ Cek email di database ]
  400 Bad Req ]       |
                      ▼
             < Email sudah terdaftar? >
                /              \
              Ya               Tidak
               |                 |
               ▼                 ▼
         [ Kirim error     [ Hash password     ]
           409 Conflict ]  [ dengan bcrypt     ]
                                 |
                                 ▼
                        [ Simpan user baru    ]
                        [ ke tabel users      ]
                        [ role = 'reader'     ]
                                 |
                                 ▼
                        [ Kirim respons 201   ]
                        [ Created + data user ]
                                 |
                                 ▼
                             ( END )
```

---

## 3. Flowchart: Proses Login

**Deskripsi:** Alur ketika pengguna terdaftar ingin masuk ke sistem.

```
        ( START )
            |
            ▼
  [ Pengguna mengirim:         ]
  [ email & password           ]
            |
            ▼
  < Format email valid? >
     /           \
   Tidak          Ya
    |              |
    ▼              ▼
[ Error 400 ]  [ Cari user berdasarkan email ]
                   |
                   ▼
          < User ditemukan? >
             /          \
           Tidak          Ya
            |              |
            ▼              ▼
       [ Error 401 ]  [ Bandingkan password    ]
                      [ input vs hash di DB    ]
                           |
                           ▼
                  < Password cocok? >
                     /          \
                   Tidak          Ya
                    |              |
                    ▼              ▼
               [ Error 401 ]  [ Buat JWT token        ]
                              [ payload: id,email,role ]
                              [ expiry: 24 jam         ]
                                   |
                                   ▼
                              [ Kirim respons 200 ]
                              [ + token + data user]
                                   |
                                   ▼
                               ( END )
```

---

## 4. Flowchart: Middleware Autentikasi

**Deskripsi:** Alur pengecekan token JWT yang dijalankan di SETIAP endpoint yang membutuhkan login. Flowchart ini dipanggil sebelum logika utama endpoint berjalan.

```
        ( START — Request Masuk )
                |
                ▼
  [ Ambil token dari Header:      ]
  [ Authorization: Bearer <token> ]
                |
                ▼
      < Token ada? >
        /        \
      Tidak        Ya
       |            |
       ▼            ▼
  [ Error 401 ] [ Verifikasi signature JWT ]
                      |
                      ▼
           < JWT valid & belum expired? >
              /                \
            Tidak               Ya
             |                   |
             ▼                   ▼
        [ Error 401 ]    [ Ekstrak payload JWT   ]
                         [ { id, email, role }   ]
                                  |
                                  ▼
                         [ Simpan data user       ]
                         [ ke request object      ]
                                  |
                                  ▼
                      ( Lanjut ke Handler Endpoint )
```

---

## 5. Flowchart: Buat Artikel Baru

**Deskripsi:** Alur ketika Author ingin membuat artikel baru.

```
        ( START )
            |
            ▼
  [ Author mengirim: title,      ]
  [ content, status (opsional)   ]
  [ + token di header            ]
            |
            ▼
  [ Jalankan Middleware Auth ]  ← (lihat Flowchart 4)
            |
            ▼
  < Token valid? >
     /        \
   Tidak        Ya
    |            |
    ▼            ▼
[ Error 401 ] < Role adalah 'author' atau 'admin'? >
                 /                  \
               Tidak                 Ya
                |                    |
                ▼                    ▼
          [ Error 403 ]   < Data valid (title & content ada)? >
                               /              \
                             Tidak             Ya
                              |                |
                              ▼                ▼
                         [ Error 400 ] [ Simpan artikel ke DB      ]
                                       [ user_id = id dari token   ]
                                       [ status default = 'draft'  ]
                                               |
                                               ▼
                                      [ Kirim respons 201 ]
                                      [ + data artikel baru]
                                               |
                                               ▼
                                           ( END )
```

---

## 6. Flowchart: Edit / Hapus Artikel

**Deskripsi:** Alur ketika Author atau Admin ingin mengubah atau menghapus artikel.

```
        ( START )
            |
            ▼
  [ Jalankan Middleware Auth ]
            |
            ▼
  < Token valid? >
     /        \
   Tidak        Ya
    |            |
    ▼            ▼
[ Error 401 ] [ Cari artikel berdasarkan ID ]
                   |
                   ▼
          < Artikel ditemukan? >
             /           \
           Tidak           Ya
            |               |
            ▼               ▼
       [ Error 404 ]  < Role = 'admin'? >
                        /          \
                       Ya          Tidak
                        |            |
                        ▼            ▼
               [ Izin penuh ]  < user_id artikel = id dari token? >
                        |        /                    \
                        |      Ya                     Tidak
                        |       |                       |
                        |       ▼                       ▼
                        |  [ Izin diberikan ]      [ Error 403 ]
                        |       |
                        └───────┘
                              |
                              ▼
                   < Aksi yang dilakukan? >
                      /              \
                    Edit             Hapus
                     |                 |
                     ▼                 ▼
              [ Update field ]   [ Hapus komentar   ]
              [ di database  ]   [ terkait (CASCADE)]
                     |                 |
                     |           [ Hapus artikel    ]
                     |                 |
                     └────────┬────────┘
                              ▼
                     [ Kirim respons 200 ]
                              |
                              ▼
                          ( END )
```

---

## 7. Flowchart: Buat Komentar

**Deskripsi:** Alur ketika pengguna yang sudah login ingin memberikan komentar.

```
        ( START )
            |
            ▼
  [ Pengguna mengirim content komentar ]
  [ + token di header                  ]
            |
            ▼
  [ Jalankan Middleware Auth ]
            |
            ▼
  < Token valid? >
     /        \
   Tidak        Ya
    |            |
    ▼            ▼
[ Error 401 ] [ Cari artikel berdasarkan :id di URL ]
                   |
                   ▼
          < Artikel ditemukan & status = 'published'? >
               /                      \
             Tidak                     Ya
              |                         |
              ▼                         ▼
         [ Error 404 ]       < Content komentar ada? >
                                /              \
                              Tidak             Ya
                               |                |
                               ▼                ▼
                          [ Error 400 ] [ Simpan komentar ke DB     ]
                                        [ user_id = id dari token   ]
                                        [ article_id = :id dari URL ]
                                                |
                                                ▼
                                       [ Kirim respons 201 ]
                                               |
                                               ▼
                                           ( END )
```

---

## 8. Ringkasan Kode Status HTTP per Kondisi

| Kondisi | HTTP Status |
|---|---|
| Sukses membuat data baru | 201 Created |
| Sukses membaca / update / hapus | 200 OK |
| Data input tidak valid / kosong | 400 Bad Request |
| Token tidak ada atau tidak valid | 401 Unauthorized |
| Peran tidak memiliki izin | 403 Forbidden |
| Data yang dicari tidak ada | 404 Not Found |
| Konflik data (email duplikat) | 409 Conflict |
| Kesalahan di sisi server | 500 Internal Server Error |
