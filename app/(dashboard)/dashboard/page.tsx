import {
  Activity,
  Bell,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  Megaphone,
  Users,
} from "lucide-react";

import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { CardContent, CardDescription, CardHeader, CardTitle, GlassCard } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type StatItem = {
  title: string;
  value: number;
  description: string;
  icon: typeof GraduationCap;
  tone: string;
};

const monthFormatter = new Intl.DateTimeFormat("id-ID", { month: "short" });
const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const activityStatusLabels: Record<string, string> = {
  DRAFT: "Draft",
  SUBMITTED: "Diajukan",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
  ONGOING: "Berjalan",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const announcementStatusLabels: Record<string, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Terbit",
  ARCHIVED: "Arsip",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const dashboardData = await getDashboardData();

  const stats: StatItem[] = [
    {
      title: "Total UKM",
      value: dashboardData.totalUkms,
      description: "Unit kegiatan terdaftar",
      icon: GraduationCap,
      tone: "text-primary bg-primary/10",
    },
    {
      title: "Total Anggota",
      value: dashboardData.totalMembers,
      description: "Keanggotaan aktif",
      icon: Users,
      tone: "text-emerald-200 bg-emerald-900/10",
    },
    {
      title: "Total Kegiatan",
      value: dashboardData.totalActivities,
      description: "Seluruh kegiatan UKM",
      icon: CalendarDays,
      tone: "text-amber-200 bg-amber-900/10",
    },
    {
      title: "Total Pengumuman",
      value: dashboardData.totalAnnouncements,
      description: "Pengumuman tersimpan",
      icon: Megaphone,
      tone: "text-sky-200 bg-sky-900/10",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3">
        <div className="inline-flex w-fit items-center gap-2 rounded-md px-3 py-1 text-sm text-primary shadow-sm glass">
          <Activity className="size-4" />
        UKM UPJ — Lihat Informasi UKM — {user.role}
        </div>
        <div>
          <h1 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">Dashboard UKM</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Ringkasan data UKM, anggota, kegiatan, dan pengumuman langsung dari database.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <GlassCard className="overflow-hidden" key={stat.title}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className={cn("flex size-10 items-center justify-center rounded-md", stat.tone)}>
                    <Icon className="size-5" />
                  </div>
                  <span className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 glass-surface">
                    Live DB
                  </span>
                </div>
                <p className="mt-5 text-sm text-muted-foreground">{stat.title}</p>
                <p className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
                  {formatNumber(stat.value)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </GlassCard>
          );
        })}
      </section>

      <DashboardCharts
        activitiesByMonth={dashboardData.activitiesByMonth}
        membersByUkm={dashboardData.membersByUkm}
      />

      <section className="grid gap-6 xl:grid-cols-2">
        <GlassCard>
          <CardHeader className="border-b border-white/[0.12] text-white glass-surface">
            <div className="flex items-center gap-2">
              <ClipboardList className="size-5 text-primary" />
              <div>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Kegiatan terbaru berdasarkan data terakhir dibuat.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/60">
              {dashboardData.recentActivities.length > 0 ? (
                dashboardData.recentActivities.map((activity) => (
                  <div className="flex items-start justify-between gap-4 p-5" key={activity.id}>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-950">{activity.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {activity.ukmName} - {dateFormatter.format(activity.startsAt)}
                      </p>
                    </div>
                    <StatusBadge status={activity.statusLabel} variant="activity" />
                  </div>
                ))
              ) : (
                <EmptyState label="Belum ada kegiatan di database." />
              )}
            </div>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader className="border-b border-white/[0.12] text-white glass-surface">
            <div className="flex items-center gap-2">
              <Bell className="size-5 text-primary" />
              <div>
                <CardTitle>Recent Announcements</CardTitle>
                <CardDescription>Pengumuman terbaru untuk seluruh role dan UKM.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/60">
              {dashboardData.recentAnnouncements.length > 0 ? (
                dashboardData.recentAnnouncements.map((announcement) => (
                  <div className="flex items-start justify-between gap-4 p-5" key={announcement.id}>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-950">{announcement.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {announcement.ukmName} - {announcement.content}
                      </p>
                    </div>
                    <StatusBadge status={announcement.statusLabel} variant="announcement" />
                  </div>
                ))
              ) : (
                <EmptyState label="Belum ada pengumuman di database." />
              )}
            </div>
          </CardContent>
        </GlassCard>
      </section>
    </div>
  );
}

