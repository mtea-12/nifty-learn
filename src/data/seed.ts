export type Peran = "admin" | "guru" | "wali" | "siswa";

export type JenisIdentitas = "NIP" | "NBM";

export type Guru = {
  id: string;
  nip: string;
  jenisIdentitas?: JenisIdentitas;
  nama: string;
  email: string;
  telepon: string;
  mapelIds: string[];
  status: "PNS" | "PPPK" | "GTY" | "Honorer";
};

export type KepalaSekolah = {
  nama: string;
  jenisIdentitas: JenisIdentitas;
  nomorIdentitas: string;
};

export type Kelas = {
  id: string;
  tingkat: string;
  nama: string;
  waliKelasId: string;
};

export type Siswa = {
  id: string;
  nisn: string;
  nis: string;
  nama: string;
  jk: "L" | "P";
  kelasId: string;
  tempatLahir: string;
  tanggalLahir: string;
  ayah: string;
  ibu: string;
  teleponOrtu: string;
  alamat: string;
};

export type Mapel = {
  id: string;
  kode: string;
  nama: string;
  kelompok: "Umum" | "Kejuruan" | "Peminatan";
  kkm: number;
};

export type TahunAjaran = {
  id: string;
  tahun: string;
  semester: "Ganjil" | "Genap";
  aktif: boolean;
};

export type Nilai = {
  id: string;
  siswaId: string;
  mapelId: string;
  tahunAjaranId: string;
  tugas: number | null;
  harian: number | null;
  pts: number | null;
  pas: number | null;
};

export type LogAktivitas = {
  id: string;
  waktu: string;
  pelaku: string;
  peran: Peran;
  aksi: string;
  modul: string;
  keterangan: string;
};

export type Ekskul = { nama: string; predikat: string; deskripsi: string };

export type RaporTambahan = {
  siswaId: string;
  ekskul: Ekskul[];
  sakit: number;
  izin: number;
  alpa: number;
  catatan: string;
};

export const NAMA_SEKOLAH = "SMK Muhammadiyah 1 Paguyangan";
export const ALAMAT_SEKOLAH = "Jl. Raya Paguyangan Km. 3 Paguyangan, Kab. Brebes, Jawa Tengah";
export const TELP_SEKOLAH = "Telp. (0289) 4311929";

export const kepalaSekolahSeed: KepalaSekolah = {
  nama: "Drs. H. Suryadi, M.Pd.",
  jenisIdentitas: "NIP",
  nomorIdentitas: "",
};

export const mapelSeed: Mapel[] = [
  { id: "mp1", kode: "PAI", nama: "Pendidikan Agama & Budi Pekerti", kelompok: "Umum", kkm: 75 },
  { id: "mp2", kode: "PKN", nama: "Pendidikan Pancasila", kelompok: "Umum", kkm: 75 },
  { id: "mp3", kode: "BIN", nama: "Bahasa Indonesia", kelompok: "Umum", kkm: 75 },
  { id: "mp4", kode: "MTK", nama: "Matematika", kelompok: "Umum", kkm: 70 },
  { id: "mp5", kode: "BIG", nama: "Bahasa Inggris", kelompok: "Umum", kkm: 72 },
  { id: "mp6", kode: "PJOK", nama: "PJOK", kelompok: "Umum", kkm: 75 },
  { id: "mp7", kode: "PBO", nama: "Pemrograman Berorientasi Objek", kelompok: "Kejuruan", kkm: 78 },
  { id: "mp8", kode: "BDT", nama: "Basis Data", kelompok: "Kejuruan", kkm: 78 },
  { id: "mp9", kode: "PWB", nama: "Pemrograman Web", kelompok: "Kejuruan", kkm: 78 },
  { id: "mp10", kode: "IPAS", nama: "Projek IPAS", kelompok: "Peminatan", kkm: 72 },
];

