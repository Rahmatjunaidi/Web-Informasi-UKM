import { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getActivityById } from "@/lib/queries/kegiatan";
import { KegiatanFormModal } from "@/components/kegiatan/kegiatan-form-modal";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const data = await getActivityById(BigInt(params.id));
    if (!data) return { title: "Kegiatan tidak ditemukan" };
    return { title: `Edit ${data.title}` };
  } catch {
    return { title: "Edit Kegiatan" };
  }
}

export default async function KegiatanEditPage({ params }: { params: { id: string } }) {
  await requireUser();
  const { id } = params;
  let activityId: BigInt;
  try { activityId = BigInt(id); } catch { return notFound(); }

  const a = await getActivityById(activityId);
  if (!a) return notFound();

  const formValue = { id: a.id.toString(), ukmId: a.ukmId?.toString() ?? '', title: a.title, description: a.description ?? '', location: a.location ?? '', startsAt: a.startsAt.toISOString(), endsAt: a.endsAt?.toISOString() ?? '', budgetAmount: a.budgetAmount.toString(), status: a.status };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Edit Kegiatan</h1>
        <p className="text-sm text-muted-foreground">Ubah data kegiatan.</p>
      </div>

      <div>
        <KegiatanFormModal mode="edit" activity={formValue} trigger={null} />
      </div>
    </div>
  );
}
