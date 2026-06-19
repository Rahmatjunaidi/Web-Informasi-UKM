import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { getStudentList, getUkmsForFilter } from "@/lib/queries/anggota";
import { AnggotaTable } from "@/components/anggota/anggota-table";
import { AnggotaToolbar } from "@/components/anggota/anggota-toolbar";
import { AnggotaPagination } from "@/components/anggota/anggota-pagination";
import { AnggotaFormModal } from "@/components/anggota/anggota-form-modal";
import { GlassCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Manajemen Anggota", description: "Kelola anggota UKM" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function AnggotaPage({ searchParams }: Props) {
  await requireUser();
  const params = await searchParams;
  const search = String(params.q ?? "");
  const ukmId = String(params.ukmId ?? "");
  const membershipStatus = String(params.membershipStatus ?? "");
  const page = Math.max(1, parseInt(String(params.page ?? 1), 10));

  const [ukmOptions, result] = await Promise.all([
    getUkmsForFilter(),
    getStudentList({ search: search || undefined, ukmId: ukmId ? BigInt(ukmId) : undefined, membershipStatus: membershipStatus || undefined, page, limit: 10 }),
  ]);

  // Use precomputed membershipCounts from the query to avoid N+1 counts.
  const tableData = result.data.map((s) => {
    const membershipCount = result.membershipCounts?.[String(s.id)] ?? 0;
    return { id: s.id.toString(), nim: s.nim, name: s.name, studyProgram: s.studyProgram, faculty: s.faculty, phone: s.phone, address: s.address, membershipCount };
  });

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Manajemen Anggota</h1>
        <p className="text-sm text-muted-foreground">Kelola data anggota dan riwayat keanggotaan.</p>
      </div>

      <div className="grid gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <AnggotaToolbar search={search} ukmId={ukmId} membershipStatus={membershipStatus} ukmOptions={ukmOptions.map(u => ({ id: u.id.toString(), name: u.name }))} />
          </div>
          <AnggotaFormModal mode="create" trigger={<button className="btn">Tambah Anggota</button>} />
        </div>
      </div>

      <AnggotaTable data={tableData} />

      {result.pagination.pageCount > 1 && (
        <AnggotaPagination page={result.pagination.page} pageCount={result.pagination.pageCount} search={search} ukmId={ukmId} membershipStatus={membershipStatus} />
      )}

      <div className="grid gap-3 pt-4">
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-base">Informasi</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Total: <span className="font-semibold text-slate-950">{result.pagination.total}</span> anggota</CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
