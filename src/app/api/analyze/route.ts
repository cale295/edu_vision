import { NextRequest, NextResponse } from 'next/server';
import { analyzeDiagramWithGemini } from '@/lib/gemini';
import { AnalysisResult, AnalysisResponse } from '@/types/analysis';

// Simulated delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Smart Mock Data Templates
const MOCK_FLOWCHART: AnalysisResult = {
  diagramType: 'Flowchart (Sistem Pemrosesan Pesanan)',
  explanation: 'Diagram ini menggambarkan logika bisnis langkah demi langkah untuk memproses pesanan pelanggan, mulai dari pengiriman keranjang belanja ke checkout, verifikasi stok barang, otorisasi pembayaran, hingga inisialisasi pengiriman produk.',
  components: [
    'Permintaan Checkout Pengguna: Titik awal di mana pelanggan mengirimkan pesanan mereka.',
    'Keputusan Verifikasi Stok: Pengecekan untuk memastikan barang tersedia di gudang. Mengalir ke pengurangan stok atau pemberitahuan habis.',
    'Portal Gateway Pembayaran: Berkoordinasi dengan penyedia pembayaran eksternal untuk mengotorisasi transaksi.',
    'Database Sistem Inventaris: Memperbarui tingkat stok setelah pembayaran berhasil.',
    'Pemicu Antrean Pengiriman: Memulai proses pengiriman fisik dan menghasilkan nomor resi pelacakan untuk pelanggan.'
  ],
  summary: 'Alur proses transaksional e-commerce standar yang merinci logika pengecekan inventaris, kliring pembayaran, dan perutean pengiriman akhir.',
  improvements: [
    'Tambahkan blok mekanisme percobaan ulang otomatis untuk pembayaran yang gagal sebelum membatalkan pesanan.',
    'Perkenalkan jalur paralel untuk produk digital agar melewati langkah pengiriman fisik untuk mengoptimalkan kecepatan.',
    'Definisikan secara jelas jalur penanganan kesalahan jika terjadi timeout pada integrasi API eksternal.'
  ],
  questions: [
    {
      question: 'Apa pemeriksaan kondisi utama yang dilakukan setelah pengguna memicu permintaan checkout?',
      options: [
        'A. Verifikasi status autentikasi pengguna',
        'B. Validasi ketersediaan stok barang di gudang',
        'C. Verifikasi kode keamanan kartu kredit',
        'D. Perhitungan biaya pengiriman logistik'
      ],
      answer: 'B. Validasi ketersediaan stok barang di gudang',
      explanation: 'Memeriksa stok produk segera mencegah penerimaan pembayaran untuk barang yang habis, menjaga kepercayaan pengguna dan menghindari refund.'
    },
    {
      question: 'Jika terjadi kegagalan pembayaran, tindakan alur kerja apa yang ditunjukkan dalam diagram?',
      options: [
        'A. Tetap mengirimkan pesanan secara langsung',
        'B. Mengirimkan notifikasi email dan mengarahkan ke pembatalan pesanan',
        'C. Mengarahkan pelanggan untuk menghubungi dukungan telepon',
        'D. Mencoba kembali pembayaran sebanyak 10 kali secara terus menerus'
      ],
      answer: 'B. Mengirimkan notifikasi email dan mengarahkan ke pembatalan pesanan',
      explanation: 'Alur kerja saat ini langsung mengarah ke pembatalan disertai notifikasi email pengguna. Penambahan blok percobaan ulang disarankan sebagai perbaikan.'
    },
    {
      question: 'Komponen mana yang mewakili node terminal (titik akhir) dari alur proses ini?',
      options: [
        'A. Keputusan Verifikasi Stok',
        'B. Pembaruan Database Inventaris',
        'C. Pemicu Antrean Pengiriman & Notifikasi Selesai',
        'D. Portal Gateway Pembayaran'
      ],
      answer: 'C. Pemicu Antrean Pengiriman & Notifikasi Selesai',
      explanation: 'Node terminal mewakili titik awal atau akhir absolut dari flowchart. Pemicu pengiriman menyelesaikan seluruh rangkaian pemrosesan.'
    },
    {
      question: 'Bentuk simbol apa yang biasanya digunakan dalam flowchart standar untuk menggambarkan langkah keputusan seperti "Verifikasi Stok"?',
      options: [
        'A. Oval (Mulai/Selesai)',
        'B. Belah Ketupat / Diamond (Keputusan/Kondisi)',
        'C. Persegi Panjang (Proses/Aksi)',
        'D. Jajaran Genjang (Input/Output)'
      ],
      answer: 'B. Belah Ketupat / Diamond (Keputusan/Kondisi)',
      explanation: 'Dalam konvensi flowchart, simbol belah ketupat digunakan untuk mewakili percabangan logika atau titik keputusan yang memerlukan evaluasi kondisi.'
    },
    {
      question: 'Bagaimana integrasi database digambarkan dalam alur proses ini?',
      options: [
        'A. Berjalan secara asinkron setelah pengiriman sampai di pelanggan',
        'B. Diperbarui hanya ketika pembayaran berhasil diotorisasi',
        'C. Terjadi sebelum permintaan checkout dikirimkan',
        'D. Benar-benar terpisah dan tidak ditampilkan'
      ],
      answer: 'B. Diperbarui hanya ketika pembayaran berhasil diotorisasi',
      explanation: 'Pengurangan jumlah stok di Database Sistem Inventaris dipicu hanya setelah Gateway Pembayaran mengonfirmasi otorisasi berhasil.'
    }
  ]
};

