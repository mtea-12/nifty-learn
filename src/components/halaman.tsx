import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { izinkan } from "@/components/app-sidebar";
import { useApp } from "@/store/app-store";

export function JudulHalaman({
  judul,
  deskripsi,
  aksi,
}: {
  judul: string;
  deskripsi?: string;
  aksi?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{judul}</h1>
        {deskripsi ? <p className="mt-1 text-sm text-muted-foreground">{deskripsi}</p> : null}
      </div>
      {aksi ? <div className="flex flex-wrap gap-2">{aksi}</div> : null}
    </div>
  );
}

export function AksesDitolak() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <ShieldAlert className="h-7 w-7 text-destructive" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">Akses ditolak</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Peran yang sedang aktif tidak memiliki hak untuk membuka halaman ini. Ganti peran melalui pemilih peran di
        bagian atas.
      </p>
      <Button asChild className="mt-4">
        <Link to="/">Kembali ke Dasbor</Link>
      </Button>
    </div>
  );
}

export function Penjaga({ url, children }: { url: string; children: ReactNode }) {
  const { peran } = useApp();
  if (!izinkan(url, peran)) return <AksesDitolak />;
  return <>{children}</>;
}
