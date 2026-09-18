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
import type { Mapel } from "@/data/seed";

export const Route = createFileRoute("/mata-pelajaran")({
  head: () => ({
    meta: [
      { title: "Mata Pelajaran & KKM — Nifty Grades Hub" },
      { name: "description", content: "Daftar mata pelajaran, kode, kelompok, dan kriteria ketuntasan minimal." },
      { property: "og:title", content: "Mata Pelajaran & KKM — Nifty Grades Hub" },
      { property: "og:description", content: "Daftar mata pelajaran, kode, kelompok, dan KKM." },
    ],
  }),
  component: () => (
    <Penjaga url="/mata-pelajaran">
      <HalamanMapel />
    </Penjaga>
  ),
});

function HalamanMapel() {
  const { mapel, guru, simpanMapel, hapusMapel, peran } = useApp();
  const [cari, setCari] = React.useState("");
  const [form, setForm] = React.useState<Mapel | null>(null);
  const bolehUbah = peran === "admin";

  const kosong: Mapel = { id: "", kode: "", nama: "", kelompok: "Umum", kkm: 75 };
  const daftar = mapel.filter((m) => m.nama.toLowerCase().includes(cari.toLowerCase()) || m.kode.toLowerCase().includes(cari.toLowerCase()));

  function simpan() {
    if (!form) return;
    if (!form.nama.trim() || !form.kode.trim()) {
      toast.error("Kode dan nama mapel wajib diisi.");
      return;
    }
    simpanMapel({ ...form, id: form.id || `mp${Date.now()}` });
    toast.success("Mata pelajaran tersimpan.");
    setForm(null);
  }

  return (
    <div className="space-y-6">
      <JudulHalaman
        judul="Mata Pelajaran"
        deskripsi="Kelompok mata pelajaran beserta kriteria ketuntasan minimal (KKM)."
        aksi={
          bolehUbah ? (
            <Button onClick={() => setForm({ ...kosong })}>
              <Plus className="mr-2 h-4 w-4" /> Tambah Mapel
            </Button>
          ) : null
        }
      />

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Cari mata pelajaran..." className="pl-9" value={cari} onChange={(e) => setCari(e.target.value)} />
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Nama Mata Pelajaran</TableHead>
                  <TableHead>Kelompok</TableHead>
                  <TableHead>KKM</TableHead>
                  <TableHead>Guru Pengampu</TableHead>
                  {bolehUbah ? <TableHead className="text-right">Aksi</TableHead> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {daftar.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono text-xs font-semibold">{m.kode}</TableCell>
                    <TableCell className="font-medium">{m.nama}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          m.kelompok === "Kejuruan"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : m.kelompok === "Peminatan"
                              ? "border-violet-200 bg-violet-50 text-violet-700"
                              : ""
                        }
                      >
                        {m.kelompok}
                      </Badge>
                    </TableCell>
                    <TableCell>{m.kkm}</TableCell>
                    <TableCell className="text-xs">
                      {guru
                        .filter((g) => g.mapelIds.includes(m.id))
                        .map((g) => g.nama)
                        .join(", ") || "—"}
                    </TableCell>
                    {bolehUbah ? (
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setForm(m)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            hapusMapel(m.id);
                            toast.success("Mata pelajaran dihapus.");
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!form} onOpenChange={(o) => !o && setForm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form?.id ? "Ubah Mata Pelajaran" : "Tambah Mata Pelajaran"}</DialogTitle>
            <DialogDescription>Tentukan kode, kelompok, dan batas ketuntasan.</DialogDescription>
          </DialogHeader>
          {form ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Kode</Label>
                <Input value={form.kode} onChange={(e) => setForm({ ...form, kode: e.target.value.toUpperCase() })} />
              </div>
              <div>
                <Label>KKM</Label>
                <Input type="number" value={form.kkm} onChange={(e) => setForm({ ...form, kkm: Number(e.target.value) })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Nama Mata Pelajaran</Label>
                <Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>Kelompok</Label>
                <Select value={form.kelompok} onValueChange={(v) => setForm({ ...form, kelompok: v as Mapel["kelompok"] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Umum", "Kejuruan", "Peminatan"].map((k) => (
                      <SelectItem key={k} value={k}>
                        {k}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