const MOCK_UML: AnalysisResult = {
  diagramType: 'Diagram Kelas UML (Katalog E-Commerce)',
  explanation: 'Diagram Kelas UML ini merancang cetak biru struktural dari sistem katalog e-commerce. Ini menguraikan kelas-kelas seperti User, Customer, Admin, Product, Category, dan Order, termasuk atribut, metode, dan struktur hubungan antarkelas.',
  components: [
    'User (Abstract Class): Berisi atribut dasar seperti id, email, dan password, yang diwarisi oleh Customer dan Admin.',
    'Product Class: Menyimpan detail deskripsi, harga, SKU, dan stok, dilengkapi metode untuk memperbarui harga serta inventaris.',
    'Category Class: Mengelompokkan produk terkait dengan dukungan hierarki referensi diri (kategori induk-anak).',
    'Order Class: Mewakili transaksi pelanggan, menghubungkan satu Customer ke banyak Product melalui kelas pembantu OrderItem.',
    'Asosiasi: Menunjukkan hubungan seperti "One-to-Many" antara Customer dan Order, serta "Many-to-Many" antara Product dan Category.'
  ],
  summary: 'Struktur berorientasi objek yang memetakan entitas e-commerce, menunjukkan pewarisan dari kelas User bersama dan komposisi relasional modular untuk produk dan keranjang belanja.',
  improvements: [
    'Gunakan komposisi daripada pewarisan untuk peran User jika pelanggan dapat menjadi admin, menghindari pohon kelas yang kaku.',
    'Tentukan pengubah akses (public "+", private "-", protected "#") untuk semua atribut dan metode kelas.',
    'Perkenalkan kelas PriceHistory terpisah untuk melacak riwayat harga produk tanpa mengotori kelas Product utama.'
  ],
  questions: [
    {
      question: 'Model representasi UML mana yang digunakan untuk menunjukkan bahwa Admin dan Customer mewarisi sifat dari kelas User?',
      options: [
        'A. Komposisi (Panah berlian hitam/solid)',
        'B. Agregasi (Panah berlian putih/kosong)',
        'C. Generalisasi / Pewarisan (Garis solid dengan panah segitiga kosong)',
        'D. Dependensi (Garis putus-putus dengan panah terbuka)'
      ],
      answer: 'C. Generalisasi / Pewarisan (Garis solid dengan panah segitiga kosong)',
      explanation: 'Dalam UML, hubungan pewarisan (generalisasi) digambarkan dengan garis solid yang menunjuk ke arah kelas induk dengan ujung panah berbentuk segitiga kosong.'
    },
    {
      question: 'Apa keuntungan struktural menggunakan kelas abstrak (abstract class) untuk User dalam diagram ini?',
      options: [
        'A. Memungkinkan instansiasi langsung dari objek User umum',
        'B. Mengenkapsulasi properti bersama seperti kredensial login untuk mencegah redundansi kode',
        'C. Meningkatkan kecepatan kueri pencarian database',
        'D. Menggantikan kebutuhan akan database relasional sepenuhnya'
      ],
      answer: 'B. Mengenkapsulasi properti bersama seperti kredensial login untuk mencegah redundansi kode',
      explanation: 'Kelas abstrak berisi atribut dan metode umum yang diwarisi oleh subclass, menjaga prinsip DRY (Don\'t Repeat Yourself) dalam desain perangkat lunak.'
    },
    {
      question: 'Jika suatu Produk dapat berada di banyak kategori, dan satu kategori memiliki banyak produk, bagaimana hubungan ini digambarkan?',
      options: [
        'A. Satu Kategori hanya dimiliki oleh satu User',
        'B. Asosiasi Many-to-Many (Banyak-ke-Banyak) antara Product dan Category',
        'C. Pewarisan langsung (Product mewarisi kelas Category)',
        'D. Tidak ada koneksi yang terjalin'
      ],
      answer: 'B. Asosiasi Many-to-Many (Banyak-ke-Banyak) antara Product dan Category',
      explanation: 'Diagram menunjukkan hubungan asosiasi dua arah many-to-many, memungkinkan pengelompokan produk yang fleksibel dalam berbagai konteks katalog.'
    },
    {
      question: 'Bagaimana variabel dengan visibilitas private ditandai dalam kotak kelas UML standar?',
      options: [
        'A. Ditandai dengan awalan "+"',
        'B. Ditandai dengan awalan "#"',
        'C. Ditandai dengan awalan "-"',
        'D. Dibungkus dalam tanda kurung siku []'
      ],
      answer: 'C. Ditandai dengan awalan "-"',
      explanation: 'Konvensi simbol UML menetapkan "-" untuk visibilitas private, "+" untuk public, dan "#" untuk protected.'
    },
    {
      question: 'Mengapa kelas OrderItem dimodelkan secara terpisah antara Product dan Order?',
      options: [
        'A. Untuk menyimpan cadangan gambar produk',
        'B. Untuk menangkap data transaksional spesifik pembelian (seperti harga saat beli dan jumlah kuantitas) untuk produk tersebut di dalam pesanan',
        'C. Untuk memungkinkan pengguna menghapus riwayat akun mereka',
        'D. Untuk menghindari kesalahan kompilasi pada React'
      ],
      answer: 'B. Untuk menangkap data transaksional spesifik pembelian (seperti harga saat beli dan jumlah kuantitas) untuk produk tersebut di dalam pesanan',
      explanation: 'Kelas asosiasi (atau tabel perantara) seperti OrderItem sangat penting untuk mencatat data spesifik transaksi yang dapat berubah dari waktu ke waktu, seperti harga beli historis.'
    }
  ]
};

