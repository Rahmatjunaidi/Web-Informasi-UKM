import { Metadata } from "next";
import Link from "next/link";
import { getUkmWithActivities, getUkmWithMembers, getUkmWithMembersCount } from "@/lib/queries/ukm";
import { GlassCard } from "@/components/ui/card";

export const dynamic = "force-dynamic";

type Props = { params: any };

export default async function UkmDetailPage({ params }: Props) {
  const { id } = await params;
  const ukmId = BigInt(id);

  const base = await getUkmWithMembersCount(ukmId);
  if (!base) {
    return (
      <div className="py-10 max-w-7xl mx-auto px-4">
        <GlassCard>
          <div className="p-8">UKM tidak ditemukan.</div>
        </GlassCard>
      </div>
    );
  }

  const membersRes = await getUkmWithMembers(ukmId, { limit: 50 });
  const activitiesRes = await getUkmWithActivities(ukmId, { limit: 10 });

  const ukm = {
    ...base,
    members: (membersRes as any)?.memberships ?? [],
    activities: (activitiesRes as any)?.activities ?? [],
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GlassCard>
            <div className="p-6">
              <h1 className="text-2xl font-bold">{ukm.name}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{ukm.description}</p>

              <div className="mt-6">
                <h3 className="font-medium">Kegiatan</h3>
                <ul className="mt-3 space-y-3">
                  {ukm.activities.map((a:any) => (
                    <li key={a.id.toString()} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{a.title}</div>
                        <div className="text-sm text-muted-foreground">{new Date(a.startsAt).toLocaleDateString()}</div>
                      </div>
                      <Link href={`/dashboard/kegiatan/${a.id}`} className="text-sm text-muted-foreground">Detail</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>

        <div>
          <GlassCard>
            <div className="p-6">
              <h3 className="font-medium">Informasi</h3>
              <div className="mt-2 text-sm text-muted-foreground">Anggota aktif: {ukm.memberCount}</div>
              <div className="mt-4">
                <h4 className="font-medium">Pengurus & Anggota</h4>
                <ul className="mt-2 space-y-2">
                  {ukm.members.map((m: any) => (
                    <li key={m.id.toString()} className="text-sm">{m.student?.name} • {m.position}</li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}