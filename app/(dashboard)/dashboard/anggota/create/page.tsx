import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { AnggotaFormModal } from "@/components/anggota/anggota-form-modal";

export const metadata: Metadata = { title: "Tambah Anggota", description: "Formulir tambah anggota" };
export const dynamic = "force-dynamic";

export default async function AnggotaCreatePage() {
  await requireUser();
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Tambah Anggota</h1>
        <p className="text-sm text-muted-foreground">Tambahkan anggota mahasiswa ke dalam sistem.</p>
      </div>

      <div>
        <AnggotaFormModal mode="create" trigger={null} />
      </div>
    </div>
  );
}
