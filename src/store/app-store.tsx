import * as React from "react";
import {
  guruSeed,
  kelasSeed,
  logSeed,
  mapelSeed,
  nilaiSeed,
  raporTambahanSeed,
  siswaSeed,
  tahunAjaranSeed,
  type Guru,
  type Kelas,
  type LogAktivitas,
  type Mapel,
  type Nilai,
  type Peran,
  type RaporTambahan,
  type Siswa,
  type TahunAjaran,
} from "@/data/seed";
import { bobotDefault, type Bobot } from "@/lib/penilaian";

type State = {
  guru: Guru[];
  kelas: Kelas[];
  siswa: Siswa[];
  mapel: Mapel[];
  tahunAjaran: TahunAjaran[];
  nilai: Nilai[];
  log: LogAktivitas[];
  rapor: RaporTambahan[];
  bobot: Bobot;
  peran: Peran;
  // identitas pengguna aktif berdasarkan peran
  guruAktifId: string;
  waliAktifId: string;
  siswaAktifId: string;
};

const initialState: State = {
  guru: guruSeed,
  kelas: kelasSeed,
  siswa: siswaSeed,
  mapel: mapelSeed,
  tahunAjaran: tahunAjaranSeed,
  nilai: nilaiSeed,
  log: logSeed,
  rapor: raporTambahanSeed,
  bobot: bobotDefault,
  peran: "admin",
  guruAktifId: "g5",
  waliAktifId: "g2",
  siswaAktifId: "s1",
};

const STORAGE_KEY = "nifty-grades-hub-v1";

type Ctx = State & {
  setPeran: (p: Peran) => void;
  setState: React.Dispatch<React.SetStateAction<State>>;
  catatLog: (aksi: string, modul: string, keterangan: string) => void;
  namaPengguna: string;
  tahunAktif: TahunAjaran;
  simpanGuru: (g: Guru) => void;
  hapusGuru: (id: string) => void;
  simpanSiswa: (s: Siswa) => void;
  hapusSiswa: (id: string) => void;
  simpanKelas: (k: Kelas) => void;
  hapusKelas: (id: string) => void;
  simpanMapel: (m: Mapel) => void;
  hapusMapel: (id: string) => void;
  aktifkanTahun: (id: string) => void;
  simpanTahun: (t: TahunAjaran) => void;
  ubahNilai: (siswaId: string, mapelId: string, field: keyof Pick<Nilai, "tugas" | "harian" | "pts" | "pas">, value: number | null) => void;
  setBobot: (b: Bobot) => void;
  ubahRapor: (siswaId: string, patch: Partial<RaporTambahan>) => void;
  resetData: () => void;
};