const MOCK_ERD: AnalysisResult = {
  diagramType: 'Diagram Hubungan Entitas (Sistem Manajemen Perpustakaan)',
  explanation: 'ERD ini menggambarkan skema database relasional untuk sistem manajemen perpustakaan. Ini memetakan entitas termasuk Buku, Penulis, Anggota, dan Peminjaman, merinci kunci asing (foreign key), atribut komposit, dan indikator kardinalitas.',
  components: [
    'Entitas Buku: Kunci utama book_id, atribut judul, ISBN, tahun_terbit, dan genre.',
    'Entitas Anggota: Menyimpan data patron_id, nama, email, dan tanggal_registrasi.',
    'Entitas Peminjaman: Tabel pemetaan relasional untuk transaksi peminjaman buku dengan tanggal_pinjam, tanggal_kembali, dan status_pinjam.',
    'Entitas Penulis: Menyimpan biografi penulis, terhubung via entitas relasi Buku_Penulis untuk mendukung kolaborasi banyak penulis.',
    'Kardinalitas: Menggunakan notasi Crow\'s Foot untuk menunjukkan bahwa seorang Anggota dapat memiliki 0 hingga banyak Peminjaman.'
  ],
  summary: 'Skema relasional ternormalisasi untuk mengelola peminjaman buku, menggunakan tabel penghubung untuk menangani hubungan banyak-ke-banyak (many-to-many) antara buku dan penulis.',
  improvements: [
    'Perkenalkan log riwayat transaksi peminjaman terpartisi berdasarkan tahun untuk mengoptimalkan kueri pencarian tabel Peminjaman aktif.',
    'Pastikan kolom email memiliki indeks unik (unique constraint).',
    'Tambahkan batasan cek status (check constraint) pada tabel Peminjaman (misalnya nilai dibatasi hanya "dipinjam", "kembali", "terlambat").'
  ],
  questions: [
    {
      question: 'Notasi jenis apa yang digunakan dalam ERD ini untuk menunjukkan kardinalitas entitas (misal hubungan 1-ke-banyak)?',
      options: [
        'A. Garis Panah UML',
        'B. Notasi Crow\'s Foot (garis cabang kaki gagak dengan lingkaran/garis tegak)',
        'C. Angka biner (0 dan 1)',
        'D. Simbol belah ketupat flowchart'
      ],
      answer: 'B. Notasi Crow\'s Foot (garis cabang kaki gagak dengan lingkaran/garis tegak)',
      explanation: 'Notasi Crow\'s Foot adalah standar visual dalam ERD untuk merepresentasikan hubungan, batas kardinalitas, dan opsionalitas hubungan antar entitas.'
    },
    {
      question: 'Entitas mana yang berfungsi sebagai tabel penghubung untuk menjembatani hubungan many-to-many antara Buku dan Anggota?',
      options: [
        'A. Penulis',
        'B. Peminjaman',
        'C. Cabang Perpustakaan',
        'D. Penerbit'
      ],
      answer: 'B. Peminjaman',
      explanation: 'Seorang anggota meminjam banyak buku, dan sebuah buku dapat dipinjam oleh banyak anggota dari waktu ke waktu. Entitas Peminjaman bertindak sebagai jembatan relasi ini.'
    },
    {
      question: 'Apa peran atribut author_id di dalam tabel Buku_Penulis?',
      options: [
        'A. Hanya sebagai Kunci Utama (Primary Key)',
        'B. Kunci Asing (Foreign Key) yang merujuk ke entitas Penulis',
        'C. Atribut turunan (derived attribute)',
        'D. Kolom non-relasional biasa'
      ],
      answer: 'B. Kunci Asing (Foreign Key) yang merujuk ke entitas Penulis',
      explanation: 'Dalam tabel junction (persimpangan), kolom yang merujuk ke entitas induk berfungsi sebagai kunci asing (FK) yang sering digabungkan menjadi kunci utama komposit.'
    },
    {
      question: 'Batasan database apa yang paling tepat diterapkan pada kolom "isbn" di tabel Buku?',
      options: [
        'A. DEFAULT NULL',
        'B. UNIQUE (Unik) dan NOT NULL',
        'C. AUTO_INCREMENT',
        'D. FOREIGN KEY'
      ],
      answer: 'B. UNIQUE (Unik) dan NOT NULL',
      explanation: 'Nomor ISBN bersifat unik untuk setiap publikasi buku di dunia, sehingga kolom database harus dipastikan unik untuk menjaga integritas data.'
    },
    {
      question: 'Apa arti simbol lingkaran (circle/ring) yang terletak di dekat ujung garis relasi dalam notasi Crow\'s Foot?',
      options: [
        'A. Hubungan wajib (minimal 1 data harus ada)',
        'B. Hubungan opsional (kardinalitas minimum bernilai 0)',
        'C. Batasan kunci utama (primary key constraint)',
        'D. Pemicu indeks otomatis (index trigger)'
      ],
      answer: 'B. Hubungan opsional (kardinalitas minimum bernilai 0)',
      explanation: 'Simbol lingkaran menunjukkan opsionalitas hubungan, yang berarti baris data di entitas terkait dapat dibuat tanpa harus langsung terhubung dengan entitas induk.'
    }
  ]
};

