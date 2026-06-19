import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import Link from "next/link";
import { getFinanceTransactions, getFinanceCategories, getFinanceSummary } from "@/lib/queries/finance";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Keuangan - Dashboard" };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function KeuanganPage({ searchParams }: Props) {
  await requireUser();
  const params = await searchParams;
  const page = Math.max(1, parseInt(String(params.page ?? 1), 10));
  const perPage = Math.max(1, parseInt(String(params.perPage ?? 10), 10));
  const search = String(params.search ?? "");
  const ukmId = String(params.ukmId ?? "");
  const categoryId = String(params.categoryId ?? "");
  const type = String(params.type ?? "");

  const [result, categories, summary] = await Promise.all([
    getFinanceTransactions({ page, perPage, search: search || undefined, ukmId: ukmId || undefined, categoryId: categoryId || undefined, type: type || undefined }),
    getFinanceCategories(ukmId ? Number(ukmId) : undefined),
    getFinanceSummary({ ukmId: ukmId ? Number(ukmId) : undefined }),
  ]);

  return (
    <div className="grid gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Keuangan</h1>
          <p className="text-sm text-muted-foreground">Kelola transaksi keuangan UKM</p>
        </div>
        <Link href="/dashboard/keuangan/create" className="btn">Tambah Transaksi</Link>
      </div>

      <div className="grid gap-3">
        <div className="glass p-4 rounded">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Pemasukan</div>
              <div className="text-xl font-bold">Rp {Number(summary.totalIncome).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Pengeluaran</div>
              <div className="text-xl font-bold">Rp {Number(summary.totalExpense).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Saldo</div>
              <div className="text-xl font-bold">Rp {Number(summary.balance).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="glass p-4 rounded">
          <form method="get" className="flex gap-2 items-center">
            <input name="search" placeholder="Search" className="input" defaultValue={search ?? ""} />
            <select name="categoryId" defaultValue={categoryId ?? ""} className="input">
              <option value="">Semua Kategori</option>
              {categories.map((c: any) => (
                <option key={c.id.toString()} value={c.id.toString()}>{c.name}</option>
              ))}
            </select>
            <select name="type" defaultValue={type ?? ""} className="input">
              <option value="">Semua Jenis</option>
              <option value="INCOME">Pemasukan</option>
              <option value="EXPENSE">Pengeluaran</option>
            </select>
            <button className="btn" type="submit">Filter</button>
          </form>
        </div>

        <div className="overflow-auto rounded-lg border">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-2">UKM</th>
                <th className="p-2">Kategori</th>
                <th className="p-2">Tanggal</th>
                <th className="p-2">Judul</th>
                <th className="p-2">Nominal</th>
                <th className="p-2">Jenis</th>
                <th className="p-2">Status</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {result.items.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center">Tidak ada transaksi</td>
                </tr>
              )}

              {result.items.map((r: any) => (
                <tr key={r.id.toString()} className="hover:bg-slate-50">
                  <td className="p-2">{r.ukm?.name ?? "-"}</td>
                  <td className="p-2">{r.category?.name ?? "-"}</td>
                  <td className="p-2">{formatDate(r.transactionDate, true)}</td>
                  <td className="p-2">{r.title}</td>
                  <td className="p-2">Rp {Number(r.amount).toLocaleString()}</td>
                  <td className="p-2">{r.type}</td>
                  <td className="p-2">{r.status}</td>
                  <td className="p-2">
                    <a href={`/dashboard/keuangan/${r.id.toString()}`} className="text-primary">Lihat</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center">
          <div>Menampilkan {result.items.length} dari {result.total}</div>
        </div>
      </div>
    </div>
  );
}
