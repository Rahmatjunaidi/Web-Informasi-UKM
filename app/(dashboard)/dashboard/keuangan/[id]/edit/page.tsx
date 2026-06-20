import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import Link from "next/link";
import { getFinanceById, getFinanceCategories } from "@/lib/queries/finance";
import { getUkmsForFilter } from "@/lib/queries/kegiatan";
import { updateFinanceAction } from "../../actions";

export const metadata: Metadata = { title: "Edit Transaksi - Keuangan" };
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditPage({ params }: Props) {
  await requireUser();
  const { id } = await params;
  const financeId = Number(id);
  const [tx, categories, ukms] = await Promise.all([getFinanceById(financeId), getFinanceCategories(), getUkmsForFilter()]);
  if (!tx) return <div>Transaksi tidak ditemukan</div>;
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Transaksi #{tx.id}</h1>
          <p className="text-sm text-muted-foreground">Ubah data transaksi.</p>
        </div>
        <Link href="/dashboard/keuangan" className="btn">Kembali</Link>
      </div>

      <div className="glass p-4 rounded">
        <form action={updateFinanceAction} className="grid gap-3">
          <input type="hidden" name="id" value={String(tx.id)} />

          <div>
            <label className="block text-sm">UKM</label>
            <select name="ukmId" defaultValue={String(tx.ukmId)} className="input w-full">
              <option value="">-- Pilih UKM --</option>
              {ukms.map((u:any)=>(<option key={u.id.toString()} value={u.id.toString()}>{u.name}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm">Kategori</label>
            <select name="categoryId" defaultValue={String(tx.categoryId)} className="input w-full">
              <option value="">-- Pilih Kategori --</option>
              {categories.map((c:any)=>(<option key={c.id.toString()} value={c.id.toString()}>{c.name} ({c.type})</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm">Judul</label>
            <input name="title" defaultValue={tx.title} className="input w-full" />
          </div>

          <div>
            <label className="block text-sm">Deskripsi</label>
            <textarea name="description" defaultValue={tx.description ?? ""} className="input w-full" />
          </div>

          <div>
            <label className="block text-sm">Tanggal</label>
            <input name="transactionDate" type="date" defaultValue={new Date(tx.transactionDate).toISOString().slice(0,10)} className="input w-full" />
          </div>

          <div>
            <label className="block text-sm">Nominal</label>
            <input name="amount" type="number" step="0.01" defaultValue={String(tx.amount)} className="input w-full" />
          </div>

          <div>
            <label className="block text-sm">Jenis</label>
            <select name="type" defaultValue={tx.type} className="input w-full">
              <option value="INCOME">Pemasukan</option>
              <option value="EXPENSE">Pengeluaran</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="btn">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}
