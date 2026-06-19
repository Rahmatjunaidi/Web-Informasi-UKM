import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { getActivityList, getUkmsForFilter } from "@/lib/queries/kegiatan";
import { KegiatanTable } from "@/components/kegiatan/kegiatan-table";
import { KegiatanToolbar } from "@/components/kegiatan/kegiatan-toolbar";
import { KegiatanPagination } from "@/components/kegiatan/kegiatan-pagination";
import { KegiatanFormModal } from "@/components/kegiatan/kegiatan-form-modal";
import { GlassCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Manajemen Kegiatan", description: "Kelola kegiatan UKM" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function KegiatanPage({ searchParams }: Props) {
  await requireUser();
  const params = await searchParams;
  const search = String(params.q ?? "");
  const ukmId = String(params.ukmId ?? "");
  const status = String(params.status ?? "");
  const page = Math.max(1, parseInt(String(params.page ?? 1), 10));

  const [ukmOptions, result] = await Promise.all([
    getUkmsForFilter(),
    getActivityList({ search: search || undefined, ukmId: ukmId ? BigInt(ukmId) : undefined, status: status || undefined, page, limit: 10 }),
  ]);

  const tableData = result.data.map((a) => ({
    id: a.id.toString(),
    ukmId: a.ukmId.toString(),
    title: a.title,
    description: a.description,
    location: a.location,
    startsAt: a.startsAt.toISOString(),
    endsAt: a.endsAt?.toISOString() ?? undefined,
    budgetAmount: a.budgetAmount.toString(),
    status: a.status,
    ukmName: a.ukm?.name,
  }));

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Manajemen Kegiatan</h1>
        <p className="text-sm text-muted-foreground">Kelola kegiatan UKM.</p>
      </div>

      <div className="grid gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <KegiatanToolbar search={search} ukmId={ukmId} status={status} ukmOptions={ukmOptions.map(u => ({ id: u.id.toString(), name: u.name }))} />
          </div>
          <KegiatanFormModal mode="create" trigger={<button className="btn">Tambah Kegiatan</button>} />
        </div>
      </div>

      <KegiatanTable data={tableData} />

      {result.pagination.pageCount > 1 && (
        <KegiatanPagination page={result.pagination.page} pageCount={result.pagination.pageCount} search={search} ukmId={ukmId} status={status} />
      )}

      <div className="grid gap-3 pt-4">
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-base">Informasi</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Total: <span className="font-semibold text-slate-950">{result.pagination.total}</span> kegiatan</CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
