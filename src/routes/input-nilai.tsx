import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Save, Info } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JudulHalaman, Penjaga } from "@/components/halaman";
import { useApp } from "@/store/app-store";
import { hitungNilaiAkhir, predikat, warnaPredikat } from "@/lib/penilaian";
import { mapelPerKelas, type Nilai } from "@/data/seed";

export const Route = createFileRoute("/input-nilai")({
  head: () => ({
    meta: [
      { title: "Input Nilai — Nifty Grades Hub" },
      { name: "description", content: "Input nilai tugas, harian, PTS/STS, dan PAS/SAS dengan nilai akhir dan predikat otomatis." },
      { property: "og:title", content: "Input Nilai — Nifty Grades Hub" },
      { property: "og:description", content: "Input nilai dengan kalkulasi nilai akhir dan predikat otomatis." },
    ],
  }),
  component: () => (
    <Penjaga url="/input-nilai">
      <HalamanInput />
    </Penjaga>
  ),
});

function HalamanInput() {
  const app = useApp();
  const { kelas, mapel, siswa, nilai, bobot, tahunAktif, ubahNilai, catatLog, peran, guru, guruAktifId, waliAktifId } = app;

  const kelasTersedia = peran === "wali" ? kelas.filter((k) => k.waliKelasId === waliAktifId) : kelas;
  const [kelasId, setKelasId] = React.useState(kelasTersedia[0]?.id ?? "");

  const mapelKelas = mapel.filter((m) => (mapelPerKelas[kelasId] ?? mapel.map((x) => x.id)).includes(m.id));
  const mapelGuru =
    peran === "guru"
      ? mapelKelas.filter((m) => (guru.find((g) => g.id === guruAktifId)?.mapelIds ?? []).includes(m.id))
      : mapelKelas;

  const [mapelId, setMapelId] = React.useState(mapelGuru[0]?.id ?? "");

  React.useEffect(() => {
    if (!kelasTersedia.some((k) => k.id === kelasId)) setKelasId(kelasTersedia[0]?.id ?? "");
  }, [kelasTersedia, kelasId]);

  React.useEffect(() => {
    if (!mapelGuru.some((m) => m.id === mapelId)) setMapelId(mapelGuru[0]?.id ?? "");
  }, [mapelGuru, mapelId]);

  const mapelTerpilih = mapel.find((m) => m.id === mapelId);
  const daftarSiswa = siswa.filter((s) => s.kelasId === kelasId);

  const cariNilai = (siswaId: string): Nilai =>
    nilai.find((n) => n.siswaId === siswaId && n.mapelId === mapelId && n.tahunAjaranId === tahunAktif?.id) ?? {
      id: "",
      siswaId,
      mapelId,
      tahunAjaranId: tahunAktif?.id ?? "",
      tugas: null,
      harian: null,
      pts: null,
      pas: null,
    };

  const kolom = [
    ["tugas", "Tugas", bobot.tugas],
    ["harian", "Harian", bobot.harian],
    ["pts", "PTS/STS", bobot.pts],
    ["pas", "PAS/SAS", bobot.pas],
  ] as const;

  const lengkap = daftarSiswa.filter((s) => hitungNilaiAkhir(cariNilai(s.id), bobot) !== null).length;

  if (!mapelTerpilih || !kelasId) {
    return (
      <div className="space-y-6">
        <JudulHalaman judul="Input Nilai" deskripsi="Belum ada kelas atau mata pelajaran yang dapat diinput untuk peran ini." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <JudulHalaman
        judul="Input Nilai"
        deskripsi={`Tahun ajaran ${tahunAktif?.tahun} semester ${tahunAktif?.semester}. Nilai akhir dihitung otomatis.`}
        aksi={
          <Button
            onClick={() => {
              catatLog("Input Nilai", "Nilai", `Menyimpan nilai ${mapelTerpilih.nama} kelas ${kelas.find((k) => k.id === kelasId)?.nama}`);
              toast.success("Nilai tersimpan.");
            }}
          >
            <Save className="mr-2 h-4 w-4" /> Simpan & Catat
          </Button>
        }
      />

      <Card>
        <CardContent className="grid gap-4 pt-6 sm:grid-cols-3">
          <div>
            <Label>Kelas</Label>
            <Select value={kelasId} onValueChange={setKelasId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {kelasTersedia.map((k) => (
                  <SelectItem key={k.id} value={k.id}>
                    {k.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Mata Pelajaran</Label>
            <Select value={mapelId} onValueChange={setMapelId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mapelGuru.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.kode} — {m.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Badge variant="outline">KKM {mapelTerpilih.kkm}</Badge>
            <Badge variant={lengkap === daftarSiswa.length ? "default" : "secondary"}>
              {lengkap}/{daftarSiswa.length} lengkap
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {mapelTerpilih.nama} · {kelas.find((k) => k.id === kelasId)?.nama}
          </CardTitle>
          <CardDescription className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            Bobot: Tugas {bobot.tugas}% · Harian {bobot.harian}% · PTS {bobot.pts}% · PAS {bobot.pas}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">No</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  {kolom.map(([key, label, b]) => (
                    <TableHead key={key} className="w-28">
                      {label} <span className="text-xs font-normal text-muted-foreground">({b}%)</span>
                    </TableHead>
                  ))}
                  <TableHead>Nilai Akhir</TableHead>
                  <TableHead>Predikat</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {daftarSiswa.map((s, i) => {
                  const n = cariNilai(s.id);
                  const na = hitungNilaiAkhir(n, bobot);
                  const p = predikat(na);
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                      <TableCell className="font-medium">
                        {s.nama}
                        <div className="text-xs text-muted-foreground">{s.nisn}</div>
                      </TableCell>
                      {kolom.map(([key]) => (
                        <TableCell key={key}>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            className="h-9 w-20"
                            value={n[key] ?? ""}
                            onChange={(e) => {
                              const v = e.target.value === "" ? null : Math.max(0, Math.min(100, Number(e.target.value)));
                              ubahNilai(s.id, mapelId, key, v);
                            }}
                          />
                        </TableCell>
                      ))}
                      <TableCell className="font-semibold">{na ?? "—"}</TableCell>
                      <TableCell>
                        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${warnaPredikat(p)}`}>
                          {p}
                        </span>
                      </TableCell>
                      <TableCell>
                        {na === null ? (
                          <Badge variant="secondary">Belum Lengkap</Badge>
                        ) : na >= mapelTerpilih.kkm ? (
                          <Badge className="bg-emerald-600 hover:bg-emerald-600">Tuntas</Badge>
                        ) : (
                          <Badge variant="destructive">Belum Tuntas</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
