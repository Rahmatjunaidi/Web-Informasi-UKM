import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import Link from "next/link";
import { getFinanceCategories } from "@/lib/queries/finance";
import { getUkmsForFilter } from "@/lib/queries/kegiatan";
import { createFinanceAction } from "../actions";

export const metadata: Metadata = { title: "Tambah Transaksi - Keuangan" };
export const dynamic = "force-dynamic";

export default async function CreateKeuanganPage() {
  await requireUser();
  const [categories, ukms] = await Promise.all([getFinanceCategories(), getUkmsForFilter()]);

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tambah Transaksi</h1>
          <p className="text-sm text-muted-foreground">Isi form untuk menambahkan transaksi keuangan.</p>
        </div>
        <Link href="/dashboard/keuangan" className="btn">Kembali</Link>
      </div>

      <div className="glass p-4 rounded">
        <form action={createFinanceAction} className="grid gap-3">
          <div>
            <label className="block text-sm">UKM</label>
            <select name="ukmId" className="input w-full">
              <option value="">-- Pilih UKM --</option>
              {ukms.map((u:any)=>(<option key={u.id.toString()} value={u.id.toString()}>{u.name}</option>))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm">Kategori</label>
              <Link href="/dashboard/keuangan/kategori" className="text-sm text-primary">Kelola Kategori</Link>
            </div>
            <select name="categoryId" className="input w-full">
              <option value="">-- Pilih Kategori --</option>
              {categories.map((c:any)=>(<option key={c.id.toString()} value={c.id.toString()}>{c.name} ({c.type})</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm">Judul</label>
            <input name="title" className="input w-full" />
          </div>

          <div>
            <label className="block text-sm">Deskripsi</label>
            <textarea name="description" className="input w-full" />
          </div>

          <div>
            <label className="block text-sm">Tanggal</label>
            <input name="transactionDate" type="date" className="input w-full" />
          </div>

          <div>
            <label className="block text-sm">Nominal</label>
            <input name="amount" type="number" step="0.01" className="input w-full" />
          </div>

          <div>
            <label className="block text-sm">Jenis</label>
            <select name="type" className="input w-full">
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
