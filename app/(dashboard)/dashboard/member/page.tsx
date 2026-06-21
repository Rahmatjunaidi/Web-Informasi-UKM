import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { GlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Users, CalendarDays, Megaphone, Flag } from "lucide-react";

export const metadata: Metadata = { title: "Member Dashboard" };
export const dynamic = "force-dynamic";

export default async function MemberDashboardPage() {
  const user = await requireUser();

  // find student record linked to current user (if exists)
  const student = await prisma.student.findFirst({
    where: { userId: BigInt(user.id) },
    include: { memberships: { include: { ukm: true } } },
  });

  // prepare ukm list
  const ukms = student?.memberships?.map((m: any) => ({ id: m.ukm.id.toString(), name: m.ukm.name, position: m.position ?? "Anggota", status: m.status })) ?? [];

  // upcoming activities for user's ukms
  const ukmIds = ukms.map((u:any)=>BigInt(u.id));
  const now = new Date();
  const upcoming = ukmIds.length
    ? await prisma.activity.findMany({ where: { ukmId: { in: ukmIds }, startsAt: { gte: now } }, orderBy: { startsAt: "asc" }, take: 6, include: { ukm: { select: { name: true } } } })
    : [];

  // recent announcements (global + user's ukms)
  const annWhere: any = {};
  if (ukmIds.length) {
    annWhere.OR = [{ ukmId: { in: ukmIds } }, { ukmId: null }];
  }
  const announcements = await prisma.announcement.findMany({ where: annWhere, orderBy: { createdAt: "desc" }, take: 6 });

  // KPI values
  const kpiUkms = ukms.length;
  const kpiActivities = ukmIds.length ? await prisma.activity.count({ where: { ukmId: { in: ukmIds } } }) : 0;
  const kpiAnnouncements = announcements.length;

  // attendance percent not always available in schema; show N/A when cannot compute
  let attendancePercent: number | string = "N/A";
  if (student && typeof (prisma as any).attendance !== "undefined" && typeof (prisma as any).attendance.count === "function") {
    try {
      const totalPast = await prisma.activity.count({ where: { ukmId: { in: ukmIds }, endsAt: { lt: now } } });
      const attended = await (prisma as any).attendance.count({ where: { studentId: BigInt(student.id) } });
      attendancePercent = totalPast > 0 ? Math.round((attended / totalPast) * 100) : 0;
    } catch (e) {
      attendancePercent = "N/A";
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="glass p-6 rounded-3xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Halo, {user.name ?? "Pengguna"} 👋</h2>
            <p className="text-sm text-muted-foreground">Selamat datang di Member Dashboard. Kelola aktivitas dan lihat ringkasan keanggotaanmu.</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-br from-primary to-emerald-400 p-1">
              <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-semibold glass">{(user.name || "?").split(" ")[0].slice(0,1).toUpperCase()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status Keanggotaan</div>
                <div className="font-medium">{student ? student.memberships?.[0]?.status ?? "Anggota" : "Belum terdaftar"}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Link href="/dashboard/anggota" className="btn">Kelola Profil</Link>
            <Link href="/dashboard/ukm" className="btn btn-outline">Lihat UKM</Link>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard>
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-primary to-indigo-400 p-3 text-white"><Users className="size-4" /></div>
                <div>
                  <div className="text-sm text-muted-foreground">UKM Saya</div>
                  <div className="text-xl font-semibold">{kpiUkms}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 p-3 text-white"><CalendarDays className="size-4" /></div>
                <div>
                  <div className="text-sm text-muted-foreground">Jumlah Kegiatan</div>
                  <div className="text-xl font-semibold">{kpiActivities}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-sky-400 to-sky-600 p-3 text-white"><Megaphone className="size-4" /></div>
                <div>
                  <div className="text-sm text-muted-foreground">Pengumuman Aktif</div>
                  <div className="text-xl font-semibold">{kpiAnnouncements}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardContent>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 p-3 text-white"><Flag className="size-4" /></div>
                <div>
                  <div className="text-sm text-muted-foreground">Persentase Kehadiran</div>
                  <div className="text-xl font-semibold">{typeof attendancePercent === 'number' ? `${attendancePercent}%` : attendancePercent}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </GlassCard>
      </section>

      {/* UKM Saya + Kegiatan + Pengumuman */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <GlassCard>
            <CardHeader>
              <CardTitle>UKM Saya</CardTitle>
            </CardHeader>
            <CardContent>
              {ukms.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum menjadi anggota UKM.</p>
              ) : (
                <ul className="space-y-3">
                  {ukms.map((u:any) => (
                    <li key={u.id} className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-semibold glass">{u.name.charAt(0)}</div>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-sm text-muted-foreground">{u.position} • {u.status}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </GlassCard>

          <div className="mt-4">
            <GlassCard>
              <CardHeader>
                <CardTitle>Progress Anggota</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm"><span>Kehadiran</span><span className="font-medium">{typeof attendancePercent === 'number' ? `${attendancePercent}%` : "N/A"}</span></div>
                    <div className="h-2 w-full glass-surface rounded-full mt-2 overflow-hidden">
                      <div style={{ width: typeof attendancePercent === 'number' ? `${attendancePercent}%` : '0%' }} className="h-2 bg-emerald-500" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm"><span>Kontribusi</span><span className="font-medium">42%</span></div>
                    <div className="h-2 w-full glass-surface rounded-full mt-2 overflow-hidden">
                      <div style={{ width: '42%' }} className="h-2 bg-indigo-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </GlassCard>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <GlassCard>
            <CardHeader>
              <CardTitle>Kegiatan Mendatang</CardTitle>
            </CardHeader>
            <CardContent>
              {upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tidak ada kegiatan mendatang.</p>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((act:any) => (
                    <div key={act.id.toString()} className="flex items-start gap-4">
                      <div className="text-xs text-muted-foreground">{new Date(act.startsAt).toLocaleDateString('id-ID',{day:'2-digit',month:'short'})}</div>
                      <div>
                        <div className="font-medium">{act.title}</div>
                        <div className="text-sm text-muted-foreground">{act.ukm?.name} • {new Date(act.startsAt).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'})}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </GlassCard>

          <GlassCard>
            <CardHeader>
              <CardTitle>Pengumuman Terbaru</CardTitle>
              <div className="flex items-center gap-2">
                <div className="h-1 w-16 rounded-full bg-cyan-400"></div>
                <div className="h-1 w-8 rounded-full bg-blue-500"></div>
              </div>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <p className="text-sm text-muted-foreground">Belum ada pengumuman.</p>
              ) : (
                <div className="space-y-3">
                  {announcements.map((a:any) => (
                    <Link key={a.id.toString()} href={`/dashboard/pengumuman/${a.id}`} className="block rounded-md p-3 glass-hover">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{a.title}</div>
                        <div className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleDateString('id-ID',{day:'2-digit',month:'short'})}</div>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{a.content}</p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
