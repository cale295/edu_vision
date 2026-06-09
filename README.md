# EduVision AI 🎓

EduVision AI adalah aplikasi web cerdas bertenaga AI untuk menganalisis diagram pendidikan (seperti diagram database ERD, diagram kelas UML, diagram arsitektur, dll.) secara instan dan menghasilkan kuis evaluasi pemahaman otomatis menggunakan **Gemini 2.5 Flash**.

Aplikasi ini dibangun menggunakan **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, dan **Framer Motion**.

---

## ✨ Fitur Utama

- 🔍 **Analisis Visual Diagram**: Menggunakan model visi canggih dari Gemini untuk mendeteksi tipe diagram, mendeskripsikan alur, mengidentifikasi komponen kunci, dan memberikan penjelasan komprehensif.
- 📝 **Kuis Latihan Pemahaman**: Secara dinamis menghasilkan 5 pertanyaan pilihan ganda yang relevan dengan diagram yang diunggah untuk menguji pemahaman pengguna.
- 🌓 **Tema Gelap & Terang Premium**: Perpindahan tema yang mulus dengan transisi warna yang elegan dan performa tinggi (bebas dari *hydration flash*).
- 📂 **Metode Unggah Fleksibel**:
  - Drag and drop (tarik & lepas) file gambar.
  - Eksplorasi file lokal.
  - Tempel langsung dari clipboard (**Ctrl+V** atau **Cmd+V**).
- 💫 **Desain Interaktif & Premium**: Antarmuka modern yang dinamis dengan efek *glassmorphism*, ornamen latar belakang bercahaya (*floating orbs*), dan mikro-animasi menggunakan Framer Motion.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: [Next.js 16](https://nextjs.org/) (App Router), React 19, TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animasi**: [Framer Motion](https://www.framer.com/motion/)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **AI Integration**: [Google Gemini SDK](https://ai.google.dev/)

---

## 🚀 Memulai Pengoperasian

### 1. Prasyarat
Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) (versi 18 ke atas disarankan).

### 2. Klon Repositori & Instal Dependensi
```bash
# Instal modul node
npm install
```

### 3. Konfigurasi Variabel Lingkungan (Environment Variables)
Buat berkas `.env.local` di root direktori proyek Anda dan tambahkan kunci API Gemini Anda:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Menjalankan Server Pengembangan
Jalankan dev server dengan perintah berikut:
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda untuk melihat aplikasi berjalan.

### 5. Membangun Proyek untuk Produksi
```bash
npm run build
npm start
```

---

## 💡 Mengatasi Masalah Tema (Troubleshooting Theme Mode)

Proyek ini menggunakan **Tailwind CSS v4** dengan pendekatan konfigurasi berbasis CSS. Jika Anda melihat perubahan tema hanya memengaruhi beberapa bagian (seperti scrollbar) sementara warna latar belakang utama halaman tetap gelap (saat mode terang diaktifkan), hal ini biasanya terjadi karena **Next.js Turbopack dev server melakukan caching pada styles**.

**Solusi:**
Hentikan server pengembangan Anda di terminal (`Ctrl + C`) lalu jalankan kembali:
```bash
npm run dev
```
Menyalakan ulang dev server akan memaksa Tailwind CSS v4 memuat ulang konfigurasi `@custom-variant` di `globals.css` sehingga mode terang dan gelap dapat berfungsi penuh dan responsif terhadap tombol toggle.
