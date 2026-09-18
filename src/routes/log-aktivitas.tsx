import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JudulHalaman, Penjaga } from "@/components/halaman";
import { useApp } from "@/store/app-store";

export const Route = createFileRoute("/log-aktivitas")({
  head: () => ({
    meta: [
      { title: "Log Aktivitas — Nifty Grades Hub" },
      { name: "description", content: "Audit trail perubahan nilai dan data master beserta pelaku dan waktu." },
      { property: "og:title", content: "Log Aktivitas — Nifty Grades Hub" },
      { property: "og:description", content: "Audit trail perubahan nilai dan data master." },
    ],
  }),
  component: () => (
    <Penjaga url="/log-aktivitas">
      <HalamanLog />
    </Penjaga>
  ),
});

const labelPeran: Record<string, string> = { admin: "Admin", guru: "Guru", wali: "Wali Kelas", siswa: "Siswa" };

function HalamanLog() {
  const { log } = useApp();
  const [cari, setCari] = React.useState("");
  const [modul, setModul] = React.useState("semua");

  const daftarModul = Array.from(new Set(log.map((l) => l.modul)));
  const daftar = log
    .filter((l) => (modul === "semua" ? true : l.modul === modul))
    .filter((l) => `${l.keterangan} ${l.pelaku} ${l.aksi}`.toLowerCase().includes(cari.toLowerCase()));

  return (
    <div className="space-y-6">
      <JudulHalaman judul="Log Aktivitas" deskripsi="Catatan audit setiap perubahan nilai dan data master." />

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-wrap gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Cari aktivitas atau pelaku..." className="pl-9" value={cari} onChange={(e) => setCari(e.target.value)} />
            </div>
            <Select value={modul} onValueChange={setModul}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua Modul</SelectItem>
                {daftarModul.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Pelaku</TableHead>
                  <TableHead>Aksi</TableHead>
                  <TableHead>Modul</TableHead>
                  <TableHead>Keterangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {daftar.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="whitespace-nowrap text-xs">
                      {new Date(l.waktu).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="font-medium">{l.pelaku}</div>
                      <div className="text-xs text-muted-foreground">{labelPeran[l.peran] ?? l.peran}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{l.aksi}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{l.modul}</TableCell>
                    <TableCell className="text-sm">{l.keterangan}</TableCell>
                  </TableRow>
                ))}
                {daftar.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                      Belum ada aktivitas yang cocok.
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
