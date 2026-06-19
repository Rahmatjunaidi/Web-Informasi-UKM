import Link from "next/link";
import { ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteAnggotaDialog } from "@/components/anggota/delete-anggota-dialog";
import { AnggotaFormModal, type StudentFormValue } from "@/components/anggota/anggota-form-modal";

export type AnggotaTableItem = StudentFormValue & { membershipCount: number };

type AnggotaTableProps = { data: AnggotaTableItem[] };

export function AnggotaTable({ data }: AnggotaTableProps) {
  return (
    <GlassCard className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-white/55 hover:bg-white/55">
            <TableHead>Nama</TableHead>
            <TableHead>NIM</TableHead>
            <TableHead>Program</TableHead>
            <TableHead className="text-right">Keanggotaan</TableHead>
            <TableHead className="w-36 text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-950">{s.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{s.address ?? "-"}</p>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-slate-950">{s.nim}</TableCell>
                <TableCell>{s.studyProgram ?? "-"}</TableCell>
                <TableCell className="text-right">{s.membershipCount}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button asChild aria-label={`Detail ${s.name}`} size="icon" type="button" variant="ghost">
                      <Link href={`/dashboard/anggota/${s.id}`}>
                        <ArrowUpRight />
                      </Link>
                    </Button>
                    <AnggotaFormModal
                      mode="edit"
                      trigger={
                        <Button aria-label={`Edit ${s.name}`} size="icon" type="button" variant="ghost">
                          <Pencil />
                        </Button>
                      }
                      student={s}
                    />
                    <DeleteAnggotaDialog id={s.id ?? ""} name={s.name} trigger={
                      <Button aria-label={`Hapus ${s.name}`} size="icon" type="button" variant="ghost">
                        <Trash2 />
                      </Button>
                    } />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className="h-36 text-center" colSpan={5}>
                <div className="mx-auto max-w-sm">
                  <p className="font-medium text-slate-950">Belum ada data anggota.</p>
                  <p className="mt-1 text-sm text-muted-foreground">Tambahkan anggota baru atau ubah filter pencarian.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </GlassCard>
  );
}
