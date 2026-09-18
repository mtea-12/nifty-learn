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
import type { Guru } from "@/data/seed";

export const Route = createFileRoute("/guru")({
  head: () => ({
    meta: [
      { title: "Manajemen Guru & Tenaga Pendidik — SMK Muhammadiyah 1 Paguyangan" },
      { name: "description", content: "Kelola data guru, NIP, kontak, mata pelajaran yang diampu, dan penugasan wali kelas." },
      { property: "og:title", content: "Manajemen Guru & Tenaga Pendidik — SMK Muhammadiyah 1 Paguyangan" },
      { property: "og:description", content: "Kelola data guru, NIP, kontak, dan penugasan wali kelas." },
    ],
  }),
  component: () => (
    <Penjaga url="/guru">
      <HalamanGuru />
    </Penjaga>
  ),
});

const kosong: Guru = { id: "", nip: "", nama: "", email: "", telepon: "", mapelIds: [], status: "PNS" };

function HalamanGuru() {
  const { guru, mapel, kelas, simpanGuru, hapusGuru } = useApp();
  const [cari, setCari] = React.useState("");
  const [form, setForm] = React.useState<Guru | null>(null);

  const daftar = guru.filter(
    (g) => g.nama.toLowerCase().includes(cari.toLowerCase()) || g.nip.includes(cari) || g.email.toLowerCase().includes(cari.toLowerCase()),
  );

  const waliDari = (id: string) => kelas.find((k) => k.waliKelasId === id)?.nama;

  function simpan() {
    if (!form) return;
    if (!form.nama.trim() || !form.nip.trim()) {
      toast.error("Nama dan NIP wajib diisi.");
      return;
    }
    simpanGuru({ ...form, id: form.id || `g${Date.now()}` });
    toast.success("Data guru tersimpan.");
    setForm(null);
  }

  return (
    <div className="space-y-6">
      <JudulHalaman
        judul="Guru & Tenaga Pendidik"
        deskripsi="Daftar guru beserta identitas, kontak, dan penugasan."
        aksi={
          <Button onClick={() => setForm({ ...kosong })}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Guru
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari nama, NIP, atau email..." className="pl-9" value={cari} onChange={(e) => setCari(e.target.value)} />
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>NIP</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Mapel Diampu</TableHead>
                  <TableHead>Wali Kelas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {daftar.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.nama}</TableCell>
                    <TableCell className="font-mono text-xs">{g.nip}</TableCell>
                    <TableCell className="text-xs">
                      <div>{g.email}</div>
                      <div className="text-muted-foreground">{g.telepon}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {g.mapelIds.map((id) => (
                          <Badge key={id} variant="secondary">
                            {mapel.find((m) => m.id === id)?.kode ?? id}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {waliDari(g.id) ? <Badge>{waliDari(g.id)}</Badge> : <span className="text-xs text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{g.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setForm(g)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          hapusGuru(g.id);
                          toast.success("Data guru dihapus.");
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {daftar.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                      Tidak ada data guru yang cocok.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{form?.id ? "Ubah Data Guru" : "Tambah Guru"}</DialogTitle>
            <DialogDescription>Lengkapi identitas guru dan mata pelajaran yang diampu.</DialogDescription>
          </DialogHeader>
          {form ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input id="nama" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="nip">NIP</Label>
                <Input id="nip" value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} />
              </div>
              <div>
                <Label>Status Kepegawaian</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Guru["status"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["PNS", "PPPK", "GTY", "Honorer"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="telp">Telepon</Label>
                <Input id="telp" value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Mata Pelajaran Diampu</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {mapel.map((m) => {
                    const aktif = form.mapelIds.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            mapelIds: aktif ? form.mapelIds.filter((x) => x !== m.id) : [...form.mapelIds, m.id],
                          })
                        }
                        className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                          aktif ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"
                        }`}
                      >
                        {m.kode}
                      </button>
                    );
                  })}
                </div>
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
