# Nifty Grades Hub — Sistem Informasi Nilai & Rapor Sekolah

Aplikasi web berbahasa Indonesia untuk mengelola nilai dan rapor sekolah, dengan data contoh realistis sehingga langsung bisa dicoba tanpa login.

## Tahap 1 (yang akan saya bangun sekarang): aplikasi lengkap dengan data contoh

Semua modul berfungsi penuh di sisi tampilan, memakai data contoh yang tersimpan sementara di browser. Belum ada akun/login sungguhan — peran dipilih lewat pemilih peran di pojok atas untuk mencoba tiap sudut pandang.

### Navigasi & tata letak
- Sidebar kiri: Dasbor, Guru, Siswa, Kelas, Mata Pelajaran, Tahun Ajaran, Input Nilai, Rekap Nilai, Rapor, Log Aktivitas.
- Header: nama sekolah, tahun ajaran & semester aktif, pemilih peran (Admin / Guru / Wali Kelas / Siswa).
- Menu yang tampil menyesuaikan peran; halaman terlarang menampilkan pesan "akses ditolak".

### Halaman
1. **Dasbor** — kartu statistik (siswa, guru, kelas, mapel), progres penginputan nilai per kelas, grafik distribusi nilai, aktivitas terkini.
2. **Guru** — tabel dengan pencarian, NIP, kontak, mapel yang diampu, status wali kelas; tambah/ubah/hapus.
3. **Siswa** — NISN, NIS, nama, jenis kelamin, kelas aktif, data orang tua/wali; pencarian + filter kelas.
4. **Kelas** — tingkat, rombel (VII-A, X-RPL), wali kelas, jumlah siswa.
5. **Mata Pelajaran** — kode, nama, kelompok (umum/kejuruan/peminatan), KKM.
6. **Tahun Ajaran** — daftar tahun akademik, semester Ganjil/Genap, penanda aktif.
7. **Input Nilai** — pilih kelas + mapel, tabel input per siswa: tugas, ulangan harian, PTS/STS, PAS/SAS; nilai akhir & predikat (A–D) dihitung otomatis dengan bobot yang bisa diatur; badge Tuntas/Belum Tuntas terhadap KKM.
8. **Rekap & Analisis** — rekap per kelas / per mapel / per semester, tabel interaktif, grafik distribusi nilai dan rata-rata, peringkat kelas.
9. **Cetak Rapor** — pilih siswa, tampilan rapor resmi (identitas, nilai per mapel + predikat + deskripsi, ekstrakurikuler, presensi sakit/izin/alpa, catatan wali kelas), tombol cetak yang menghasilkan PDF lewat dialog cetak peramban.
10. **Log Aktivitas** — catatan otomatis setiap perubahan nilai dan data master (waktu, pelaku, aksi, keterangan), dengan filter.

### Gaya visual
Profesional dan bersih ala perangkat lunak sekolah: biru tua sebagai warna utama dengan aksen hijau untuk status tuntas, kartu putih, tabel rapat namun mudah dibaca, badge status berwarna, responsif sampai layar ponsel.

## Tahap 2 (opsional, setelah Tahap 1 disetujui)
Login sungguhan dan penyimpanan data permanen (database) agar nilai tersimpan lintas perangkat dan tiap guru/siswa punya akun sendiri. Ini menambah backend; beri tahu saya bila ingin langsung dikerjakan.

## Catatan teknis
- TanStack Start + React, satu route per modul di `src/routes/`, Tailwind + shadcn/ui.
- Data contoh di `src/data/*` (guru, siswa, kelas, mapel, nilai, log), disalurkan lewat satu store React context dengan persistensi `localStorage`.
- Grafik memakai Recharts; rapor memakai CSS `@media print` khusus.
- Penghitungan nilai akhir & predikat terpusat di `src/lib/penilaian.ts`.
- Setiap route punya `head()` sendiri (judul & deskripsi unik).
