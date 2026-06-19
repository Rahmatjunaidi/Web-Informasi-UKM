import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import Link from "next/link";
import { createAnnouncementAction } from "../actions";
import { GlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Tambah Pengumuman - Dashboard" };
export const dynamic = "force-dynamic";

export default async function CreatePengumumanPage() {
  await requireUser();
  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Tambah Pengumuman</h1>
        <p className="text-sm text-muted-foreground">Buat pengumuman baru.</p>
      </div>

      <GlassCard>
        <CardHeader>
          <CardTitle>Form Pengumuman</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createAnnouncementAction} className="grid gap-3">
            <div>
              <label className="block text-sm">Judul</label>
              <input name="title" className="input w-full" />
            </div>

            <div>
              <label className="block text-sm">Isi</label>
              <textarea name="content" className="input w-full" rows={8} />
            </div>

            <div className="flex justify-end">
              <Link href="/dashboard/pengumuman" className="btn btn-ghost mr-2">Batal</Link>
              <button type="submit" className="btn">Simpan</button>
            </div>
          </form>
        </CardContent>
      </GlassCard>
    </div>
  );
}
