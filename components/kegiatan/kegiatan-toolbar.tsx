import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  search: string;
  ukmId: string;
  status: string;
  ukmOptions: { id: string; name: string }[];
};

export function KegiatanToolbar({ search, ukmId, status, ukmOptions }: Props) {
  return (
    <form className="glass-panel grid gap-3 rounded-lg p-3 md:grid-cols-[1fr_180px_140px_auto]" method="get">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" defaultValue={search} name="q" placeholder="Cari judul, deskripsi, atau lokasi" />
      </div>

      <select className="focus-ring h-10 rounded-md px-3 text-sm text-white glass" defaultValue={ukmId} name="ukmId">
        <option value="">Semua UKM</option>
        {ukmOptions.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>

      <select className="focus-ring h-10 rounded-md px-3 text-sm text-white glass" defaultValue={status} name="status">
        <option value="">Semua Status</option>
        <option value="DRAFT">DRAFT</option>
        <option value="SUBMITTED">SUBMITTED</option>
        <option value="APPROVED">APPROVED</option>
        <option value="REJECTED">REJECTED</option>
        <option value="ONGOING">ONGOING</option>
        <option value="COMPLETED">COMPLETED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>

      <Button type="submit">
        <Search />
        Cari
      </Button>
    </form>
  );
}
