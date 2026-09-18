import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, Users, School, BookOpen, ClipboardEdit, History } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { JudulHalaman } from "@/components/halaman";
import { useApp } from "@/store/app-store";
import { mapelPerKelas } from "@/data/seed";
import { hitungNilaiAkhir, predikat } from "@/lib/penilaian";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dasbor — SMK Muhammadiyah 1 Paguyangan" },
      { name: "description", content: "Ringkasan statistik sekolah, progres input nilai, dan aktivitas terkini." },
      { property: "og:title", content: "Dasbor — SMK Muhammadiyah 1 Paguyangan" },
      { property: "og:description", content: "Ringkasan statistik sekolah, progres input nilai, dan aktivitas terkini." },
    ],
  }),
  component: Dasbor,
});

function Dasbor() {
  const { siswa, guru, kelas, mapel, nilai, log, bobot, tahunAktif, peran, namaPengguna } = useApp();

  const nilaiTa = nilai.filter((n) => n.tahunAjaranId === tahunAktif?.id);

  const distribusi = [
    { predikat: "A", jumlah: 0, warna: "#059669" },
    { predikat: "B", jumlah: 0, warna: "#0284c7" },
    { predikat: "C", jumlah: 0, warna: "#d97706" },
    { predikat: "D", jumlah: 0, warna: "#e11d48" },
  ];
  let totalNa = 0;
  let terisi = 0;
  nilaiTa.forEach((n) => {
    const na = hitungNilaiAkhir(n, bobot);
    if (na === null) return;
    terisi++;
    totalNa += na;
    const p = predikat(na);
    const d = distribusi.find((x) => x.predikat === p);
    if (d) d.jumlah++;
  });
  const rataRata = terisi ? Math.round((totalNa / terisi) * 10) / 10 : 0;

  const progresKelas = kelas.map((k) => {
    const siswaKelas = siswa.filter((s) => s.kelasId === k.id);
    const mapelIds = mapelPerKelas[k.id] ?? mapel.map((m) => m.id);
    const target = siswaKelas.length * mapelIds.length;
    const lengkap = nilaiTa.filter(
      (n) => siswaKelas.some((s) => s.id === n.siswaId) && mapelIds.includes(n.mapelId) && hitungNilaiAkhir(n, bobot) !== null,
    ).length;
    return { kelas: k.nama, persen: target ? Math.round((lengkap / target) * 100) : 0, lengkap, target };
  });

  const statistik = [
    { label: "Siswa Aktif", nilai: siswa.length, icon: GraduationCap, warna: "text-sky-600 bg-sky-50" },
    { label: "Guru & Tendik", nilai: guru.length, icon: Users, warna: "text-emerald-600 bg-emerald-50" },
    { label: "Rombel Kelas", nilai: kelas.length, icon: School, warna: "text-violet-600 bg-violet-50" },
    { label: "Mata Pelajaran", nilai: mapel.length, icon: BookOpen, warna: "text-amber-600 bg-amber-50" },
  ];

  return (
    <div className="space-y-6">
      <JudulHalaman
        judul={`Selamat datang, ${namaPengguna}`}
        deskripsi={`Ringkasan akademik tahun ajaran ${tahunAktif?.tahun} semester ${tahunAktif?.semester}.`}
        aksi={
          peran !== "siswa" ? (
            <Button asChild>
              <Link to="/input-nilai">
                <ClipboardEdit className="mr-2 h-4 w-4" /> Input Nilai
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/rekap-nilai">Lihat Nilai Saya</Link>
            </Button>
          )
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistik.map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.warna}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-semibold leading-none">{s.nilai}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Distribusi Predikat Nilai</CardTitle>
            <CardDescription>
              Rata-rata nilai akhir sekolah: <span className="font-semibold text-foreground">{rataRata}</span> dari{" "}
              {terisi} nilai terinput.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distribusi}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="predikat" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
                <RTooltip formatter={(v: number) => [`${v} nilai`, "Jumlah"]} />
                <Bar dataKey="jumlah" radius={[6, 6, 0, 0]}>
                  {distribusi.map((d) => (
                    <Cell key={d.predikat} fill={d.warna} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Penginputan Nilai</CardTitle>
            <CardDescription>Kelengkapan nilai akhir per rombel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {progresKelas.map((p) => (
              <div key={p.kelas}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{p.kelas}</span>
                  <Badge variant={p.persen === 100 ? "default" : "secondary"}>{p.persen}%</Badge>
                </div>
                <Progress value={p.persen} />
                <p className="mt-1 text-xs text-muted-foreground">
                  {p.lengkap} dari {p.target} nilai lengkap
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-4 w-4" /> Aktivitas Terkini
          </CardTitle>
          <CardDescription>Lima aktivitas terakhir pada sistem</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {log.slice(0, 5).map((l) => (
            <div key={l.id} className="flex flex-wrap items-start gap-3 rounded-lg border p-3">
              <Badge variant="outline">{l.aksi}</Badge>
              <div className="min-w-0 flex-1">
                <p className="text-sm">{l.keterangan}</p>
                <p className="text-xs text-muted-foreground">
                  {l.pelaku} · {new Date(l.waktu).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
