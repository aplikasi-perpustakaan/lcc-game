# Permainan Susunan Buku Perpustakaan (LCC Game)

Aplikasi web interaktif pembelajaran dan latihan penyusunan buku mengikut piawaian **Library of Congress Classification (LCC)**. 

Dibina semula sepenuhnya ke standard **HTML5, CSS3, dan Vanilla JavaScript (100% Bebas Flash)** bagi menggantikan versi lama berasaskan Adobe Flash Player yang telah tamat tempoh (*EOL*).

🎮 **Main terus di pelayar (GitHub Pages):**  
[https://aplikasi-perpustakaan.github.io/lcc-game/](https://aplikasi-perpustakaan.github.io/lcc-game/)

---

## 🌟 Ciri-Ciri Utama Versi HTML5

1. **100% Bebas Adobe Flash:**
   - Berfungsi secara terus (*native*) di mana-mana pelayar web moden (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari) tanpa memerlukan pemalam (*plugins*).
2. **Sokongan Pelbagai Peranti & Mod Interaksi:**
   - **Heret & Lepas (Drag & Drop):** Menggunakan HTML5 Drag and Drop API dengan pratonton buku seretan yang jelas dan legap.
   - **Sentuh & Ketik (Touch & Tap-to-Swap):** Sokongan penuh skrin sentuh untuk tablet, iPad, dan telefon pintar.
   - **Ketik untuk Tukar (Click/Tap to Swap):** Klik mana-mana buku pertama, kemudian klik buku sasaran untuk menukar kedudukan dengan mudah.
3. **Bar Kemajuan Sentiasa Kelihatan (Sticky Progress Bar):**
   - Bar terapung di bahagian atas memaparkan bilangan tahap yang telah selesai secara masa nyata (`0 / 10 Selesai (0%)`).
   - Pil nombor tahap interaktif (`1` – `10`): bertukar hijau dengan tanda semak (`✓`) apabila selesai dan boleh diklik untuk melompat terus ke tahap tersebut.
4. **Kesan Bunyi Berasaskan Web Audio API:**
   - Chime harmoni untuk jawapan tepat (*CORRECT!*).
   - Nada lembut untuk jawapan salah (*WRONG*).
   - Tiada kebergantungan fail audio luaran (dijana secara sintetik oleh pelayar).
   - Boleh dimatikan (*Mute*) pada bila-bila masa.
5. **Animasi Konfeti Keraian (Celebratory Confetti):**
   - Letusan zarah konfeti berwarna-warni secara automatik apabila kesemua 10 tahap berjaya diselesaikan.
6. **Petua Asal:**
   - Butang **HINT** yang mengekalkan panduan asal dalam Bahasa Melayu.
7. **Peringatan Petugas & Modal Tahniah:**
   - Modal tahniah automatik selepas kesemua 10 tahap selesai untuk memudahkan semakan petugas perpustakaan.

---

## 📁 Struktur Fail

```text
lcc-game/
│
├── index.html            # Halaman utama aplikasi HTML5 moden
├── sort.html             # Serasi dengan pautan lama (menggunakan enjin HTML5)
│
├── css/
│   └── style.css         # Reka bentuk rak buku 3D, animasi, bar melekat, dan responsif
│
├── js/
│   ├── data.js           # Konfigurasi data 10 tahap, warna, dan nombor panggilan LCC
│   ├── audio.js          # Pengendali kesan bunyi Web Audio API (tanpa fail MP3 luaran)
│   ├── confetti.js       # Enjin animasi konfeti keraian berasaskan HTML5 Canvas
│   └── game.js           # Logik permainan, drag-and-drop, tap-to-swap, dan semakan susunan
│
└── README.md             # Dokumentasi projek
```

---

## 🚀 Cara Menjalankan Aplikasi

Aplikasi ini tidak memerlukan pelayan web (*web server*) yang rumit atau pemasangan perisian tambahan.

1. Buka folder projek dalam Windows Explorer.
2. Dwiklik fail **[index.html](file:///D:/GitHub/aplikasi-perpustakaan/lcc-game/index.html)** atau **[sort.html](file:///D:/GitHub/aplikasi-perpustakaan/lcc-game/sort.html)**.
3. Aplikasi akan dibuka serta-merta dalam pelayar web pilihan anda.

---

## 📚 Ringkasan 10 Tahap & Peraturan LCC

| Tahap | Kelas Utama / Subjek | Konsep Pengkelasan yang Diuji | Petua Asal |
|:---:|:---|:---|:---|
| **1** | `HQ72` – `HQ73` | Nilai perpuluhan nombor pengarang (*Cutter*), salinan (*copy*), dan edisi tahun. | *Dimulakan dengan buku kuning. Diakhiri dengan buku hijau* |
| **2** | `Q284.2` – `Q284.3` | Turutan nombor perpuluhan kelas, susunan abjad Cutter, dan penanda `x`. | *Dimulakan dengan 2 buku biru. Diakhiri dengan "x"* |
| **3** | `HB`, `HC`, `HD` | Susunan abjad huruf kelas utama dan turutan nombor bulat subkelas. | *HB,HC,HD..* |
| **4** | `J133` | Keutamaan nombor siri penerbitan/tahun berbanding titik perpuluhan. | *Nombor lebih utama dari titik perpuluhan. Diakhiri dengan buku kuning* |
| **5** | `RC793` | Turutan tahun penerbitan, pecahan perpuluhan kelas, dan susunan Cutter. | *Buku kelabu ditengah-tengah.* |
| **6** | `ND6108` – `ND6109` | Nilai perpuluhan nombor Cutter berganda (contoh: .M263 mendahului .M3). | *A6 sebelum A7.* |
| **7** | `QA71` – `QA76.3` | Mengabaikan awalan lokasi perpustakaan (*location prefix* seperti `UrbLib`). | *B2x lebih utama dari B23. Abaikan "Urblib"* |
| **8** | `PS118.6` – `PS119.51` | Susunan jilid (*vol.*), tahun salinan, dan penomboran bertingkat. | *Dimulakan dengan buku hijau. Diakhiri dengan buku kuning* |
| **9** | `ND893` – `NK894` | Peralihan antara dua kelas berbeza (`ND` sebelum `NK`) dan edisi tahun. | *Anda mampu selesaikan sendiri..* |
| **10** | `BS497` | Penguasaan penuh nilai perpuluhan nombor pengarang (*Cutter numbers*). | *Kacang..* |
