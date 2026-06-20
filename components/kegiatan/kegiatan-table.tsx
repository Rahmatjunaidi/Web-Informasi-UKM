import Link from "next/link";
import { ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteKegiatanDialog } from "@/components/kegiatan/delete-kegiatan-dialog";
import { KegiatanFormModal, type ActivityFormValue } from "@/components/kegiatan/kegiatan-form-modal";
import { formatDate } from "@/lib/utils";

export type KegiatanTableItem = ActivityFormValue & { ukmName?: string };

type Props = { data: KegiatanTableItem[] };

export function KegiatanTable({ data }: Props) {
  return (
    <GlassCard className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-transparent glass-hover">
            <TableHead>Judul</TableHead>
            <TableHead>UKM</TableHead>
            <TableHead>Lokasi</TableHead>
            <TableHead className="text-right">Tanggal</TableHead>
            <TableHead className="w-36 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((a) => (
              <TableRow key={a.id}>
                <TableCell>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-950">{a.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{a.description ?? "-"}</p>
                  </div>
                </TableCell>
                <TableCell>{a.ukmName ?? "-"}</TableCell>
                <TableCell>{a.location ?? "-"}</TableCell>
                <TableCell className="text-right">{formatDate(a.startsAt, true)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button asChild aria-label={`Detail ${a.title}`} size="icon" type="button" variant="ghost">
                      <Link href={`/dashboard/kegiatan/${a.id}`}>
                        <ArrowUpRight />
                      </Link>
                    </Button>
                    <KegiatanFormModal mode="edit" activity={a} trigger={<Button aria-label={`Edit ${a.title}`} size="icon" type="button" variant="ghost"><Pencil /></Button>} />
                    <DeleteKegiatanDialog id={a.id ?? ""} name={a.title} trigger={<Button aria-label={`Hapus ${a.title}`} size="icon" type="button" variant="ghost"><Trash2 /></Button>} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-36 text-center" colSpan={5}>
                <div className="mx-auto max-w-sm">
                  <p className="font-medium text-slate-950">Belum ada kegiatan.</p>
                  <p className="mt-1 text-sm text-muted-foreground">Tambahkan kegiatan baru atau ubah filter pencarian.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </GlassCard>
  );
}