async function getDashboardData() {
  const startMonth = getStartMonth();

  const [
    totalUkms,
    totalMembers,
    totalActivities,
    totalAnnouncements,
    activitiesForChart,
    ukmsWithMembers,
    recentActivities,
    recentAnnouncements,
  ] = await Promise.all([
    prisma.ukm.count(),
    prisma.ukmMembership.count({ where: { status: "ACTIVE" } }),
    prisma.activity.count(),
    prisma.announcement.count(),
    prisma.activity.findMany({
      select: { startsAt: true },
      where: { startsAt: { gte: startMonth } },
    }),
    prisma.ukm.findMany({
      select: {
        name: true,
        _count: {
          select: {
            memberships: { where: { status: "ACTIVE" } },
          },
        },
      },
    }),
    prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        startsAt: true,
        status: true,
        title: true,
        ukm: { select: { name: true } },
      },
      take: 5,
    }),
    prisma.announcement.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        status: true,
        title: true,
        ukm: { select: { name: true } },
      },
      take: 5,
    }),
  ]);

  return {
    totalUkms,
    totalMembers,
    totalActivities,
    totalAnnouncements,
    activitiesByMonth: buildMonthlyActivityData(activitiesForChart.map((item) => item.startsAt)),
    membersByUkm: ukmsWithMembers
      .map((ukm) => ({
        name: ukm.name,
        total: ukm._count.memberships,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8),
    recentActivities: recentActivities.map((activity) => ({
      id: activity.id.toString(),
      startsAt: activity.startsAt,
      statusLabel: activityStatusLabels[activity.status] ?? activity.status,
      title: activity.title,
      ukmName: activity.ukm.name,
    })),
    recentAnnouncements: recentAnnouncements.map((announcement) => ({
      id: announcement.id.toString(),
      content: announcement.content,
      statusLabel: announcementStatusLabels[announcement.status] ?? announcement.status,
      title: announcement.title,
      ukmName: announcement.ukm?.name ?? "Global",
    })),
  };
}

function getStartMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - 11, 1);
}

function buildMonthlyActivityData(activityDates: Date[]) {
  const start = getStartMonth();
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth() + index, 1);
    return {
      key: getMonthKey(date),
      month: monthFormatter.format(date),
      total: 0,
    };
  });

  const totals = new Map(months.map((month) => [month.key, month.total]));

  activityDates.forEach((date) => {
    const key = getMonthKey(date);
    totals.set(key, (totals.get(key) ?? 0) + 1);
  });

  return months.map((month) => ({
    month: month.month,
    total: totals.get(month.key) ?? 0,
  }));
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function StatusBadge({ status, variant }: { status: string; variant: "activity" | "announcement" }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center rounded-md border px-2.5 text-xs font-medium",
        variant === "activity" && status === "Disetujui" && "border-emerald-300 bg-emerald-900/10 text-emerald-200",
        variant === "activity" && status === "Berjalan" && "border-sky-300 bg-sky-900/10 text-sky-200",
        variant === "activity" && status === "Selesai" && "border-white/[0.12] glass-surface text-white",
        variant === "announcement" && status === "Terbit" && "border-emerald-300 bg-emerald-900/10 text-emerald-200",
        (status === "Draft" || status === "Diajukan") && "border-amber-300 bg-amber-900/10 text-amber-200",
        (status === "Ditolak" || status === "Dibatalkan" || status === "Arsip") &&
          "border-rose-300 bg-rose-900/10 text-rose-200",
      )}
    >
      {status}
    </span>
  );
}

function EmptyState({ label }: { label: string }) {
  return <p className="p-5 text-sm text-muted-foreground">{label}</p>;
}