export const guruSeed: Guru[] = [
  { id: "g1", nip: "197803122005011004", nama: "Drs. Bambang Sutrisno", email: "bambang@smkn1nusantara.sch.id", telepon: "081234567801", mapelIds: ["mp1"], status: "PNS" },
  { id: "g2", nip: "198205142008012003", nama: "Siti Rahmawati, S.Pd.", email: "siti@smkn1nusantara.sch.id", telepon: "081234567802", mapelIds: ["mp3"], status: "PNS" },
  { id: "g3", nip: "198711202011011007", nama: "Ahmad Fauzi, S.Pd.", email: "fauzi@smkn1nusantara.sch.id", telepon: "081234567803", mapelIds: ["mp4"], status: "PPPK" },
  { id: "g4", nip: "199003152015022005", nama: "Dewi Anggraini, S.Pd.", email: "dewi@smkn1nusantara.sch.id", telepon: "081234567804", mapelIds: ["mp5"], status: "PPPK" },
  { id: "g5", nip: "199206082018011002", nama: "Rizky Pratama, S.Kom.", email: "rizky@smkn1nusantara.sch.id", telepon: "081234567805", mapelIds: ["mp7", "mp9"], status: "GTY" },
  { id: "g6", nip: "199401222019022004", nama: "Nurul Hidayah, S.Kom.", email: "nurul@smkn1nusantara.sch.id", telepon: "081234567806", mapelIds: ["mp8"], status: "GTY" },
  { id: "g7", nip: "198909092014011006", nama: "Hendra Gunawan, S.Pd.", email: "hendra@smkn1nusantara.sch.id", telepon: "081234567807", mapelIds: ["mp6"], status: "Honorer" },
  { id: "g8", nip: "199508172020012008", nama: "Lestari Wulandari, S.Pd.", email: "lestari@smkn1nusantara.sch.id", telepon: "081234567808", mapelIds: ["mp2", "mp10"], status: "PPPK" },
];

export const kelasSeed: Kelas[] = [
  { id: "k1", tingkat: "X", nama: "X-RPL 1", waliKelasId: "g5" },
  { id: "k2", tingkat: "X", nama: "X-RPL 2", waliKelasId: "g6" },
  { id: "k3", tingkat: "XI", nama: "XI-RPL 1", waliKelasId: "g2" },
  { id: "k4", tingkat: "XII", nama: "XII-RPL 1", waliKelasId: "g3" },
];

const namaL = [
  "Adi Nugroho", "Bayu Saputra", "Candra Wijaya", "Dimas Prakoso", "Eko Purnomo",
  "Fajar Ramadhan", "Galih Setiawan", "Hafiz Maulana", "Irfan Hakim", "Joko Susilo",
  "Krisna Adi", "Lukman Hakim", "Miftah Farid", "Naufal Rizki", "Oscar Pranata",
];
const namaP = [
  "Anisa Putri", "Bella Safira", "Citra Dewi", "Dinda Ayu", "Elsa Maharani",
  "Fitri Handayani", "Gita Permata", "Hana Salsabila", "Intan Puspita", "Jihan Aulia",
  "Kirana Melati", "Laila Rahma", "Mutiara Sari", "Nadia Kusuma", "Olivia Rahmadani",
];

const kotaLahir = ["Bandung", "Cimahi", "Garut", "Sumedang", "Tasikmalaya", "Bogor"];

function buatSiswa(): Siswa[] {
  const hasil: Siswa[] = [];
  let urut = 1;
  kelasSeed.forEach((kelas, ki) => {
    const jumlah = 12;
    for (let i = 0; i < jumlah; i++) {
      const laki = i % 2 === 0;
      const nama = (laki ? namaL[(ki * 6 + i) % namaL.length] : namaP[(ki * 6 + i) % namaP.length]) as string;
      hasil.push({
        id: `s${urut}`,
        nisn: `00${71000000 + urut * 137}`,
        nis: `2400${String(urut).padStart(3, "0")}`,
        nama,
        jk: laki ? "L" : "P",
        kelasId: kelas.id,
        tempatLahir: kotaLahir[(urut + ki) % kotaLahir.length] as string,
        tanggalLahir: `${2006 + (ki % 3)}-${String(((urut * 3) % 12) + 1).padStart(2, "0")}-${String(((urut * 7) % 28) + 1).padStart(2, "0")}`,
        ayah: `${(namaL[(urut * 2) % namaL.length] as string).split(" ")[0]} Suryana`,
        ibu: `${(namaP[(urut * 3) % namaP.length] as string).split(" ")[0]} Maryati`,
        teleponOrtu: `0812${String(30000000 + urut * 4321).slice(0, 8)}`,
        alamat: `Jl. Melati No. ${urut + 10}, ${kotaLahir[(urut + 1) % kotaLahir.length]}`,
      });
      urut++;
    }
  });
  return hasil;
}

export const siswaSeed: Siswa[] = buatSiswa();

