import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JudulHalaman, Penjaga } from "@/components/halaman";
import { useApp } from "@/store/app-store";
import { hitungNilaiAkhir, predikat, warnaPredikat } from "@/lib/penilaian";
import { mapelPerKelas } from "@/data/seed";

export const Route = createFileRoute("/rekap-nilai")({
  head: () => ({
    meta: [
      { title: "Rekap & Analisis Nilai — Nifty Grades Hub" },
      { name: "description", content: "Rekap nilai per kelas, per mata pelajaran, dan per semester dengan grafik distribusi." },
      { property: "og:title", content: "Rekap & Analisis Nilai — Nifty Grades Hub" },
      { property: "og:description", content: "Rekap nilai per kelas dan per mata pelajaran dengan grafik distribusi." },
    ],
  }),
  component: () => (
    <Penjaga url="/rekap-nilai">
      <HalamanRekap />
    </Penjaga>
  ),
});

function HalamanRekap() {
  const app = useApp();
  const { kelas, mapel, siswa, nilai, bobot, tahunAjaran, tahunAktif, peran, siswaAktifId, waliAktifId } = app;

  const siswaSaya = siswa.find((s) => s.id === siswaAktifId);
  const kelasTersedia =
    peran === "wali"
      ? kelas.filter((k) => k.waliKelasId === waliAktifId)
      : peran === "siswa"
        ? kelas.filter((k) => k.id === siswaSaya?.kelasId)
        : kelas;

  const [kelasId, setKelasId] = React.useState(kelasTersedia[0]?.id ?? "");
  const [taId, setTaId] = React.useState(tahunAktif?.id ?? "");
  const [cari, setCari] = React.useState("");

  React.useEffect(() => {
    if (!kelasTersedia.some((k) => k.id === kelasId)) setKelasId(kelasTersedia[0]?.id ?? "");
  }, [kelasTersedia, kelasId]);

  const mapelKelas = mapel.filter((m) => (mapelPerKelas[kelasId] ?? mapel.map((x) => x.id)).includes(m.id));
  const daftarSiswa = siswa
    .filter((s) => s.kelasId === kelasId)
    .filter((s) => (peran === "siswa" ? s.id === siswaAktifId : true))
    .filter((s) => s.nama.toLowerCase().includes(cari.toLowerCase()));

  const na = (siswaId: string, mapelId: string) => {
    const n = nilai.find((x) => x.siswaId === siswaId && x.mapelId === mapelId && x.tahunAjaranId === taId);
    return n ? hitungNilaiAkhir(n, bobot) : null;
  };

  const barisRekap = daftarSiswa
    .map((s) => {
      const nilaiMapel = mapelKelas.map((m) => na(s.id, m.id));
      const terisi = nilaiMapel.filter((v): v is number => v !== null);
      const rata = terisi.length ? Math.round((terisi.reduce((a, b) => a + b, 0) / terisi.length) * 10) / 10 : null;
      const tuntas = mapelKelas.filter((m, i) => nilaiMapel[i] !== null && (nilaiMapel[i] as number) >= m.kkm).length;
      return { siswa: s, nilaiMapel, rata, tuntas };
    })
    .sort((a, b) => (b.rata ?? -1) - (a.rata ?? -1));

  const rataPerMapel = mapelKelas.map((m) => {
    const vals = daftarSiswa.map((s) => na(s.id, m.id)).filter((v): v is number => v !== null);
    return {
      mapel: m.kode,
      rata: vals.length ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10 : 0,
      kkm: m.kkm,
    };
  });

  const distribusi = [
    { predikat: "A (≥90)", jumlah: 0, warna: "#059669" },
    { predikat: "B (80-89)", jumlah: 0, warna: "#0284c7" },
    { predikat: "C (70-79)", jumlah: 0, warna: "#d97706" },
    { predikat: "D (<70)", jumlah: 0, warna: "#e11d48" },
  ];
  daftarSiswa.forEach((s) =>
    mapelKelas.forEach((m) => {
      const v = na(s.id, m.id);
      if (v === null) return;
      const idx = v >= 90 ? 0 : v >= 80 ? 1 : v >= 70 ? 2 : 3;
      distribusi[idx].jumlah++;
    }),
  );

  return (
    <div className="space-y-6">
      <JudulHalaman
        judul="Rekap & Analisis Nilai"
        deskripsi="Tabel rekap interaktif dan grafik sebaran nilai per kelas dan mata pelajaran."
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
            <Label>Tahun Ajaran / Semester</Label>
            <Select value={taId} onValueChange={setTaId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tahunAjaran.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.tahun} — {t.semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Cari Siswa</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Nama siswa..." value={cari} onChange={(e) => setCari(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Rata-rata per Mata Pelajaran</CardTitle>
            <CardDescription>Perbandingan rata-rata nilai akhir kelas</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rataPerMapel}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="mapel" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} />
                <RTooltip />
                <Legend />
                <Bar dataKey="rata" name="Rata-rata" fill="#2563eb" radius={[6, 6, 0, 0]} />
                <Bar dataKey="kkm" name="KKM" fill="#cbd5e1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Nilai</CardTitle>
            <CardDescription>Sebaran predikat seluruh nilai pada kelas terpilih</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribusi}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="predikat" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
                <RTooltip />
                <Bar dataKey="jumlah" name="Jumlah nilai" radius={[6, 6, 0, 0]}>
                  {distribusi.map((d) => (
                    <Cell key={d.predikat} fill={d.warna} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tabel Rekap Nilai</CardTitle>
          <CardDescription>Diurutkan berdasarkan rata-rata tertinggi (peringkat kelas).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead className="min-w-[180px]">Nama Siswa</TableHead>
                  {mapelKelas.map((m) => (
                    <TableHead key={m.id} className="text-center">
                      {m.kode}
                    </TableHead>
                  ))}
                  <TableHead className="text-center">Rata-rata</TableHead>
                  <TableHead className="text-center">Predikat</TableHead>
                  <TableHead className="text-center">Tuntas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {barisRekap.map((b, i) => (
                  <TableRow key={b.siswa.id}>
                    <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="font-medium">{b.siswa.nama}</TableCell>
                    {b.nilaiMapel.map((v, idx) => (
                      <TableCell
                        key={mapelKelas[idx].id}
                        className={`text-center ${v !== null && v < mapelKelas[idx].kkm ? "font-medium text-destructive" : ""}`}
                      >
                        {v ?? "—"}
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-semibold">{b.rata ?? "—"}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${warnaPredikat(predikat(b.rata))}`}
                      >
                        {predikat(b.rata)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {b.tuntas}/{mapelKelas.length}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {barisRekap.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={mapelKelas.length + 5} className="py-10 text-center text-sm text-muted-foreground">
                      Tidak ada data nilai untuk filter ini.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
