import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React from "react";

export const metadata: Metadata = { title: "UKM UPJ - Beranda" };
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch stats
  const [ukmCount, activityCount, announcementCount] = await Promise.all([
    prisma.ukm.count(),
    prisma.activity.count(),
    prisma.announcement.count(),
  ]);

  // Featured UKM (editable via Website Management) and other website-managed content
  const websiteSettings = await (await import("@/lib/queries/website")).getWebsiteSettings();
  let featured = [];
  try {
    const ids = JSON.parse(websiteSettings["featured_ukm_ids"] ?? "[]");
    if (Array.isArray(ids) && ids.length > 0) {
      featured = await prisma.ukm.findMany({ where: { id: { in: ids.map((i:any) => BigInt(i)) } }, select: { id: true, name: true, description: true, logoUrl: true } });
    } else {
      featured = await prisma.ukm.findMany({ select: { id: true, name: true, description: true, logoUrl: true }, orderBy: { createdAt: "desc" }, take: 6 });
    }
  } catch (e) {
    featured = await prisma.ukm.findMany({ select: { id: true, name: true, description: true, logoUrl: true }, orderBy: { createdAt: "desc" }, take: 6 });
  }

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
    <div className="min-h-[70vh] py-10 relative overflow-hidden">
      {/* Floating gradient orbs */}
      <div className="pointer-events-none">
        <div className="floating-orb" style={{ width: 300, height: 300, left: -60, top: -40, background: "linear-gradient(135deg, rgba(79,70,229,0.6), rgba(59,130,246,0.5))" }} />
        <div className="floating-orb" style={{ width: 220, height: 220, right: -40, bottom: -60, background: "linear-gradient(135deg, rgba(6,182,212,0.45), rgba(59,130,246,0.2))", animationDelay: "2s" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Hero */}
        <section className="grid gap-6 lg:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{(websiteSettings["hero_title"] ?? "Kembangkan Potensimu\n              Bersama UKM UPJ").split('\n').map((line, i) => (<React.Fragment key={i}>{line}<br /></React.Fragment>))}</h1>
            <p className="mt-4 text-lg text-slate-200/80">{websiteSettings["hero_description"] ?? "Temukan komunitas terbaik untuk mengembangkan bakat, prestasi, kepemimpinan, dan pengalaman organisasi di Universitas Pembangunan Jaya."}</p>
            <div className="mt-6 flex gap-3">
              <Link href="/ukm" className="btn-glass">Lihat UKM</Link>
              <a
  href="https://forms.gle/55Uym6cKSgSttYn5A"
  target="_blank"
  rel="noopener noreferrer"
  className="btn-glass"
>
  Daftar Sekarang
</a>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <GlassCard>
                <CardContent>
                  <div className="text-sm text-slate-200/80">Total UKM</div>
                  <div className="text-2xl font-semibold">{ukmCount}</div>
                </CardContent>
              </GlassCard>

              <GlassCard>
                <CardContent>
                  <div className="text-sm text-slate-200/80">Total Kegiatan</div>
                  <div className="text-2xl font-semibold">{activityCount}</div>
                </CardContent>
              </GlassCard>

              <GlassCard>
                <CardContent>
                  <div className="text-sm text-slate-200/80">Pengumuman</div>
                  <div className="text-2xl font-semibold">{announcementCount}</div>
                </CardContent>
              </GlassCard>
            </div>
          </div>

          <div>
            <div className="glass p-6 rounded-3xl">
              <div className="mb-6">
                <h3 className="text-lg font-semibold">UKM Unggulan</h3>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1 w-16 rounded-full bg-cyan-400"></div>
                  <div className="h-1 w-8 rounded-full bg-blue-500"></div>
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                {featured.map((u) => (
                  <Link key={u.id.toString()} href={`/ukm/${u.id}`} className="block p-3 rounded-md glass-hover">
                    <div className="font-medium">{u.name}</div>
                    <p className="text-sm text-slate-200/80 line-clamp-2">{u.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <GlassCard>
                <CardHeader>
                  <CardTitle>Kegiatan Terbaru</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-16 rounded-full bg-cyan-400"></div>
                    <div className="h-1 w-8 rounded-full bg-blue-500"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {activities.map((a) => (
                      <li key={a.id.toString()} className="flex items-start justify-between">
                        <div>
                          <div className="font-medium">{a.title}</div>
                          <div className="text-sm text-slate-200/80">{a.ukm?.name}</div>
                        </div>
                        <div className="text-xs text-slate-200/80">{new Date(a.startsAt).toLocaleDateString()}</div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </GlassCard>

              <GlassCard className="mt-4">
                <CardHeader>
                  <CardTitle>Pengumuman Terbaru</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-16 rounded-full bg-cyan-400"></div>
                    <div className="h-1 w-8 rounded-full bg-blue-500"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {announcements.map((n) => (
                      <li key={n.id.toString()}>
                        <Link href={`/dashboard/pengumuman/${n.id}`} className="block">
                          <div className="font-medium">{n.title}</div>
                          <p className="text-sm text-slate-200/80 line-clamp-2">{n.content}</p>
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
