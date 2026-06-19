import { Bell, Command, LogOut, Search, UserRound } from "lucide-react";

import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SessionUser } from "@/types/auth";

type NavbarProps = {
  user: SessionUser;
};

export function Navbar({ user }: NavbarProps) {
  async function logoutAction() {
    "use server";

    await signOut({ redirectTo: "/login" });
  }

  return (
    <header className="sticky top-4 z-30 hidden lg:block">
      <div className="glass-panel flex h-16 items-center justify-between rounded-lg px-4">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="h-10 bg-white/60 pl-9 pr-16" placeholder="Cari UKM, anggota, kegiatan..." />
          <div className="pointer-events-none absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-slate-200 bg-white/75 px-2 py-1 text-xs text-slate-400">
            <Command className="size-3" />
            K
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button aria-label="Notifikasi" size="icon" type="button" variant="glass">
            <Bell />
          </Button>
          <div className="flex min-w-48 items-center gap-3 rounded-md border border-white/50 bg-white/60 px-3 py-2 shadow-sm">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <UserRound className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user.name ?? "User"}</p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
          </div>
          <form action={logoutAction}>
            <Button aria-label="Keluar" size="icon" type="submit" variant="glass">
              <LogOut />
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
