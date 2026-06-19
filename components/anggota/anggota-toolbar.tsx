import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AnggotaToolbarProps = {
  search: string;
  ukmId: string;
  membershipStatus: string;
  ukmOptions: { id: string; name: string }[];
};

export function AnggotaToolbar({ search, ukmId, membershipStatus, ukmOptions }: AnggotaToolbarProps) {
  return (
    <form className="glass-panel grid gap-3 rounded-lg p-3 md:grid-cols-[1fr_180px_140px_auto]" method="get">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" defaultValue={search} name="q" placeholder="Cari nama atau NIM" />
      </div>

      <select className="focus-ring h-10 rounded-md border border-slate-200/80 bg-white/75 px-3 text-sm shadow-sm" defaultValue={ukmId} name="ukmId">
        <option value="">Semua UKM</option>
        {ukmOptions.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>

      <select className="focus-ring h-10 rounded-md border border-slate-200/80 bg-white/75 px-3 text-sm shadow-sm" defaultValue={membershipStatus} name="membershipStatus">
        <option value="">Semua Status</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="INACTIVE">INACTIVE</option>
        <option value="PENDING">PENDING</option>
        <option value="LEFT">LEFT</option>
      </select>

      <Button type="submit">
        <Search />
        Cari
      </Button>
    </form>
  );
}
