import { Metadata } from "next";
import Link from "next/link";
import { getUkmListWithStats } from "@/lib/queries/ukm";
import { GlassCard } from "@/components/ui/card";

export const metadata: Metadata = { title: "Daftar UKM" };
export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function UkmListPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(String(params.page ?? 1), 10));
  const q = String(params.q ?? "");

  const result = await getUkmListWithStats({ search: q || undefined, page, limit: 12 });

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Daftar UKM</h1>
            <p className="text-sm text-muted-foreground">Temukan UKM yang sesuai minatmu.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.data.map((u) => (
            <Link key={u.id.toString()} href={`/ukm/${u.id}`} className="glass p-4 rounded-2xl hover:scale-[1.01] transition">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full flex items-center justify-center text-lg font-semibold glass">{u.name.charAt(0)}</div>
                <div>
                  <div className="font-medium">{u.name}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">{u.description}</div>
                </div>
              </div>

              <div className="mt-3 text-sm text-muted-foreground">Anggota: {u.memberCount} • Kegiatan: {u.activityCount}</div>
            </Link>
          ))}
        </div>

        {result.pagination.pageCount > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="inline-flex items-center space-x-2">
              {Array.from({ length: result.pagination.pageCount }).map((_, i) => (
                <Link key={i} href={`/ukm?page=${i + 1}`} className={`px-3 py-1 rounded-md ${result.pagination.page === i + 1 ? 'bg-indigo-600 text-white' : 'glass-surface text-white'}`}>
                  {i + 1}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}