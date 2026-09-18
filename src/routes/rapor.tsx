import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Printer, X } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JudulHalaman, Penjaga } from "@/components/halaman";
import { useApp } from "@/store/app-store";
import { deskripsiPredikat, hitungNilaiAkhir, predikat } from "@/lib/penilaian";
import { ALAMAT_SEKOLAH, NAMA_SEKOLAH, TELP_SEKOLAH, mapelPerKelas, type JenisIdentitas } from "@/data/seed";
import logoSekolah from "@/assets/logo-smk.jpg.asset.json";

export const Route = createFileRoute("/rapor")({
  head: () => ({
    meta: [
      { title: "Cetak Rapor Semester — SMK Muhammadiyah 1 Paguyangan" },
      { name: "description", content: "Rapor resmi siap cetak: identitas siswa, capaian nilai, ekstrakurikuler, presensi, dan catatan wali kelas." },
      { property: "og:title", content: "Cetak Rapor Semester — SMK Muhammadiyah 1 Paguyangan" },
      { property: "og:description", content: "Rapor resmi siap cetak dan ekspor PDF." },
    ],
  }),
  component: () => (
    <Penjaga url="/rapor">
      <HalamanRapor />
    </Penjaga>
  ),
});

function HalamanRapor() {
  const app = useApp();
  const {
    siswa,
    kelas,
    mapel,
    nilai,
    bobot,
    rapor,
    tahunAktif,
    guru,
    peran,
    siswaAktifId,
    waliAktifId,
    kepalaSekolah,
    ubahRapor,
    ubahKepalaSekolah,
    catatLog,
  } = app;

  const siswaTersedia =
    peran === "siswa"
      ? siswa.filter((s) => s.id === siswaAktifId)
      : peran === "wali"
        ? siswa.filter((s) => kelas.some((k) => k.id === s.kelasId && k.waliKelasId === waliAktifId))
        : siswa;

  const [siswaId, setSiswaId] = React.useState(siswaTersedia[0]?.id ?? "");
  React.useEffect(() => {
    if (!siswaTersedia.some((s) => s.id === siswaId)) setSiswaId(siswaTersedia[0]?.id ?? "");
  }, [siswaTersedia, siswaId]);

  const s = siswa.find((x) => x.id === siswaId);
  const kls = kelas.find((k) => k.id === s?.kelasId);
  const wali = guru.find((g) => g.id === kls?.waliKelasId);
  const tambahan = rapor.find((r) => r.siswaId === siswaId);
  const bolehEdit = peran === "admin" || peran === "wali";

  if (!s) {
    return <JudulHalaman judul="Cetak Rapor" deskripsi="Tidak ada siswa yang tersedia untuk peran ini." />;
  }

  const mapelKelas = mapel.filter((m) => (mapelPerKelas[s.kelasId] ?? mapel.map((x) => x.id)).includes(m.id));
  const baris = mapelKelas.map((m) => {
    const n = nilai.find((x) => x.siswaId === s.id && x.mapelId === m.id && x.tahunAjaranId === tahunAktif?.id);
    const na = n ? hitungNilaiAkhir(n, bobot) : null;
    return { mapel: m, na, p: predikat(na) };
  });
  const terisi = baris.map((b) => b.na).filter((v): v is number => v !== null);
  const rata = terisi.length ? Math.round((terisi.reduce((a, b) => a + b, 0) / terisi.length) * 10) / 10 : 0;

  return (
    <div className="space-y-6">
      <div className="tanpa-cetak space-y-6">
        <JudulHalaman
          judul="Cetak Rapor Semester"
          deskripsi="Pratinjau rapor resmi. Gunakan tombol cetak lalu pilih 'Simpan sebagai PDF'."
          aksi={
            <Button
              onClick={() => {
                catatLog("Cetak Rapor", "Rapor", `Mencetak rapor ${s.nama} (${kls?.nama}) semester ${tahunAktif?.semester}`);
                window.print();
              }}
            >
              <Printer className="mr-2 h-4 w-4" /> Cetak / Simpan PDF
            </Button>
          }
        />

        <Card>
          <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
            <div>
              <Label>Pilih Siswa</Label>
              <Select value={siswaId} onValueChange={setSiswaId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {siswaTersedia.map((x) => (
                    <SelectItem key={x.id} value={x.id}>
                      {x.nama} — {kelas.find((k) => k.id === x.kelasId)?.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {bolehEdit ? (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {(["sakit", "izin", "alpa"] as const).map((k) => (
                    <div key={k}>
                      <Label className="capitalize">{k}</Label>
                      <Input
                        type="number"
                        min={0}
                        value={tambahan?.[k] ?? 0}
                        onChange={(e) => ubahRapor(s.id, { [k]: Number(e.target.value) })}
                      />
                    </div>
                  ))}
                </div>
                <div className="md:col-span-2">
                  <Label>Catatan Wali Kelas</Label>
                  <Textarea rows={3} value={tambahan?.catatan ?? ""} onChange={(e) => ubahRapor(s.id, { catatan: e.target.value })} />
                </div>
                <div className="space-y-3 border-t pt-4 md:col-span-2">
                  <div>
                    <Label htmlFor="nama-kepala-sekolah">Nama Kepala Sekolah</Label>
                    <Input
                      id="nama-kepala-sekolah"
                      value={kepalaSekolah.nama}
                      onChange={(e) => ubahKepalaSekolah({ nama: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Nomor Identitas Kepala Sekolah</Label>
                    <div className="mt-1 flex gap-2">
                      <Select
                        value={kepalaSekolah.jenisIdentitas}
                        onValueChange={(v) => ubahKepalaSekolah({ jenisIdentitas: v as JenisIdentitas })}
                      >
                        <SelectTrigger className="w-28" aria-label="Jenis identitas kepala sekolah">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NIP">NIP</SelectItem>
                          <SelectItem value="NBM">NBM</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        aria-label={`Nomor ${kepalaSekolah.jenisIdentitas} kepala sekolah`}
                        placeholder={`Masukkan nomor ${kepalaSekolah.jenisIdentitas}`}
                        value={kepalaSekolah.nomorIdentitas}
                        onChange={(e) => ubahKepalaSekolah({ nomorIdentitas: e.target.value })}
                      />
                      {kepalaSekolah.nomorIdentitas ? (
                        <Button
                          variant="outline"
                          size="icon"
                          title="Hapus nomor identitas kepala sekolah"
                          onClick={() => ubahKepalaSekolah({ nomorIdentitas: "" })}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <div className="area-cetak rounded-lg border bg-white p-8 text-slate-900 shadow-sm">
        <div className="flex items-center justify-center gap-4 border-b-2 border-slate-800 pb-4 text-center">
          <img src={logoSekolah.url} alt="Logo sekolah" className="h-16 w-16 shrink-0 object-contain" />
          <div className="flex-1 text-center">
            <h2 className="text-lg font-bold uppercase">Laporan Hasil Belajar Peserta Didik</h2>
            <p className="text-base font-semibold">{NAMA_SEKOLAH}</p>
            <p className="text-xs">{ALAMAT_SEKOLAH}</p>
            <p className="text-xs">{TELP_SEKOLAH}</p>
          </div>
          <img src={logoSekolah.url} alt="" className="h-16 w-16 shrink-0 object-contain opacity-0" aria-hidden="true" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
          <Baris label="Nama Peserta Didik" nilai={s.nama} />
          <Baris label="Kelas" nilai={kls?.nama ?? "—"} />
          <Baris label="NISN / NIS" nilai={`${s.nisn} / ${s.nis}`} />
          <Baris label="Semester" nilai={`${tahunAktif?.semester}`} />
          <Baris label="Tempat, Tanggal Lahir" nilai={`${s.tempatLahir}, ${s.tanggalLahir}`} />
          <Baris label="Tahun Pelajaran" nilai={tahunAktif?.tahun ?? "—"} />
          <Baris label="Nama Orang Tua/Wali" nilai={`${s.ayah} / ${s.ibu}`} />
          <Baris label="Wali Kelas" nilai={wali?.nama ?? "—"} />
        </div>

        <h3 className="mt-6 text-sm font-bold uppercase">A. Capaian Nilai Akademik</h3>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 px-2 py-1.5 text-left">No</th>
              <th className="border border-slate-300 px-2 py-1.5 text-left">Mata Pelajaran</th>
              <th className="border border-slate-300 px-2 py-1.5">KKM</th>
              <th className="border border-slate-300 px-2 py-1.5">Nilai</th>
              <th className="border border-slate-300 px-2 py-1.5">Predikat</th>
              <th className="border border-slate-300 px-2 py-1.5 text-left">Capaian Kompetensi</th>
            </tr>
          </thead>
          <tbody>
            {baris.map((b, i) => (
              <tr key={b.mapel.id}>
                <td className="border border-slate-300 px-2 py-1.5">{i + 1}</td>
                <td className="border border-slate-300 px-2 py-1.5">{b.mapel.nama}</td>
                <td className="border border-slate-300 px-2 py-1.5 text-center">{b.mapel.kkm}</td>
                <td className="border border-slate-300 px-2 py-1.5 text-center font-semibold">{b.na ?? "—"}</td>
                <td className="border border-slate-300 px-2 py-1.5 text-center">{b.p}</td>
                <td className="border border-slate-300 px-2 py-1.5 text-xs">
                  {b.na === null
                    ? "Nilai belum lengkap."
                    : `Menunjukkan capaian ${deskripsiPredikat(b.p).toLowerCase()} pada ${b.mapel.nama.toLowerCase()}.`}
                </td>
              </tr>
            ))}
            <tr className="bg-slate-50 font-semibold">
              <td className="border border-slate-300 px-2 py-1.5" colSpan={3}>
                Rata-rata
              </td>
              <td className="border border-slate-300 px-2 py-1.5 text-center">{rata}</td>
              <td className="border border-slate-300 px-2 py-1.5 text-center">{predikat(rata)}</td>
              <td className="border border-slate-300 px-2 py-1.5" />
            </tr>
          </tbody>
        </table>

        <h3 className="mt-6 text-sm font-bold uppercase">B. Ekstrakurikuler</h3>
        <table className="mt-2 w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 px-2 py-1.5 text-left">Kegiatan</th>
              <th className="border border-slate-300 px-2 py-1.5">Predikat</th>
              <th className="border border-slate-300 px-2 py-1.5 text-left">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {(tambahan?.ekskul ?? []).map((e) => (
              <tr key={e.nama}>
                <td className="border border-slate-300 px-2 py-1.5">{e.nama}</td>
                <td className="border border-slate-300 px-2 py-1.5 text-center">{e.predikat}</td>
                <td className="border border-slate-300 px-2 py-1.5 text-xs">{e.deskripsi}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold uppercase">C. Ketidakhadiran</h3>
            <table className="mt-2 w-full border-collapse text-sm">
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-2 py-1.5">Sakit</td>
                  <td className="border border-slate-300 px-2 py-1.5 text-center">{tambahan?.sakit ?? 0} hari</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-2 py-1.5">Izin</td>
                  <td className="border border-slate-300 px-2 py-1.5 text-center">{tambahan?.izin ?? 0} hari</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-2 py-1.5">Tanpa Keterangan</td>
                  <td className="border border-slate-300 px-2 py-1.5 text-center">{tambahan?.alpa ?? 0} hari</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase">D. Catatan Wali Kelas</h3>
            <p className="mt-2 min-h-[80px] rounded border border-slate-300 p-2 text-sm">{tambahan?.catatan}</p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p>Orang Tua/Wali</p>
            <div className="h-16" />
            <p className="border-t border-slate-400 pt-1">{s.ayah}</p>
          </div>
          <div>
            <p>Bandung, {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
            <p>Wali Kelas</p>
            <div className="h-12" />
            <p className="border-t border-slate-400 pt-1">{wali?.nama}</p>
            {wali?.nip ? <p>{wali.jenisIdentitas ?? "NIP"}. {wali.nip}</p> : null}
          </div>
          <div>
            <p>Kepala Sekolah</p>
            <div className="h-16" />
            <p className="border-t border-slate-400 pt-1">{kepalaSekolah.nama || "—"}</p>
            {kepalaSekolah.nomorIdentitas ? <p>{kepalaSekolah.jenisIdentitas}. {kepalaSekolah.nomorIdentitas}</p> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Baris({ label, nilai }: { label: string; nilai: string }) {
  return (
    <div className="flex gap-2">
      <span className="w-44 shrink-0">{label}</span>
      <span>: {nilai}</span>
    </div>
  );
}
