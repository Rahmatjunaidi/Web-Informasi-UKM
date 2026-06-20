import { notFound } from "next/navigation";
import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { getActivityById } from "@/lib/queries/kegiatan";
import { GlassCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KegiatanFormModal } from "@/components/kegiatan/kegiatan-form-modal";
import { DeleteKegiatanDialog } from "@/components/kegiatan/delete-kegiatan-dialog";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
const data = await getActivityById(BigInt(id));
    if (!data) return { title: "Kegiatan Tidak Ditemukan" };
    return { title: `${data.title} - Detail Kegiatan` };
  } catch {
    return { title: "Detail Kegiatan" };
  }
}

export default async function KegiatanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  let activityId: bigint;
  try { activityId = BigInt(id); } catch { return notFound(); }

  const activity = await getActivityById(activityId);
  if (!activity) return notFound();

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">{activity.title}</h1>
        <p className="text-sm text-muted-foreground">
  {formatDate(activity.startsAt, true)}
</p>
      </div>

      <GlassCard>
        <CardHeader><CardTitle>Informasi Kegiatan</CardTitle></CardHeader>
        <CardContent>
          <p>{activity.description ?? '-'}</p>
          <p className="mt-2">Lokasi: {activity.location ?? '-'}</p>
          <p className="mt-2">Tanggal: {formatDate(activity.startsAt, true)} - {activity.endsAt ? formatDate(activity.endsAt, true) : '-'}</p>
          <p className="mt-2">Budget: {activity.budgetAmount.toString()}</p>

          <div className="mt-4 flex gap-2">
            <KegiatanFormModal mode="edit" activity={{ id: activity.id.toString(), ukmId: activity.ukmId?.toString() ?? '', title: activity.title, description: activity.description ?? '', location: activity.location ?? '', startsAt: activity.startsAt.toISOString(), endsAt: activity.endsAt?.toISOString() ?? '', budgetAmount: activity.budgetAmount.toString(), status: activity.status }} trigger={<button className="btn">Edit</button>} />
            <DeleteKegiatanDialog id={activity.id.toString()} name={activity.title} trigger={<button className="btn">Hapus</button>} />
          </div>
        </CardContent>
      </GlassCard>
    </div>
  );
}
