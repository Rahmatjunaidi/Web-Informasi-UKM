import { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getUkmById } from "@/lib/queries/ukm";
import { UkmFormModal } from "@/components/ukm/ukm-form-modal";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const ukm = await getUkmById(BigInt(id));
    if (!ukm) return { title: "UKM tidak ditemukan" };
    return { title: `Edit ${ukm.name}` };
  } catch {
    return { title: "Edit UKM" };
  }
}

export default async function UkmEditPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();

  const { id } = await params;

  let ukmId: bigint;
  try {
    ukmId = BigInt(id);
  } catch {
    return notFound();
  }

  const ukm = await getUkmById(ukmId);
  if (!ukm) return notFound();

  const ukmFormValue = {
    id: ukm.id.toString(),
    code: ukm.code,
    name: ukm.name,
    description: ukm.description,
    contactEmail: ukm.contactEmail,
    contactPhone: ukm.contactPhone,
    status: ukm.status as "ACTIVE" | "INACTIVE",
    establishedAt: ukm.establishedAt?.toISOString().split("T")[0] ?? "",
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Edit UKM</h1>
        <p className="text-sm text-muted-foreground">Ubah data UKM {ukm.name}.</p>
      </div>

      <div>
        <UkmFormModal mode="edit" ukm={ukmFormValue} defaultOpen={true} trigger={null} />
      </div>
    </div>
  );
}
