"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

type UserLike = { name?: string | null; email?: string | null; role?: string } | undefined;

export default function Navbar({ user: propUser }: { user?: UserLike } ) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const user = propUser;
  const role = (user as any)?.role as string | undefined;
  const isLoggedIn = Boolean(user);

  const baseItems = [
    { href: "/", label: "Home" },
    { href: "/ukm", label: "Daftar UKM" },
    { href: "/kontak", label: "Kontak" },
  ];

  // Admin users get Dashboard link
  if (isLoggedIn && role && role !== "MEMBER") {
    baseItems.push({ href: "/dashboard", label: "Dashboard" });
  }

  // Profile visible to logged in users
  const items = [...baseItems];
  if (isLoggedIn) items.push({ href: "/profile", label: "Profile" });

  return (
    <nav className="navbar-glass px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div>
          <Link href="/" className="font-semibold text-lg md:text-2xl">UKM UPJ</Link>
          <div className="text-xs text-muted-foreground">Portal Unit Kegiatan Mahasiswa</div>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className={`relative text-sm ${pathname === it.href ? "text-white font-semibold" : "text-slate-200/90"}`}>
              {it.label}
              {pathname === it.href && <span className="block mt-2 active-indicator w-full" />}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link href="/login" className="btn-glass">Login</Link>
              <Link href="/register" className="btn-glass">Register</Link>
            </>
          ) : (
            <>
              <Link href="/profile" className="btn-glass">Profile</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-glass">Logout</button>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <button aria-label="open menu" onClick={() => setOpen(!open)} className="btn-glass">Menu</button>
        </div>
      </div>

      {open && (
        <div className="md:hidden mt-3 space-y-2 max-w-7xl mx-auto">
          <div className="glass-panel p-3">
            {items.map((it) => (
              <Link key={it.href} href={it.href} className="block py-2 text-sm">{it.label}</Link>
            ))}
            <div className="mt-2 flex gap-2">
              {!isLoggedIn ? (
                <>
                  <Link href="/login" className="btn-glass">Login</Link>
                  <Link href="/register" className="btn-glass">Register</Link>
                </>
              ) : (
                <>
                  <Link href="/profile" className="btn-glass">Profile</Link>
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-glass">Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