const MOCK_NETWORK: AnalysisResult = {
  diagramType: 'Topologi Jaringan (Aplikasi Web Perusahaan Aman 3-Tier)',
  explanation: 'Diagram topologi jaringan ini memetakan arsitektur hosting perusahaan yang aman. Ini merinci titik masuk DNS publik, perlindungan DDoS, konfigurasi load balancer, subnet pribadi untuk lapisan web, node aplikasi, dan cluster database yang terisolasi.',
  components: [
    'Tameng Jaringan Tepi (Cloudflare/AWS Shield): Menangani perlindungan DDoS, terminasi SSL, dan caching aset statis.',
    'Subnet Web Publik: Menampung load balancer publik yang mengarahkan permintaan klien ke dalam batas jaringan pribadi (VPC).',
    'Subnet Aplikasi (Privat): Berisi node logika bisnis ter-kontainerisasi yang hanya dapat diakses melalui Load Balancer.',
    'Subnet Database (Privat Terisolasi): Menampung replika database aktif dan server cache, hanya dapat dijangkau oleh server aplikasi.',
    'Gateway NAT: Memungkinkan server privat melakukan koneksi keluar untuk pembaruan sistem tetapi memblokir koneksi masuk dari luar.'
  ],
  summary: 'Konfigurasi jaringan Virtual Private Cloud (VPC) multi-tier yang aman, mengisolasi database sensitif di lapisan jaringan terdalam tanpa akses internet langsung.',
  improvements: [
    'Integrasikan Bastion Host VPN untuk akses terminal administratif jarak jauh yang aman.',
    'Tambahkan replikasi Multi-Region aktif-pasif untuk mendukung pemulihan bencana (disaster recovery) otomatis.',
    'Pastikan semua log lalu lintas antar-subnet dikirimkan ke server pemantau keamanan pusat (SIEM).'
  ],
  questions: [
    {
      question: 'Mengapa server database ditempatkan di subnet privat terisolasi, bukan di subnet lapisan web publik?',
      options: [
        'A. Untuk menghemat biaya sewa server bulanan',
        'B. Untuk meminimalkan latensi antara database dan browser klien',
        'C. Untuk mengisolasi database dari akses internet langsung guna melindungi data sensitif',
        'D. Karena server database tidak mendukung alamat IP'
      ],
      answer: 'C. Untuk mengisolasi database dari akses internet langsung guna melindungi data sensitif',
      explanation: 'Menempatkan server database di subnet privat terdalam dengan aturan firewall ketat memblokir peretas luar untuk langsung menyerang port database seperti 3306 atau 5432.'
    },
    {
      question: 'Apa fungsi utama dari Gateway NAT yang ditempatkan di subnet publik?',
      options: [
        'A. Menyaring serangan DDoS dari lalu lintas pengguna',
        'B. Mengizinkan server di subnet privat terisolasi melakukan akses keluar (seperti mengunduh update paket) sembari memblokir koneksi dari internet ke arah dalam',
        'C. Menyimpan data cache sesi untuk aplikasi web',
        'D. Berfungsi sebagai penyimpanan utama database cadangan'
      ],
      answer: 'B. Mengizinkan server di subnet privat terisolasi melakukan akses keluar (seperti mengunduh update paket) sembari memblokir koneksi dari internet ke arah dalam',
      explanation: 'Gateway NAT (Network Address Translation) mengizinkan server privat mengakses internet secara aman untuk update, tetapi menolak semua upaya koneksi masuk tidak resmi.'
    },
    {
      question: 'Komponen mana yang bertanggung jawab membagi beban permintaan lalu lintas web secara merata ke beberapa server aplikasi?',
      options: [
        'A. Gateway NAT',
        'B. Replika Database',
        'C. Load Balancer (ALB)',
        'D. Gateway Internet'
      ],
      answer: 'C. Load Balancer (ALB)',
      explanation: 'Application Load Balancer (ALB) memeriksa beban lalu lintas dan mendistribusikannya secara merata ke instans aplikasi yang sehat guna mencegah overload.'
    },
    {
      question: 'Bagaimana keamanan terhadap serangan DDoS dikelola dalam arsitektur jaringan ini?',
      options: [
        'A. Dengan mematikan server secara manual saat diserang',
        'B. Di lapisan Edge Network Shield sebelum lalu lintas mencapai load balancer',
        'C. Di dalam tabel database menggunakan aturan SQL',
        'D. Dengan menginstal perangkat lunak khusus di komputer pengguna'
      ],
      answer: 'B. Di lapisan Edge Network Shield sebelum lalu lintas mencapai load balancer',
      explanation: 'Proteksi tepi (seperti Cloudflare) memfilter lalu lintas berbahaya pada titik masuk global sebelum paket data mencapai server aplikasi utama.'
    },
    {
      question: 'Apa yang dimaksud dengan VPC (Virtual Private Cloud)?',
      options: [
        'A. Jenis kabel Ethernet fisik berkecepatan tinggi',
        'B. Jaringan virtual privat terisolasi yang didefinisikan di dalam lingkungan komputasi awan',
        'C. Mesin database relasional open-source',
        'D. Paket perangkat lunak untuk mengedit diagram alur'
      ],
      answer: 'B. Jaringan virtual privat terisolasi yang didefinisikan di dalam lingkungan komputasi awan',
      explanation: 'VPC memberikan ruang jaringan privat yang aman bagi organisasi untuk menjalankan server dengan kendali penuh atas konfigurasi subnet dan tabel perutean.'
    }
  ]
};

