import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import Link from "next/link";
import { getAnnouncementById } from "@/lib/queries/announcement";
import { updateAnnouncementAction } from "../../actions";
import { GlassCard, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Edit Pengumuman - Dashboard" };
export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default async function EditPage({ params }: Props) {
  await requireUser();
  const { id } = await params;
  const a = await getAnnouncementById(Number(id));
  if (!a) return <div>Pengumuman tidak ditemukan</div>;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Pengumuman</h1>
          <p className="text-sm text-muted-foreground">Ubah pengumuman.</p>
        </div>
        <Link href="/dashboard/pengumuman" className="btn">Kembali</Link>
      </div>

      <GlassCard>
        <CardHeader>
          <CardTitle>Edit Pengumuman</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateAnnouncementAction} className="grid gap-3">
            <input type="hidden" name="id" value={String(a.id)} />

            <div>
              <label className="block text-sm">Judul</label>
              <input name="title" defaultValue={a.title} className="input w-full" />
            </div>

            <div>
              <label className="block text-sm">Isi</label>
              <textarea name="content" defaultValue={a.content} className="input w-full" rows={8} />
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
