import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { UkmFormModal } from "@/components/ukm/ukm-form-modal";

export const metadata: Metadata = {
  title: "Tambah UKM",
  description: "Formulir untuk menambahkan UKM baru",
};

export const dynamic = "force-dynamic";

export default async function UkmCreatePage() {
  await requireUser();

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Tambah UKM</h1>
        <p className="text-sm text-muted-foreground">Tambahkan Unit Kegiatan Mahasiswa baru ke dalam sistem.</p>
      </div>

      <div>
        {/* Render modal opened by default; trigger null avoids duplicate button */}
        <UkmFormModal mode="create" defaultOpen={true} trigger={null} />
      </div>
    </div>
  );
}