const MOCK_GENERIC: AnalysisResult = {
  diagramType: 'Diagram Referensi Edukatif',
  explanation: 'Diagram ini mengilustrasikan komponen akademis dasar, menunjukkan definisi utama, entitas, hubungan, atau alur struktural yang membentuk landasan dari topik pembelajaran ini.',
  components: [
    'Tajuk Konsep: Label yang mengidentifikasi elemen-elemen kunci yang sedang dipelajari.',
    'Garis Penghubung: Menunjukkan aliran hubungan, pertukaran informasi, atau urutan kronologis.',
    'Legenda Penjelas: Panel samping yang menyediakan anotasi, ukuran, atau arti kode warna.'
  ],
  summary: 'Panduan visual terstruktur yang menggambarkan hubungan edukatif dan atribut proses.',
  improvements: [
    'Tambahkan judul dan keterangan detail pada garis penghubung agar alur lebih mudah dibaca.',
    'Gunakan bentuk standar flowchart atau UML agar konvensi diagram lebih konsisten.'
  ],
  questions: [
    {
      question: 'Apa keuntungan utama memvisualisasikan materi akademik yang kompleks dalam bentuk diagram?',
      options: [
        'A. Menghilangkan kebutuhan untuk membaca buku teks pelajaran',
        'B. Memetakan hubungan dan alur secara visual untuk membantu pemahaman dan daya ingat',
        'C. Menghasilkan laporan nilai ujian secara otomatis',
        'D. Menerjemahkan semua materi pembelajaran ke bahasa lain'
      ],
      answer: 'B. Memetakan hubungan dan alur secara visual untuk membantu pemahaman dan daya ingat',
      explanation: 'Representasi visual menyederhanakan hubungan komponen, membantu mempercepat proses pemahaman serta ingatan jangka panjang.'
    },
    {
      question: 'Petunjuk visual apa yang paling umum digunakan dalam diagram untuk menandakan arah alur proses?',
      options: [
        'A. Tingkat saturasi warna',
        'B. Ketebalan garis tepi kotak',
        'C. Garis dengan ujung anak panah',
        'D. Ukuran huruf teks penjelasan'
      ],
      answer: 'C. Garis dengan ujung anak panah',
      explanation: 'Garis panah memandu mata pembaca menyusuri jalur urutan kronologis atau hierarki relasional dalam diagram.'
    },
    {
      question: 'Apa peran dari sebuah legenda dalam suatu diagram?',
      options: [
        'A. Berfungsi menyimpan cadangan data di server',
        'B. Menyediakan arti dari simbol, bentuk, garis, atau kode warna yang digunakan',
        'C. Mempercepat waktu pemuatan halaman web',
        'D. Menyimpan widget interaktif aplikasi'
      ],
      answer: 'B. Menyediakan arti dari simbol, bentuk, garis, atau kode warna yang digunakan',
      explanation: 'Legenda menjelaskan konvensi desain yang digunakan agar pembaca eksternal dapat memahami arti dari ragam warna atau bentuk simbol.'
    },
    {
      question: 'Bagaimana sebaiknya sub-proses yang kompleks digambarkan dalam suatu diagram arsitektur?',
      options: [
        'A. Dengan mencampurnya secara acak di halaman utama',
        'B. Menggunakan kotak sub-proses khusus atau tautan halaman untuk menjaga kesederhanaan visual halaman utama',
        'C. Dengan menghapus bagian sub-proses tersebut sepenuhnya',
        'D. Hanya dengan menggunakan ukuran font teks yang sangat besar'
      ],
      answer: 'B. Menggunakan kotak sub-proses khusus atau tautan halaman untuk menjaga kesederhanaan visual halaman utama',
      explanation: 'Memisahkan sub-proses kompleks ke halaman atau diagram modular menjaga diagram utama tetap bersih, terfokus, dan mudah dibaca.'
    },
    {
      question: 'Kebiasaan desain diagram apa yang paling membuat diagram sulit dipelajari oleh siswa?',
      options: [
        'A. Spasi antar elemen yang proporsional dan pelabelan yang jelas',
        'B. Menumpuk terlalu banyak elemen tanpa hierarki visual atau tanpa konsistensi bentuk simbol',
        'C. Menggunakan warna-warna kontras untuk menyoroti bagian penting',
        'D. Menyertakan kuis latihan pemahaman interaktif'
      ],
      answer: 'B. Menumpuk terlalu banyak elemen tanpa hierarki visual atau tanpa konsistensi bentuk simbol',
      explanation: 'Kepadatan berlebih, garis silang yang rumit, dan ketiadaan konsistensi simbol menyebabkan beban kognitif berlebih bagi pembaca.'
    }
  ]
};

