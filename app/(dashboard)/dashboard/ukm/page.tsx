import { Plus, AlertCircle } from "lucide-react";
import { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { UkmFormModal } from "@/components/ukm/ukm-form-modal";
import { UkmPagination } from "@/components/ukm/ukm-pagination";
import { UkmTable } from "@/components/ukm/ukm-table";
import { UkmToolbar } from "@/components/ukm/ukm-toolbar";
import { requireUser } from "@/lib/auth/session";
import { getUkmListWithStats } from "@/lib/queries/ukm";
import { GlassCard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Manajemen UKM",
  description: "Kelola Unit Kegiatan Mahasiswa (UKM)",
};

export const dynamic = "force-dynamic";

type UkmPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UkmPage({ searchParams }: UkmPageProps) {
  await requireUser();

  const params = await searchParams;
  const search = String(params.q ?? "");
  const status = (params.status as "ACTIVE" | "INACTIVE" | undefined) ?? "";
  const page = Math.max(1, parseInt(String(params.page ?? 1), 10));

  try {
    const result = await getUkmListWithStats({
      search: search || undefined,
      status: status ? (status as "ACTIVE" | "INACTIVE") : undefined,
      page,
      limit: 10,
    });

    const tableData = result.data.map((ukm) => ({
      id: ukm.id.toString(),
      code: ukm.code,
      name: ukm.name,
      description: ukm.description,
      status: ukm.status,
      logoUrl: ukm.logoUrl,
      advisorName: ukm.advisor?.name,
      memberCount: ukm.memberCount,
      activityCount: ukm.activityCount,
      contactEmail: ukm.contactEmail,
      contactPhone: ukm.contactPhone,
      establishedAt: ukm.establishedAt?.toISOString().split("T")[0],
    }));

    return (
      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">Manajemen UKM</h1>
            <p className="text-sm text-muted-foreground">
              Kelola Unit Kegiatan Mahasiswa (UKM) di kampus Anda.
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <UkmToolbar search={search} status={status} />
            </div>
            <UkmFormModal
              mode="create"
              trigger={
                <Button className="gap-2">
                  <Plus className="size-4" />
                  Tambah UKM
                </Button>
              }
            />
          </div>
        </div>

        <UkmTable data={tableData} />

        {result.pagination.pageCount > 1 && (
          <UkmPagination
            page={result.pagination.page}
            pageCount={result.pagination.pageCount}
            search={search}
            status={status}
          />
        )}

        <div className="grid gap-3 pt-4">
          <GlassCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertCircle className="size-4" />
                Informasi
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>Total: <span className="font-semibold text-slate-950">{result.pagination.total}</span> UKM</p>
            </CardContent>
          </GlassCard>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching UKM list:", error);

    return (
      <div className="grid gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Manajemen UKM</h1>
          <p className="text-sm text-muted-foreground">
            Kelola Unit Kegiatan Mahasiswa (UKM) di kampus Anda.
          </p>
        </div>

        <GlassCard>
          <CardContent className="py-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="size-5 text-destructive" />
              <div>
                <p className="font-medium text-slate-950">Terjadi kesalahan</p>
                <p className="text-sm text-muted-foreground">Gagal memuat daftar UKM. Silakan coba lagi.</p>
              </div>
            </div>
          </CardContent>
        </GlassCard>
      </div>
    );
  }
}
