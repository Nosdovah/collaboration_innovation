# Dokumentasi Proyek: Nike-Vibe Recruitment Engine

## 1. Problem Definition
Proses rekrutmen atlet atau talenta olahraga profesional secara tradisional memiliki beberapa kelemahan fundamental: tingginya bias subjektif dari *scout* (pemandu bakat), keterbatasan skalabilitas dalam mengevaluasi banyak kandidat secara bersamaan, serta risiko manipulasi data kebugaran (*spoofing*). Diperlukan sebuah sistem rekrutmen yang dapat mengukur potensi fisik, mental (resiliensi), dan kedisiplinan secara objektif, real-time, dan terverifikasi secara spasial, sambil tetap mematuhi regulasi privasi data yang ketat.

## 2. SCAMPER Idea Generation
Dalam merancang solusi ini, kerangka inovasi SCAMPER diterapkan:
*   **Substitute (Ganti)**: Menggantikan uji coba lapangan fisik (*trial*) tahap awal dengan asimilasi data langsung dari perangkat *wearable* pintar.
*   **Combine (Gabung)**: Menggabungkan ekosistem biometrik Nike (NRC/Smartband) dengan keandalan metadata jaringan 5G Telkomsel.
*   **Adapt (Adaptasi)**: Mengadaptasi metodologi *anti-spoofing* dengan mencocokkan data GPS biometrik dengan latensi terestrial 5G.
*   **Modify (Modifikasi)**: Memodifikasi cara penyimpanan data SDM tradisional ke sistem yang otomatis musnah (*auto-purge*) untuk memenuhi standar privasi.
*   **Put to another use (Gunakan untuk hal lain)**: Menggunakan rutinitas latihan harian biasa sebagai metrik dedikasi dan proksi kedisiplinan kandidat.
*   **Eliminate (Hilangkan)**: Menghilangkan CV kertas dan portofolio statis, menggantinya dengan "Biomechanical Data".
*   **Reverse/Rearrange (Balik/Susun Ulang)**: Alih-alih menilai atlet berdasarkan performa puncak (*peak performance*) di satu pertandingan, sistem menilai rekam jejak konsistensi performa (*behavioral biometrics*) dari waktu ke waktu.

## 3. Idea Selection
**Terpilih: "Nike-Vibe Recruitment Engine"**
Sebuah platform komando (HUD Dashboard) *Cybernetic* yang menyerap aliran data sensor performa secara komprehensif. Sistem ini secara algoritmis mengubah data mentah (Detak Jantung, VO2 Max, Aktivasi Otot, Kecepatan) menjadi *Candidate Performance Index*. Hanya kandidat yang datanya terverifikasi bebas anomali dan direkam di bawah jaringan 5G (`VERIFIED_PRO`) yang lolos filtrasi intelijen.

## 4. Business Constraints
*   **Regulasi UU PDP**: Ekstrak biometrik diklasifikasikan sebagai data spesifik yang sangat sensitif. Sistem tidak boleh menggunakan *soft-delete*. Harus ada mekanisme enkripsi dan pemusnahan data mentah secara fisik *(Physical Purge)*.
*   **Infrastruktur Jaringan**: Keakuratan sistem validasi anti-spoofing (<25ms) bergantung secara absolut pada ketersediaan dan stabilitas jaringan 5G Telkomsel di lokasi kandidat.
*   **Eksklusivitas Perangkat keras**: Sistem mengharuskan kandidat memiliki atau difasilitasi dengan perangkat keras ekosistem Nike yang memiliki fidelitas metrik tingkat lanjut.

## 5. Sistem / Tech Logic
Arsitektur dibangun di atas konsep *Master of One* dengan integrasi *full-stack*:
*   **Data Ingestion Layer**: Menggunakan *webhook* n8n untuk menangkap dan menerima *stream* *payload* JSON langsung dari *endpoint* API perangkat Nike.
*   **Backend & Security Layer (Data Bridge)**: Express.js (Node ESM) menangani *routing*. Seluruh basis data terhubung ke Turso (Edge SQLite). Modul keamanan internal bernama **LexGuard** bertugas melakukan dekripsi/enkripsi AES-256 pada data saat istirahat (*Data at Rest*) dan eksekusi skrip penghapusan fisik (*Physical TTL Purge*).
*   **Frontend (Master HUD)**: Dibangun murni menggunakan `Vue.js` dan `Vite`. Menggunakan sistem *Global State Store* (*reactivity*) alih-alih propagasi yang rumit, menampilkan UI *Single-Page* panel ganda yang menyajikan daftar *Top Applicants* (Admin Console) dan metrik visualisasi *Donut/Gauge Chart* (Dashboard) bertenaga `chart.js`.

## 6. Analytical Layer
Lapisan analitik bertugas mereduksi kompleksitas data biometrik menjadi skor yang mudah dipahami (*Actionable Insight*):
*   **Performance Indexing**: Merupakan normalisasi matematika terbobot dari metrik *Speed, Agility, Endurance, Focus,* dan *Teamwork*.
*   **Behavioral Biometrics AI (Local-First)**: Model LLM yang diisolasi secara lokal (seperti Ollama/DeepSeek) menganalisis pola runtut waktu (*time-series*). *AI* mengevaluasi konsistensi jam bangun dan ritme olahraga selama interval 30 hari untuk menghasilkan skor "Disiplin" dan komputasi fluktuasi *Heart Rate Recovery* untuk menilai "Mental Juara / Resiliensi".

## 7. Research Positioning
Platform "Nike-Vibe" diposisikan pada titik potong antara *Internet of Things (IoT) Telemetry*, *5G Network Innovations*, dan *Human Capital Technology*. Proyek ini berfungsi sebagai bentuk inovasi eksperimental komersial *(Commercial Proof-of-Concept)* untuk model rekrutmen generasi berikutnya, di mana kapabilitas intrinsik seorang kandidat diukur menggunakan kebenaran biofisiologis (Zero-Trust Recruitment), bukan klaim tertulis, sebagai wujud kolaborasi digital lintas sektor (Telco-Sportswear).
