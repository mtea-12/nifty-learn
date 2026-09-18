import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  BookOpen,
  CalendarRange,
  ClipboardEdit,
  BarChart3,
  FileText,
  History,
  BookMarked,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useApp } from "@/store/app-store";
import type { Peran } from "@/data/seed";

type Item = { title: string; url: string; icon: typeof Users; peran: Peran[] };

export const menuUtama: Item[] = [
  { title: "Dasbor", url: "/", icon: LayoutDashboard, peran: ["admin", "guru", "wali", "siswa"] },
];

export const menuMaster: Item[] = [
  { title: "Guru & Tendik", url: "/guru", icon: Users, peran: ["admin"] },
  { title: "Siswa", url: "/siswa", icon: GraduationCap, peran: ["admin", "wali"] },
  { title: "Kelas", url: "/kelas", icon: School, peran: ["admin", "wali"] },
  { title: "Mata Pelajaran", url: "/mata-pelajaran", icon: BookOpen, peran: ["admin", "guru", "wali"] },
  { title: "Tahun Ajaran", url: "/tahun-ajaran", icon: CalendarRange, peran: ["admin"] },
];

export const menuAkademik: Item[] = [
  { title: "Input Nilai", url: "/input-nilai", icon: ClipboardEdit, peran: ["admin", "guru", "wali"] },
  { title: "Rekap & Analisis", url: "/rekap-nilai", icon: BarChart3, peran: ["admin", "guru", "wali", "siswa"] },
  { title: "Cetak Rapor", url: "/rapor", icon: FileText, peran: ["admin", "wali", "siswa"] },
  { title: "Log Aktivitas", url: "/log-aktivitas", icon: History, peran: ["admin"] },
];

export function izinkan(url: string, peran: Peran) {
  const semua = [...menuUtama, ...menuMaster, ...menuAkademik];
  const item = semua.find((i) => i.url === url);
  return !item || item.peran.includes(peran);
}

export function AppSidebar() {
  const { peran } = useApp();
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  const grup = [
    { label: "Utama", items: menuUtama },
    { label: "Data Master", items: menuMaster },
    { label: "Akademik", items: menuAkademik },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <img src={logoSekolah} alt="Logo SMK Muhammadiyah 1 Paguyangan" className="h-9 w-9 shrink-0 rounded-lg bg-white object-contain p-0.5" />
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold text-sidebar-foreground">Nifty Grades Hub</p>
            <p className="truncate text-xs text-sidebar-foreground/60">Sistem Nilai & Rapor</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {grup.map((g) => {
          const items = g.items.filter((i) => i.peran.includes(peran));
          if (items.length === 0) return null;
          return (
            <SidebarGroup key={g.label}>
              <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={currentPath === item.url} tooltip={item.title}>
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
