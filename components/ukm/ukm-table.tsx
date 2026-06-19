import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Pencil, Trash2 } from "lucide-react";

import { DeleteUkmDialog } from "@/components/ukm/delete-ukm-dialog";
import { UkmFormModal, type UkmFormValue } from "@/components/ukm/ukm-form-modal";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export type UkmTableItem = UkmFormValue & {
  logoUrl?: string | null;
  advisorName?: string | null;
  memberCount: number;
  activityCount: number;
};

type UkmTableProps = {
  data: UkmTableItem[];
};

export function UkmTable({ data }: UkmTableProps) {
  return (
    <GlassCard className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-white/55 hover:bg-white/55">
            <TableHead>UKM</TableHead>
            <TableHead>Kode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pembina</TableHead>
            <TableHead className="text-right">Anggota</TableHead>
            <TableHead className="text-right">Kegiatan</TableHead>
            <TableHead className="w-36 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((ukm) => (
              <TableRow key={ukm.id}>
                <TableCell>
                  <div className="flex min-w-64 items-center gap-3">
                    <Logo name={ukm.name} src={ukm.logoUrl} />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-950">{ukm.name}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                        {ukm.description || "Tidak ada deskripsi."}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-950">{ukm.code}</TableCell>
                <TableCell>
                  <StatusBadge status={ukm.status} />
                </TableCell>
                <TableCell>{ukm.advisorName ?? "-"}</TableCell>
                <TableCell className="text-right">{ukm.memberCount}</TableCell>
                <TableCell className="text-right">{ukm.activityCount}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button asChild aria-label={`Detail ${ukm.name}`} size="icon" type="button" variant="ghost">
                      <Link href={`/dashboard/ukm/${ukm.id}`}>
                        <ArrowUpRight />
                      </Link>
                    </Button>
                    <UkmFormModal
                      mode="edit"
                      trigger={
                        <Button aria-label={`Edit ${ukm.name}`} size="icon" type="button" variant="ghost">
                          <Pencil />
                        </Button>
                      }
                      ukm={ukm}
                    />
                    <DeleteUkmDialog
                      id={ukm.id ?? ""}
                      name={ukm.name}
                      trigger={
                        <Button aria-label={`Hapus ${ukm.name}`} size="icon" type="button" variant="ghost">
                          <Trash2 />
                        </Button>
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-36 text-center" colSpan={7}>
                <div className="mx-auto max-w-sm">
                  <p className="font-medium text-slate-950">Belum ada data UKM.</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tambahkan UKM baru atau ubah kata kunci pencarian dan filter status.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </GlassCard>
  );
}

export function Logo({ name, src }: { name: string; src?: string | null }) {
  const initial = name.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className="relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-white/60 bg-primary/10 text-sm font-semibold text-primary shadow-sm">
      {src ? <Image alt={`Logo ${name}`} className="object-cover" fill sizes="44px" src={src} /> : initial}
    </div>
  );
}

export function StatusBadge({ status }: { status: "ACTIVE" | "INACTIVE" }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-medium",
        status === "ACTIVE"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-50 text-slate-600",
      )}
    >
      {status}
    </span>
  );
}