export const tahunAjaranSeed: TahunAjaran[] = [
  { id: "ta1", tahun: "2024/2025", semester: "Ganjil", aktif: false },
  { id: "ta2", tahun: "2024/2025", semester: "Genap", aktif: false },
  { id: "ta3", tahun: "2025/2026", semester: "Ganjil", aktif: true },
];

// Mapel yang diajarkan tiap kelas
export const mapelPerKelas: Record<string, string[]> = {
  k1: ["mp1", "mp2", "mp3", "mp4", "mp5", "mp6", "mp10", "mp9"],
  k2: ["mp1", "mp2", "mp3", "mp4", "mp5", "mp6", "mp10", "mp9"],
  k3: ["mp1", "mp3", "mp4", "mp5", "mp7", "mp8", "mp9"],
  k4: ["mp1", "mp3", "mp4", "mp5", "mp7", "mp8", "mp9"],
};

function acakNilai(seed: number, min: number, max: number) {
  const x = Math.sin(seed) * 10000;
  const frac = x - Math.floor(x);
  return Math.round(min + frac * (max - min));
}

function buatNilai(): Nilai[] {
  const hasil: Nilai[] = [];
  let n = 1;
  siswaSeed.forEach((siswa, si) => {
    const mapelIds = mapelPerKelas[siswa.kelasId] ?? [];
    mapelIds.forEach((mapelId, mi) => {
      // Kelas XII-RPL 1 sebagian belum lengkap agar status input terlihat
      const belumLengkap = siswa.kelasId === "k4" && mi > 4;
      const base = 68 + ((si * 3 + mi * 5) % 25);
      hasil.push({
        id: `n${n++}`,
        siswaId: siswa.id,
        mapelId,
        tahunAjaranId: "ta3",
        tugas: acakNilai(si + mi + 1, base - 5, 98),
        harian: acakNilai(si + mi + 2, base - 3, 97),
        pts: belumLengkap ? null : acakNilai(si + mi + 3, base - 8, 95),
        pas: belumLengkap ? null : acakNilai(si + mi + 4, base - 6, 96),
      });
    });
  });
  return hasil;
}

export const nilaiSeed: Nilai[] = buatNilai();

export const logSeed: LogAktivitas[] = [
  { id: "l1", waktu: "2026-09-17T08:12:00", pelaku: "Rizky Pratama, S.Kom.", peran: "guru", aksi: "Input Nilai", modul: "Nilai", keterangan: "Menginput nilai PAS Pemrograman Web kelas X-RPL 1" },
  { id: "l2", waktu: "2026-09-16T14:35:00", pelaku: "Administrator", peran: "admin", aksi: "Tambah Data", modul: "Siswa", keterangan: "Menambahkan siswa baru pada kelas X-RPL 2" },
  { id: "l3", waktu: "2026-09-16T10:02:00", pelaku: "Siti Rahmawati, S.Pd.", peran: "wali", aksi: "Cetak Rapor", modul: "Rapor", keterangan: "Mencetak rapor semester Ganjil kelas XI-RPL 1" },
  { id: "l4", waktu: "2026-09-15T09:44:00", pelaku: "Ahmad Fauzi, S.Pd.", peran: "guru", aksi: "Ubah Nilai", modul: "Nilai", keterangan: "Memperbaiki nilai PTS Matematika a.n. Dimas Prakoso" },
  { id: "l5", waktu: "2026-09-14T13:20:00", pelaku: "Administrator", peran: "admin", aksi: "Ubah Data", modul: "Tahun Ajaran", keterangan: "Mengaktifkan tahun ajaran 2025/2026 Ganjil" },
];

export const raporTambahanSeed: RaporTambahan[] = siswaSeed.map((s, i) => ({
  siswaId: s.id,
  ekskul: [
    { nama: i % 2 === 0 ? "Pramuka" : "Palang Merah Remaja", predikat: i % 3 === 0 ? "Sangat Baik" : "Baik", deskripsi: "Aktif mengikuti kegiatan dan menunjukkan kerja sama yang baik." },
    { nama: i % 3 === 0 ? "Futsal" : "English Club", predikat: "Baik", deskripsi: "Menunjukkan perkembangan keterampilan yang konsisten." },
  ],
  sakit: i % 4,
  izin: (i + 1) % 3,
  alpa: i % 5 === 0 ? 1 : 0,
  catatan:
    "Ananda menunjukkan sikap disiplin dan tanggung jawab yang baik. Tingkatkan konsistensi belajar terutama pada mata pelajaran kejuruan.",
}));
