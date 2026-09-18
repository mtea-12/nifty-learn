import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
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
import type { Kelas } from "@/data/seed";

export const Route = createFileRoute("/kelas")({
  head: () => ({
    meta: [
      { title: "Manajemen Kelas — SMK Muhammadiyah 1 Paguyangan" },
      { name: "description", content: "Daftar tingkat dan rombongan belajar beserta penunjukan wali kelas." },
      { property: "og:title", content: "Manajemen Kelas — SMK Muhammadiyah 1 Paguyangan" },
      { property: "og:description", content: "Daftar tingkat dan rombongan belajar beserta wali kelas." },
    ],
  }),
  component: () => (
    <Penjaga url="/kelas">
      <HalamanKelas />
    </Penjaga>
  ),
});

function HalamanKelas() {
  const { kelas, guru, siswa, simpanKelas, hapusKelas } = useApp();
  const [form, setForm] = React.useState<Kelas | null>(null);

  const kosong: Kelas = { id: "", tingkat: "X", nama: "", waliKelasId: guru[0]?.id ?? "" };

  function simpan() {
    if (!form) return;
    if (!form.nama.trim()) {
      toast.error("Nama rombel wajib diisi.");
      return;
    }
    simpanKelas({ ...form, id: form.id || `k${Date.now()}` });
    toast.success("Data kelas tersimpan.");
    setForm(null);
  }

  return (
    <div className="space-y-6">
      <JudulHalaman
        judul="Manajemen Kelas"
        deskripsi="Rombongan belajar aktif dan wali kelas penanggung jawab."
        aksi={
          <Button onClick={() => setForm({ ...kosong })}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Kelas
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kelas.map((k) => (
          <Card key={k.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold">{k.nama}</p>
                  <p className="text-xs text-muted-foreground">Tingkat {k.tingkat}</p>
                </div>
                <Badge variant="secondary">{siswa.filter((s) => s.kelasId === k.id).length} siswa</Badge>
              </div>
              <p className="mt-3 text-sm">
                Wali: <span className="font-medium">{guru.find((g) => g.id === k.waliKelasId)?.nama ?? "—"}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tingkat</TableHead>
                  <TableHead>Rombel</TableHead>
                  <TableHead>Wali Kelas</TableHead>
                  <TableHead>Jumlah Siswa</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kelas.map((k) => (
                  <TableRow key={k.id}>
                    <TableCell>{k.tingkat}</TableCell>
                    <TableCell className="font-medium">{k.nama}</TableCell>
                    <TableCell>{guru.find((g) => g.id === k.waliKelasId)?.nama ?? "—"}</TableCell>
                    <TableCell>{siswa.filter((s) => s.kelasId === k.id).length}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setForm(k)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          hapusKelas(k.id);
                          toast.success("Kelas dihapus.");
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
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
            <DialogTitle>{form?.id ? "Ubah Kelas" : "Tambah Kelas"}</DialogTitle>
            <DialogDescription>Tentukan tingkat, nama rombel, dan wali kelas.</DialogDescription>
          </DialogHeader>
          {form ? (
            <div className="grid gap-4">
              <div>
                <Label>Tingkat</Label>
                <Select value={form.tingkat} onValueChange={(v) => setForm({ ...form, tingkat: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["VII", "VIII", "IX", "X", "XI", "XII"].map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Nama Rombel</Label>
                <Input placeholder="mis. X-RPL 1" value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />
              </div>
              <div>
                <Label>Wali Kelas</Label>
                <Select value={form.waliKelasId} onValueChange={(v) => setForm({ ...form, waliKelasId: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {guru.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.nama}
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
