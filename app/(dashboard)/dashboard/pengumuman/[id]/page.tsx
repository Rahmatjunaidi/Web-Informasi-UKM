import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import Link from "next/link";
import { getAnnouncementById } from "@/lib/queries/announcement";
import { formatDate } from "@/lib/utils";
import { deleteAnnouncementAction } from "../actions";

export const metadata: Metadata = { title: "Detail Pengumuman - Dashboard" };
export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default async function DetailPage({ params }: Props) {
  await requireUser();
  const { id } = await params;
  const a = await getAnnouncementById(Number(id));
  if (!a) return <div>Pengumuman tidak ditemukan</div>;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{a.title}</h1>
          <p className="text-sm text-muted-foreground">{new Date(a.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/pengumuman/${a.id}/edit`} className="btn">Edit</Link>
          <form action={deleteAnnouncementAction} className="inline">
            <input type="hidden" name="id" value={String(a.id)} />
            <button type="submit" className="btn btn-destructive">Hapus</button>
          </form>
        </div>
      </div>

      <div className="glass p-4 rounded">
        <div dangerouslySetInnerHTML={{ __html: a.content }} />
      </div>
    </div>
  );
}
