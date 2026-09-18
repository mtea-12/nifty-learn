import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { bobotDefault } from "@/lib/penilaian";

export const Route = createFileRoute("/tahun-ajaran")({
  head: () => ({
    meta: [
      { title: "Tahun Ajaran & Semester — SMK Muhammadiyah 1 Paguyangan" },
      { name: "description", content: "Pengaturan tahun akademik aktif, semester Ganjil/Genap, dan bobot penilaian." },
      { property: "og:title", content: "Tahun Ajaran & Semester — SMK Muhammadiyah 1 Paguyangan" },
      { property: "og:description", content: "Pengaturan tahun akademik aktif dan bobot penilaian." },
    ],
  }),
  component: () => (
    <Penjaga url="/tahun-ajaran">
      <HalamanTahun />
    </Penjaga>
  ),
});

function HalamanTahun() {
  const { tahunAjaran, aktifkanTahun, simpanTahun, bobot, setBobot } = useApp();
  const [buka, setBuka] = React.useState(false);
  const [tahun, setTahun] = React.useState("2026/2027");
  const [semester, setSemester] = React.useState<"Ganjil" | "Genap">("Ganjil");
  const [draftBobot, setDraftBobot] = React.useState(bobot);

  const totalBobot = draftBobot.tugas + draftBobot.harian + draftBobot.pts + draftBobot.pas;

  return (
    <div className="space-y-6">
      <JudulHalaman
        judul="Tahun Ajaran & Semester"
        deskripsi="Atur tahun akademik yang berlaku serta bobot komponen penilaian."
        aksi={
          <Button onClick={() => setBuka(true)}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Tahun Ajaran
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Daftar Tahun Ajaran</CardTitle>
          <CardDescription>Hanya satu periode yang dapat aktif pada satu waktu.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tahun Ajaran</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tahunAjaran.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.tahun}</TableCell>
                    <TableCell>{t.semester}</TableCell>
                    <TableCell>
                      {t.aktif ? (
                        <Badge className="gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Aktif
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Tidak Aktif</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={t.aktif}
                        onClick={() => {
                          aktifkanTahun(t.id);
                          toast.success(`Tahun ajaran ${t.tahun} ${t.semester} diaktifkan.`);
                        }}
                      >
                        Aktifkan
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bobot Penilaian</CardTitle>
          <CardDescription>Digunakan untuk menghitung nilai akhir otomatis. Total harus 100%.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-4">
            {(
              [
                ["tugas", "Tugas"],
                ["harian", "Ulangan Harian"],
                ["pts", "PTS / STS"],
                ["pas", "PAS / SAS"],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <Label>{label} (%)</Label>
                <Input
                  type="number"
                  value={draftBobot[key]}
                  onChange={(e) => setDraftBobot({ ...draftBobot, [key]: Number(e.target.value) })}
                />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={totalBobot === 100 ? "default" : "destructive"}>Total: {totalBobot}%</Badge>
            <Button
              onClick={() => {
                if (totalBobot !== 100) {
                  toast.error("Total bobot harus 100%.");
                  return;
                }
                setBobot(draftBobot);
                toast.success("Bobot penilaian diperbarui.");
              }}
            >
              Simpan Bobot
            </Button>
            <Button variant="outline" onClick={() => setDraftBobot(bobotDefault)}>
              Bobot Standar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={buka} onOpenChange={setBuka}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Tahun Ajaran</DialogTitle>
            <DialogDescription>Contoh format tahun: 2026/2027.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label>Tahun Ajaran</Label>
              <Input value={tahun} onChange={(e) => setTahun(e.target.value)} />
            </div>
            <div>
              <Label>Semester</Label>
              <Select value={semester} onValueChange={(v) => setSemester(v as "Ganjil" | "Genap")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ganjil">Ganjil</SelectItem>
                  <SelectItem value="Genap">Genap</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBuka(false)}>
              Batal
            </Button>
            <Button
              onClick={() => {
                simpanTahun({ id: `ta${Date.now()}`, tahun, semester, aktif: false });
                toast.success("Tahun ajaran ditambahkan.");
                setBuka(false);
              }}
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
