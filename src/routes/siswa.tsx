import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JudulHalaman, Penjaga } from "@/components/halaman";
import { useApp } from "@/store/app-store";
import type { Siswa } from "@/data/seed";

export const Route = createFileRoute("/siswa")({
  head: () => ({
    meta: [
      { title: "Manajemen Siswa — SMK Muhammadiyah 1 Paguyangan" },
      { name: "description", content: "Data induk siswa: NISN, NIS, kelas aktif, dan data orang tua/wali." },
      { property: "og:title", content: "Manajemen Siswa — SMK Muhammadiyah 1 Paguyangan" },
      { property: "og:description", content: "Data induk siswa: NISN, NIS, kelas aktif, dan data orang tua/wali." },
    ],
  }),
  component: () => (
    <Penjaga url="/siswa">
      <HalamanSiswa />
    </Penjaga>
  ),
});

function HalamanSiswa() {
  const { siswa, kelas, simpanSiswa, hapusSiswa, peran, waliAktifId } = useApp();
  const [cari, setCari] = React.useState("");
  const [filterKelas, setFilterKelas] = React.useState("semua");
  const [form, setForm] = React.useState<Siswa | null>(null);

  const kelasTersedia = peran === "wali" ? kelas.filter((k) => k.waliKelasId === waliAktifId) : kelas;
  const idKelasTersedia = new Set(kelasTersedia.map((k) => k.id));

  const kosong: Siswa = {
    id: "",
    nisn: "",
    nis: "",
    nama: "",
    jk: "L",
    kelasId: kelasTersedia[0]?.id ?? "",
    tempatLahir: "",
    tanggalLahir: "",
    ayah: "",
    ibu: "",
    teleponOrtu: "",
    alamat: "",
  };

  const daftar = siswa
    .filter((s) => idKelasTersedia.has(s.kelasId))
    .filter((s) => (filterKelas === "semua" ? true : s.kelasId === filterKelas))
    .filter((s) => s.nama.toLowerCase().includes(cari.toLowerCase()) || s.nisn.includes(cari) || s.nis.includes(cari));

  function simpan() {
    if (!form) return;
    if (!form.nama.trim() || !form.nisn.trim()) {
      toast.error("Nama dan NISN wajib diisi.");
      return;
    }
    simpanSiswa({ ...form, id: form.id || `s${Date.now()}` });
    toast.success("Data siswa tersimpan.");
    setForm(null);
  }

  return (
    <div className="space-y-6">
      <JudulHalaman
        judul="Manajemen Siswa"
        deskripsi="Data induk peserta didik beserta informasi orang tua/wali."
        aksi={
          <Button onClick={() => setForm({ ...kosong })}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Siswa
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari nama, NISN, atau NIS..." className="pl-9" value={cari} onChange={(e) => setCari(e.target.value)} />
            </div>
            <Select value={filterKelas} onValueChange={setFilterKelas}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Semua kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Kelas</SelectItem>
                {kelasTersedia.map((k) => (
                  <SelectItem key={k.id} value={k.id}>
                    {k.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="self-center">
              {daftar.length} siswa
            </Badge>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NISN / NIS</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>JK</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Orang Tua / Wali</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {daftar.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-xs">
                      <div>{s.nisn}</div>
                      <div className="text-muted-foreground">{s.nis}</div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div>{s.nama}</div>
                      <div className="text-xs text-muted-foreground">
                        {s.tempatLahir}, {s.tanggalLahir}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{s.jk === "L" ? "Laki-laki" : "Perempuan"}</Badge>
                    </TableCell>
                    <TableCell>{kelas.find((k) => k.id === s.kelasId)?.nama ?? "—"}</TableCell>
                    <TableCell className="text-xs">
                      <div>Ayah: {s.ayah}</div>
                      <div>Ibu: {s.ibu}</div>
                      <div className="text-muted-foreground">{s.teleponOrtu}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setForm(s)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          hapusSiswa(s.id);
                          toast.success("Data siswa dihapus.");
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {daftar.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                      Tidak ada data siswa yang cocok.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{form?.id ? "Ubah Data Siswa" : "Tambah Siswa"}</DialogTitle>
            <DialogDescription>Isi data induk siswa selengkap mungkin.</DialogDescription>
          </DialogHeader>
          {form ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>NISN</Label>
                <Input value={form.nisn} onChange={(e) => setForm({ ...form, nisn: e.target.value })} />
              </div>
              <div>
                <Label>NIS</Label>
                <Input value={form.nis} onChange={(e) => setForm({ ...form, nis: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Nama Lengkap</Label>
                <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </div>
              <div>
                <Label>Jenis Kelamin</Label>
                <Select value={form.jk} onValueChange={(v) => setForm({ ...form, jk: v as "L" | "P" })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Laki-laki</SelectItem>
                    <SelectItem value="P">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Kelas</Label>
                <Select value={form.kelasId} onValueChange={(v) => setForm({ ...form, kelasId: v })}>
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
                <Label>Tempat Lahir</Label>
                <Input value={form.tempatLahir} onChange={(e) => setForm({ ...form, tempatLahir: e.target.value })} />
              </div>
              <div>
                <Label>Tanggal Lahir</Label>
                <Input type="date" value={form.tanggalLahir} onChange={(e) => setForm({ ...form, tanggalLahir: e.target.value })} />
              </div>
              <div>
                <Label>Nama Ayah</Label>
                <Input value={form.ayah} onChange={(e) => setForm({ ...form, ayah: e.target.value })} />
              </div>
              <div>
                <Label>Nama Ibu</Label>
                <Input value={form.ibu} onChange={(e) => setForm({ ...form, ibu: e.target.value })} />
              </div>
              <div>
                <Label>Telepon Orang Tua</Label>
                <Input value={form.teleponOrtu} onChange={(e) => setForm({ ...form, teleponOrtu: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Alamat</Label>
                <Input value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} />
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setForm(null)}>
              Batal
            </Button>
            <Button onClick={simpan}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
