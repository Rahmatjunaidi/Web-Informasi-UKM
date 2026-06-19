import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import Link from "next/link";
import CategoryTable from "@/components/keuangan/category-table";
import { CategoryFormModal } from "@/components/keuangan/category-form-modal";
import { getFinanceCategories } from "@/lib/queries/finance";
import { getUkmsForFilter } from "@/lib/queries/kegiatan";

export const metadata: Metadata = { title: "Kategori Keuangan" };
export const dynamic = "force-dynamic";

export default async function CategoryPage() {
  await requireUser();
  const [categories, ukms] = await Promise.all([getFinanceCategories(), getUkmsForFilter()]);

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Kategori Keuangan</h1>
          <p className="text-sm text-muted-foreground">Kelola kategori pemasukan dan pengeluaran untuk setiap UKM.</p>
        </div>
        <CategoryFormModal mode="create" ukms={ukms} trigger={<button className="btn">Tambah Kategori</button>} />
      </div>

      <div className="glass p-4 rounded">
        <CategoryTable items={categories} ukms={ukms} />
      </div>
    </div>
  );
}
