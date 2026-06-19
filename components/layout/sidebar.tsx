"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Banknote,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  PanelLeft,
  ShieldCheck,
  Users,
} from "lucide-react";

import { navigationItems } from "@/config/navigation";
import { cn } from "@/lib/utils";
import type { AppRole } from "@/types/auth";

const navIcons = {
  "/dashboard": LayoutDashboard,
  "/dashboard/ukm": GraduationCap,
  "/dashboard/anggota": Users,
  "/dashboard/kegiatan": CalendarDays,
  "/dashboard/keuangan": Banknote,
  "/dashboard/pengumuman": Megaphone,
};

type SidebarProps = {
  role: AppRole;
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = navigationItems.filter((item) => item.allowedRoles.includes(role));

  return (
    <>
      <aside className="glass-panel fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] w-72 flex-col rounded-lg p-3 lg:flex">
        <SidebarBrand />
        <nav className="mt-7 space-y-1">
          {items.map((item) => {
            const Icon = navIcons[item.href as keyof typeof navIcons] ?? ShieldCheck;
            const active =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                className={cn(
                  "group flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-slate-500 transition-all hover:bg-white/70 hover:text-slate-950",
                  active && "bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:bg-primary hover:text-primary-foreground",
                )}
                href={item.href}
                key={item.href}
              >
                <Icon className="size-4 transition-transform group-hover:scale-105" />
                {item.title}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-md border border-white/50 bg-white/60 p-3 text-xs text-muted-foreground shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-foreground">
            <PanelLeft className="size-4 text-primary" />
            <p className="font-medium">Academic Workspace</p>
          </div>
          <p className="leading-5">Kelola organisasi, kegiatan, anggota, dan laporan UKM dalam satu dashboard.</p>
        </div>
      </aside>

      <div className="glass-panel sticky top-0 z-40 flex gap-2 overflow-x-auto rounded-none border-x-0 border-t-0 px-3 py-3 lg:hidden">
        {items.map((item) => {
          const Icon = navIcons[item.href as keyof typeof navIcons] ?? ShieldCheck;
          const active =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              className={cn(
                "flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-slate-500",
                active && "bg-primary text-primary-foreground shadow-sm",
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className="size-4" />
              {item.title}
            </Link>
          );
        })}
      </div>
    </>
  );
}

function SidebarBrand() {
  return (
    <div className="flex items-center gap-3 rounded-md border border-white/50 bg-white/60 p-3 shadow-sm">
      <div className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm shadow-primary/25">
        <GraduationCap className="size-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-950">SI UKM</p>
        <p className="text-xs text-muted-foreground">Modern Academic SaaS</p>
      </div>
    </div>
  );
}
