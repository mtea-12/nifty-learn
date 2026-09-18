import { CalendarCheck, RotateCcw } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApp } from "@/store/app-store";
import { NAMA_SEKOLAH, type Peran } from "@/data/seed";

const labelPeran: Record<Peran, string> = {
  admin: "Admin",
  guru: "Guru",
  wali: "Wali Kelas",
  siswa: "Siswa",
};

export function Topbar() {
  const app = useApp();
  const { peran, setPeran, guru, siswa, kelas, tahunAktif, setState, resetData, namaPengguna } = app;

  const waliIds = new Set(kelas.map((k) => k.waliKelasId));

  return (
    <header className="tanpa-cetak sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b bg-card px-4 py-2.5">
      <SidebarTrigger />
      <div className="mr-auto min-w-0">
        <p className="truncate text-sm font-semibold">{NAMA_SEKOLAH}</p>
        <p className="truncate text-xs text-muted-foreground">Sistem Informasi Nilai & Rapor</p>
      </div>

      <Badge variant="outline" className="gap-1.5 border-primary/30 bg-primary/5 text-primary">
        <CalendarCheck className="h-3.5 w-3.5" />
        {tahunAktif?.tahun} · {tahunAktif?.semester}
      </Badge>

      <Select value={peran} onValueChange={(v) => setPeran(v as Peran)}>
        <SelectTrigger className="w-[140px]" aria-label="Pilih peran">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(labelPeran) as Peran[]).map((p) => (
            <SelectItem key={p} value={p}>
              {labelPeran[p]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {peran === "guru" ? (
        <Select value={app.guruAktifId} onValueChange={(v) => setState((s) => ({ ...s, guruAktifId: v }))}>
          <SelectTrigger className="w-[220px]" aria-label="Pilih guru">
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
      ) : null}

      {peran === "wali" ? (
        <Select value={app.waliAktifId} onValueChange={(v) => setState((s) => ({ ...s, waliAktifId: v }))}>
          <SelectTrigger className="w-[220px]" aria-label="Pilih wali kelas">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {guru
              .filter((g) => waliIds.has(g.id))
              .map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.nama}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      ) : null}

      {peran === "siswa" ? (
        <Select value={app.siswaAktifId} onValueChange={(v) => setState((s) => ({ ...s, siswaAktifId: v }))}>
          <SelectTrigger className="w-[220px]" aria-label="Pilih siswa">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {siswa.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.nama} — {kelas.find((k) => k.id === s.kelasId)?.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : null}

      <div className="hidden text-right lg:block">
        <p className="text-xs font-medium leading-tight">{namaPengguna}</p>
        <p className="text-[11px] leading-tight text-muted-foreground">{labelPeran[peran]}</p>
      </div>

      <Button variant="ghost" size="icon" title="Kembalikan data contoh" onClick={resetData}>
        <RotateCcw className="h-4 w-4" />
      </Button>
    </header>
  );
}
