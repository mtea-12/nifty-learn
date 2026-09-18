import type { Nilai } from "@/data/seed";

export type Bobot = { tugas: number; harian: number; pts: number; pas: number };

export const bobotDefault: Bobot = { tugas: 20, harian: 30, pts: 20, pas: 30 };

export function hitungNilaiAkhir(nilai: Nilai, bobot: Bobot = bobotDefault): number | null {
  const komponen: Array<[number | null, number]> = [
    [nilai.tugas, bobot.tugas],
    [nilai.harian, bobot.harian],
    [nilai.pts, bobot.pts],
    [nilai.pas, bobot.pas],
  ];
  if (komponen.some(([v]) => v === null || v === undefined)) return null;
  const total = komponen.reduce((acc, [v, b]) => acc + (v as number) * b, 0);
  const totalBobot = komponen.reduce((acc, [, b]) => acc + b, 0);
  if (totalBobot === 0) return null;
  return Math.round((total / totalBobot) * 10) / 10;
}

export function predikat(na: number | null): "A" | "B" | "C" | "D" | "-" {
  if (na === null) return "-";
  if (na >= 90) return "A";
  if (na >= 80) return "B";
  if (na >= 70) return "C";
  return "D";
}

export function deskripsiPredikat(p: string) {
  switch (p) {
    case "A":
      return "Sangat Baik";
    case "B":
      return "Baik";
    case "C":
      return "Cukup";
    case "D":
      return "Perlu Bimbingan";
    default:
      return "Belum Dinilai";
  }
}

export function tuntas(na: number | null, kkm: number) {
  if (na === null) return null;
  return na >= kkm;
}

export function warnaPredikat(p: string) {
  switch (p) {
    case "A":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "B":
      return "bg-sky-100 text-sky-700 border-sky-200";
    case "C":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "D":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}