const AppContext = React.createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<State>(initialState);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState((prev) => ({ ...prev, ...JSON.parse(raw) }));
    } catch {
      /* abaikan */
    }
    setHydrated(true);
  }, []);

  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* abaikan */
    }
  }, [state, hydrated]);

  const namaPengguna = React.useMemo(() => {
    if (state.peran === "admin") return "Administrator";
    if (state.peran === "guru") return state.guru.find((g) => g.id === state.guruAktifId)?.nama ?? "Guru";
    if (state.peran === "wali") return state.guru.find((g) => g.id === state.waliAktifId)?.nama ?? "Wali Kelas";
    return state.siswa.find((s) => s.id === state.siswaAktifId)?.nama ?? "Siswa";
  }, [state.peran, state.guru, state.siswa, state.guruAktifId, state.waliAktifId, state.siswaAktifId]);

  const tahunAktif = state.tahunAjaran.find((t) => t.aktif) ?? (state.tahunAjaran[state.tahunAjaran.length - 1] as TahunAjaran);

  const catatLog = React.useCallback(
    (aksi: string, modul: string, keterangan: string) => {
      setState((prev) => ({
        ...prev,
        log: [
          {
            id: `l${Date.now()}`,
            waktu: new Date().toISOString(),
            pelaku:
              prev.peran === "admin"
                ? "Administrator"
                : prev.peran === "siswa"
                  ? (prev.siswa.find((s) => s.id === prev.siswaAktifId)?.nama ?? "Siswa")
                  : (prev.guru.find((g) => g.id === (prev.peran === "guru" ? prev.guruAktifId : prev.waliAktifId))?.nama ?? "Guru"),
            peran: prev.peran,
            aksi,
            modul,
            keterangan,
          },
          ...prev.log,
        ].slice(0, 200),
      }));
    },
    [setState],
  );

  const value: Ctx = {
    ...state,
    setState,
    namaPengguna,
    tahunAktif,
    catatLog,
    setPeran: (p) => setState((prev) => ({ ...prev, peran: p })),
    simpanGuru: (g) => {
      setState((prev) => ({
        ...prev,
        guru: prev.guru.some((x) => x.id === g.id) ? prev.guru.map((x) => (x.id === g.id ? g : x)) : [...prev.guru, g],
      }));
      catatLog("Simpan Data", "Guru", `Menyimpan data guru ${g.nama}`);
    },
    hapusGuru: (id) => {
      const nama = state.guru.find((g) => g.id === id)?.nama ?? id;
      setState((prev) => ({ ...prev, guru: prev.guru.filter((g) => g.id !== id) }));
      catatLog("Hapus Data", "Guru", `Menghapus data guru ${nama}`);
    },
    simpanSiswa: (s) => {
      setState((prev) => ({
        ...prev,
        siswa: prev.siswa.some((x) => x.id === s.id) ? prev.siswa.map((x) => (x.id === s.id ? s : x)) : [...prev.siswa, s],
      }));
      catatLog("Simpan Data", "Siswa", `Menyimpan data siswa ${s.nama}`);
    },
    hapusSiswa: (id) => {
      const nama = state.siswa.find((s) => s.id === id)?.nama ?? id;
      setState((prev) => ({ ...prev, siswa: prev.siswa.filter((s) => s.id !== id), nilai: prev.nilai.filter((n) => n.siswaId !== id) }));
      catatLog("Hapus Data", "Siswa", `Menghapus data siswa ${nama}`);
    },
    simpanKelas: (k) => {
      setState((prev) => ({
        ...prev,
        kelas: prev.kelas.some((x) => x.id === k.id) ? prev.kelas.map((x) => (x.id === k.id ? k : x)) : [...prev.kelas, k],
      }));
      catatLog("Simpan Data", "Kelas", `Menyimpan data kelas ${k.nama}`);
    },
    hapusKelas: (id) => {
      const nama = state.kelas.find((k) => k.id === id)?.nama ?? id;
      setState((prev) => ({ ...prev, kelas: prev.kelas.filter((k) => k.id !== id) }));
      catatLog("Hapus Data", "Kelas", `Menghapus kelas ${nama}`);
    },
    simpanMapel: (m) => {
      setState((prev) => ({
        ...prev,
        mapel: prev.mapel.some((x) => x.id === m.id) ? prev.mapel.map((x) => (x.id === m.id ? m : x)) : [...prev.mapel, m],
      }));
      catatLog("Simpan Data", "Mata Pelajaran", `Menyimpan mata pelajaran ${m.nama}`);
    },
    hapusMapel: (id) => {
      const nama = state.mapel.find((m) => m.id === id)?.nama ?? id;
      setState((prev) => ({ ...prev, mapel: prev.mapel.filter((m) => m.id !== id) }));
      catatLog("Hapus Data", "Mata Pelajaran", `Menghapus mata pelajaran ${nama}`);
    },
    aktifkanTahun: (id) => {
      const t = state.tahunAjaran.find((x) => x.id === id);
      setState((prev) => ({ ...prev, tahunAjaran: prev.tahunAjaran.map((x) => ({ ...x, aktif: x.id === id })) }));
      catatLog("Ubah Data", "Tahun Ajaran", `Mengaktifkan tahun ajaran ${t?.tahun} ${t?.semester}`);
    },
    simpanTahun: (t) => {
      setState((prev) => ({
        ...prev,
        tahunAjaran: prev.tahunAjaran.some((x) => x.id === t.id)
          ? prev.tahunAjaran.map((x) => (x.id === t.id ? t : x))
          : [...prev.tahunAjaran, t],
      }));
      catatLog("Simpan Data", "Tahun Ajaran", `Menyimpan tahun ajaran ${t.tahun} ${t.semester}`);
    },
    ubahNilai: (siswaId, mapelId, field, value) => {
      setState((prev) => {
        const taId = (prev.tahunAjaran.find((t) => t.aktif) ?? (prev.tahunAjaran[0] as TahunAjaran)).id;
        const ada = prev.nilai.find((n) => n.siswaId === siswaId && n.mapelId === mapelId && n.tahunAjaranId === taId);
        if (ada) {
          return { ...prev, nilai: prev.nilai.map((n) => (n.id === ada.id ? { ...n, [field]: value } : n)) };
        }
        return {
          ...prev,
          nilai: [
            ...prev.nilai,
            { id: `n${Date.now()}${Math.random().toString(36).slice(2, 6)}`, siswaId, mapelId, tahunAjaranId: taId, tugas: null, harian: null, pts: null, pas: null, [field]: value } as Nilai,
          ],
        };
      });
    },
    setBobot: (b) => {
      setState((prev) => ({ ...prev, bobot: b }));
      catatLog("Ubah Pengaturan", "Nilai", `Mengubah bobot penilaian menjadi Tugas ${b.tugas}%, Harian ${b.harian}%, PTS ${b.pts}%, PAS ${b.pas}%`);
    },
    ubahRapor: (siswaId, patch) => {
      setState((prev) => ({
        ...prev,
        rapor: prev.rapor.some((r) => r.siswaId === siswaId)
          ? prev.rapor.map((r) => (r.siswaId === siswaId ? { ...r, ...patch } : r))
          : [...prev.rapor, { siswaId, ekskul: [], sakit: 0, izin: 0, alpa: 0, catatan: "", ...patch }],
      }));
    },
    resetData: () => {
      setState(initialState);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* abaikan */
      }
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = React.useContext(AppContext);
  if (!ctx) throw new Error("useApp harus dipakai di dalam AppProvider");
  return ctx;
}
