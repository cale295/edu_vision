# EduVision AI 🎓

EduVision AI adalah aplikasi web yang membantu menganalisis berbagai jenis diagram pendidikan, seperti ERD, UML Class Diagram, dan diagram arsitektur. Setelah diagram diunggah, aplikasi akan memberikan penjelasan mengenai isi diagram serta membuat kuis pilihan ganda secara otomatis menggunakan **Gemini 2.5 Flash**.

Aplikasi ini dibangun menggunakan **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, dan **Framer Motion**.

---

## ✨ Fitur

* 🔍 **Analisis Diagram Otomatis**

  * Mengidentifikasi jenis diagram yang diunggah.
  * Menjelaskan komponen-komponen penting dalam diagram.
  * Memberikan ringkasan dan penjelasan alur diagram.

* 📝 **Pembuatan Kuis Otomatis**

  * Menghasilkan 5 soal pilihan ganda berdasarkan diagram yang diunggah.
  * Membantu pengguna mengukur pemahaman terhadap materi yang dianalisis.

* 🌓 **Mode Terang dan Gelap**

  * Mendukung pergantian tema terang dan gelap.
  * Tampilan tema tersimpan dan diterapkan secara konsisten.

* 📂 **Berbagai Metode Upload**

  * Drag and drop gambar.
  * Pilih file dari perangkat.
  * Tempel gambar langsung dari clipboard menggunakan **Ctrl + V** atau **Cmd + V**.

* 💫 **Antarmuka Interaktif**

  * Dibuat dengan tampilan modern menggunakan Tailwind CSS.
  * Menggunakan animasi ringan dari Framer Motion untuk meningkatkan pengalaman pengguna.

---

## 🛠️ Teknologi yang Digunakan

* **Frontend:** Next.js 16 (App Router), React 19, TypeScript
* **Styling:** Tailwind CSS v4
* **Animasi:** Framer Motion
* **Ikon:** Lucide React
* **AI:** Google Gemini SDK

---

## 🚀 Menjalankan Proyek

### 1. Prasyarat

Pastikan telah menginstal Node.js versi 18 atau lebih baru.

### 2. Instal Dependensi

```bash
npm install
```

### 3. Konfigurasi Environment Variable

Buat file `.env.local` pada root proyek dan tambahkan API key Gemini:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Menjalankan Development Server

```bash
npm run dev
```

Buka `http://localhost:3000` pada browser untuk melihat aplikasi berjalan.

### 5. Build untuk Produksi

```bash
npm run build
npm start
```

---

## 🔧 Troubleshooting Tema

Jika perubahan tema hanya memengaruhi sebagian elemen (misalnya scrollbar) sementara warna halaman tidak berubah, kemungkinan penyebabnya adalah cache dari Turbopack saat proses development.

Hentikan server yang sedang berjalan:

```bash
Ctrl + C
```

Kemudian jalankan kembali:

```bash
npm run dev
```

Setelah server dijalankan ulang, konfigurasi tema pada Tailwind CSS akan dimuat kembali dan perubahan mode terang/gelap akan diterapkan dengan benar.
