import type { AppRole } from "@/types/auth";

export type NavigationItem = {
  title: string;
  href: string;
  allowedRoles: AppRole[];
};

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    allowedRoles: ["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN", "MEMBER"],
  },
  {
    title: "UKM",
    href: "/dashboard/ukm",
    allowedRoles: ["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN"],
  },
  {
    title: "Anggota",
    href: "/dashboard/anggota",
    allowedRoles: ["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN"],
  },
  {
    title: "Kegiatan",
    href: "/dashboard/kegiatan",
    allowedRoles: ["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN", "MEMBER"],
  },
  {
    title: "Keuangan",
    href: "/dashboard/keuangan",
    allowedRoles: ["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN"],
  },
  {
    title: "Pengumuman",
    href: "/dashboard/pengumuman",
    allowedRoles: ["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN", "MEMBER"],
  },
];
