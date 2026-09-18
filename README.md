# Nifty Grades Hub

Bangun aplikasi Nifty Grades Hub (Sistem Informasi Nilai & Rapor Sekolah) lengkap dalam Bahasa Indonesia dengan fitur-fitur berikut:

1. Peran & Hak Akses (Role-based Access):
   - Admin: Akses penuh mengelola data master (sekolah, tahun ajaran, guru, kelas, siswa, mapel) dan log aksi.
   - Guru: Mengajar mata pelajaran, input nilai per kelas/mapel, melihat rekap nilai.
   - Wali Kelas: Mengelola nilai kelas perwalian, rekap nilai kelas, dan cetak rapor semester.
   - Siswa: Melihat rekap nilai dan capaian pribadi.

2. Modul Utama:
   - **Dasbor**: Ringkasan statistik jumlah siswa, guru, kelas, mata pelajaran, serta status penginputan nilai dan aktivitas terkini.
   - **Manajemen Guru & Tenaga Pendidik**: Daftar guru, NIP/identitas, kontak, dan penugasan mata pelajaran/wali kelas.
   - **Manajemen Siswa**: Data induk siswa (NISN, NIS, nama, jenis kelamin, kelas aktif, data orang tua/wali).
   - **Manajemen Kelas**: Daftar tingkat dan rombel kelas (misal: VII-A, X-RPL, dsb.) beserta penunjukan wali kelas.
   - **Mata Pelajaran**: Daftar mapel, kode mapel, kelompok (umum, kejuruan/peminatan), dan batas KKM / kriteria ketuntasan.
   - **Tahun Ajaran & Semester**: Pengaturan tahun akademik aktif (Ganjil/Genap).
   - **Input Nilai**: Form dan tabel input nilai dinamis (tugas, ulangan harian/formatif, PTS/STS, PAS/SAS) dengan kalkulasi otomatis nilai akhir dan predikat (A, B, C, D).
   - **Rekap & Analisis Nilai**: Tampilan rekap per kelas, per mapel, dan per semester dengan tabel interaktif dan grafik distribusi nilai.
   - **Cetak Rapor**: Format rapor sekolah resmi (identitas siswa, capaian nilai akademik, ekstrakurikuler, catatan wali kelas, presensi) yang siap cetak/ekspor ke PDF.
   - **Log Aktivitas**: Audit trail pencatatan aktivitas perubahan nilai dan data master.

3. Tampilan & Pengalaman Pengguna (UI/UX):
   - Desain modern, bersih, profesional, dan responsif (sidebar navigasi rapi, tabel interaktif dengan pencarian dan filter, status badge yang jelas).
   - Sertakan data contoh (mock data) yang realistis agar aplikasi langsung interaktif dan dapat dicoba secara instan.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://nifty-learn.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/20047f98-d13d-4627-8129-0668cc8eecea).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
