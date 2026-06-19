import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "UKM Portal - Beranda" };
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch stats
  const [ukmCount, activityCount, announcementCount] = await Promise.all([
    prisma.ukm.count(),
    prisma.activity.count(),
    prisma.announcement.count(),
  ]);

  // Featured UKM (latest 6)
  const featured = await prisma.ukm.findMany({
    select: { id: true, name: true, description: true, logoUrl: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  // Latest activities
  const activities = await prisma.activity.findMany({
    select: { id: true, title: true, startsAt: true, ukm: { select: { name: true } } },
    orderBy: { startsAt: "desc" },
    take: 6,
  });

  // Latest announcements
  const announcements = await prisma.announcement.findMany({
    select: { id: true, title: true, content: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  return (
    <div className="min-h-[70vh] py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Hero */}
        <section className="grid gap-6 lg:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Kembangkan Potensimu Bersama UKM Universitas</h1>
            <p className="mt-4 text-lg text-muted-foreground">Temukan komunitas terbaik untuk mengembangkan bakat, prestasi, dan pengalaman organisasi.</p>
            <div className="mt-6 flex gap-3">
              <Link href="/ukm" className="btn btn-primary">Lihat UKM</Link>
              <Link href="/register" className="btn btn-outline">Daftar Sekarang</Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              <GlassCard>
                <CardContent>
                  <div className="text-sm text-muted-foreground">Total UKM</div>
                  <div className="text-2xl font-semibold">{ukmCount}</div>
                </CardContent>
              </GlassCard>

              <GlassCard>
                <CardContent>
                  <div className="text-sm text-muted-foreground">Total Kegiatan</div>
                  <div className="text-2xl font-semibold">{activityCount}</div>
                </CardContent>
              </GlassCard>

              <GlassCard>
                <CardContent>
                  <div className="text-sm text-muted-foreground">Pengumuman</div>
                  <div className="text-2xl font-semibold">{announcementCount}</div>
                </CardContent>
              </GlassCard>
            </div>
          </div>

          <div>
            <div className="glass p-6 rounded-3xl">
              <h3 className="text-lg font-semibold">UKM Unggulan</h3>
              <div className="mt-4 grid gap-3">
                {featured.map((u) => (
                  <Link key={u.id.toString()} href={`/ukm/${u.id}`} className="block p-3 rounded-md hover:bg-white/5">
                    <div className="font-medium">{u.name}</div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{u.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <GlassCard>
                <CardHeader>
                  <CardTitle>Kegiatan Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {activities.map((a) => (
                      <li key={a.id.toString()} className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">{a.title}</div>
                          <div className="text-sm text-muted-foreground">{a.ukm?.name}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">{new Date(a.startsAt).toLocaleDateString()}</div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </GlassCard>

              <GlassCard className="mt-4">
                <CardHeader>
                  <CardTitle>Pengumuman Terbaru</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {announcements.map((n) => (
                      <li key={n.id.toString()}>
                        <Link href={`/dashboard/pengumuman/${n.id}`} className="block">
                          <div className="font-medium">{n.title}</div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{n.content}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </GlassCard>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