export async function POST(req: NextRequest) {
  try {
    const { image, mimeType, fileName } = await req.json();

    if (!image) {
      return NextResponse.json<AnalysisResponse>(
        { success: false, error: 'Missing image payload.' },
        { status: 400 }
      );
    }

    const cleanFileName = (fileName || '').toLowerCase();
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;

    // Detect diagram type from file name for mock response
    let selectedMock = MOCK_GENERIC;
    if (cleanFileName.includes('flowchart') || cleanFileName.includes('flow') || cleanFileName.includes('proses')) {
      selectedMock = MOCK_FLOWCHART;
    } else if (cleanFileName.includes('uml') || cleanFileName.includes('class') || cleanFileName.includes('kelas')) {
      selectedMock = MOCK_UML;
    } else if (cleanFileName.includes('erd') || cleanFileName.includes('database') || cleanFileName.includes('entitas') || cleanFileName.includes('relation')) {
      selectedMock = MOCK_ERD;
    } else if (cleanFileName.includes('network') || cleanFileName.includes('network') || cleanFileName.includes('jaringan') || cleanFileName.includes('topology')) {
      selectedMock = MOCK_NETWORK;
    }

    if (!hasGeminiKey) {
      const isValidMockKeyword = [
        'flowchart', 'flow', 'proses', 
        'uml', 'class', 'kelas', 
        'erd', 'database', 'entitas', 'relation', 'schema',
        'network', 'jaringan', 'topology',
        'map', 'peta',
        'chart', 'graph', 'grafik', 'bagan'
      ].some(keyword => cleanFileName.includes(keyword));

      if (!isValidMockKeyword) {
        return NextResponse.json<AnalysisResponse>(
          { 
            success: false, 
            error: 'Gambar tidak dikenali sebagai jenis diagram yang didukung. Pastikan nama berkas mengandung kata kunci diagram (seperti "flowchart", "uml", "erd", "network", "map", atau "chart").' 
          },
          { status: 400 }
        );
      }

      // Simulate real network response latency (1.5s)
      await delay(1500);
      return NextResponse.json<AnalysisResponse>({
        success: true,
        data: selectedMock,
        isMocked: true
      });
    }

    try {
      // Clean base64 string
      const base64Data = image.includes('base64,') ? image.split('base64,')[1] : image;
      const parsedMimeType = mimeType || 'image/png';
      
      const analysis = await analyzeDiagramWithGemini(base64Data, parsedMimeType, fileName || 'diagram.png');
      
      if (analysis.isValidDiagram === false) {
        return NextResponse.json<AnalysisResponse>(
          { 
            success: false, 
            error: analysis.invalidReason || 'Gambar yang diunggah bukan merupakan diagram yang didukung.' 
          },
          { status: 400 }
        );
      }

      return NextResponse.json<AnalysisResponse>({
        success: true,
        data: analysis,
        isMocked: false
      });
    } catch (apiError: any) {
      console.warn('Gemini API inference failed, falling back to smart mock response.', apiError.message);
      
      const isValidMockKeyword = [
        'flowchart', 'flow', 'proses', 
        'uml', 'class', 'kelas', 
        'erd', 'database', 'entitas', 'relation', 'schema',
        'network', 'jaringan', 'topology',
        'map', 'peta',
        'chart', 'graph', 'grafik', 'bagan'
      ].some(keyword => cleanFileName.includes(keyword));

      if (!isValidMockKeyword) {
        return NextResponse.json<AnalysisResponse>(
          { 
            success: false, 
            error: `Gagal menganalisis gambar: Gambar tidak dikenali sebagai jenis diagram yang didukung.` 
          },
          { status: 400 }
        );
      }

      // Fallback to mock on Gemini error
      await delay(1200);
      return NextResponse.json<AnalysisResponse>({
        success: true,
        data: selectedMock,
        isMocked: true,
        error: `API Fallback: ${apiError.message}`
      });
    }
  } catch (error: any) {
    console.error('Error in analyze route:', error);
    return NextResponse.json<AnalysisResponse>(
      { success: false, error: error.message || 'Server processing error.' },
      { status: 500 }
    );
  }
}
