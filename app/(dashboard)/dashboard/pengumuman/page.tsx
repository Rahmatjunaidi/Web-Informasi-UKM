import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import Link from "next/link";
import { getAnnouncements } from "@/lib/queries/announcement";
import { GlassCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Pengumuman - Dashboard" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function PengumumanPage({ searchParams }: Props) {
  await requireUser();
  const params = await searchParams;
  const page = Math.max(1, parseInt(String(params.page ?? 1), 10));
  const perPage = Math.max(1, parseInt(String(params.perPage ?? 10), 10));
  const search = String(params.search ?? "");

  const result = await getAnnouncements({ page, perPage, search: search || undefined });

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Pengumuman</h1>
        <p className="text-sm text-muted-foreground">Kelola pengumuman organisasi.</p>
      </div>

      <div className="grid gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <form method="get" className="flex gap-2 items-center">
            <input name="search" placeholder="Search" className="input" defaultValue={search ?? ""} />
            <button className="btn" type="submit">Filter</button>
          </form>

          <Link href="/dashboard/pengumuman/create" className="btn">Tambah Pengumuman</Link>
        </div>

        <div className="overflow-auto rounded-lg border">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-2">Judul</th>
                <th className="p-2">Tanggal</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {result.items.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-6 text-center">Tidak ada pengumuman</td>
                </tr>
              )}

              {result.items.map((r: any) => (
                <tr key={String(r.id)} className="hover:bg-slate-50">
                  <td className="p-2">{r.title}</td>
                  <td className="p-2">{new Date(r.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</td>
                  <td className="p-2">
                    <a href={`/dashboard/pengumuman/${r.id}`} className="text-primary">Lihat</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 pt-4">
          <GlassCard>
            <CardHeader>
              <CardTitle className="text-base">Informasi</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Total: <span className="font-semibold text-slate-950">{result.total}</span> pengumuman</CardContent>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
