import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { getFinanceById } from "@/lib/queries/finance";
import { deleteFinanceAction } from "../actions";

export const metadata: Metadata = { title: "Detail Transaksi - Keuangan" };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function DetailPage({ params }: Props) {
  await requireUser();
  const { id } = await params;
const financeId = Number(id);
  const tx = await getFinanceById(financeId);
  if (!tx) return <div>Transaksi tidak ditemukan</div>;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Detail Transaksi #{tx.id}</h1>
          <p className="text-sm text-muted-foreground">Informasi transaksi.</p>
        </div>
        <Link href="/dashboard/keuangan" className="btn">Kembali</Link>
      </div>

      <div className="glass p-4 rounded">
        <p><strong>UKM:</strong> {tx.ukm?.name}</p>
        <p><strong>Kategori:</strong> {tx.category?.name}</p>
        <p><strong>Tanggal:</strong> {formatDate(tx.transactionDate, true)}</p>
        <p><strong>Judul:</strong> {tx.title}</p>
        <p><strong>Deskripsi:</strong> {tx.description ?? "-"}</p>
        <p><strong>Nominal:</strong> Rp {Number(tx.amount).toLocaleString()}</p>
        <p><strong>Jenis:</strong> {tx.type}</p>
        <p><strong>Status:</strong> {tx.status}</p>
        <div className="mt-4 flex gap-2">
          <Link href={`/dashboard/keuangan/${tx.id}/edit`} className="btn">Edit</Link>

          <form action={deleteFinanceAction} className="inline">
            <input type="hidden" name="id" value={String(tx.id)} />
            <button type="submit" className="btn btn-destructive">Hapus</button>
          </form>
        </div>

        <div className="mt-6">
          <h3 className="font-medium">Persetujuan</h3>
          <div className="mt-2">
            {tx.approvals?.length ? tx.approvals.map((a:any) => (
              <div key={a.id} className="p-2 border rounded mb-2">
                <div><strong>{a.status}</strong> — {a.approvedByUser?.name ?? "System"}</div>
                <div className="text-sm text-muted">{a.notes}</div>
                <div className="text-xs text-muted">{formatDate(a.approvedAt, true)}</div>
              </div>
            )) : <div>Tidak ada riwayat persetujuan</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
