import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { KegiatanFormModal } from "@/components/kegiatan/kegiatan-form-modal";

export const metadata: Metadata = { title: "Tambah Kegiatan", description: "Formulir tambah kegiatan" };
export const dynamic = "force-dynamic";

export default async function KegiatanCreatePage() {
  await requireUser();
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Tambah Kegiatan</h1>
        <p className="text-sm text-muted-foreground">Tambahkan kegiatan UKM baru.</p>
      </div>

      <div>
        <KegiatanFormModal mode="create" trigger={null} />
      </div>
    </div>
  );
}
