import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UkmToolbarProps = {
  search: string;
  status: string;
};

export function UkmToolbar({ search, status }: UkmToolbarProps) {
  return (
    <form className="glass-panel grid gap-3 rounded-lg p-3 md:grid-cols-[1fr_180px_auto]" method="get">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" defaultValue={search} name="q" placeholder="Cari kode, nama, atau deskripsi UKM" />
      </div>
      <select
        className="focus-ring h-10 rounded-md border border-slate-200/80 bg-white/75 px-3 text-sm shadow-sm"
        defaultValue={status}
        name="status"
      >
        <option value="">Semua Status</option>
        <option value="ACTIVE">ACTIVE</option>
        <option value="INACTIVE">INACTIVE</option>
      </select>
      <Button type="submit">
        <Search />
        Cari
      </Button>
    </form>
  );
}
