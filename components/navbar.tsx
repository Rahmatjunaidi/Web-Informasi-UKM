import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-xl">UKM • Portal</Link>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm">Home</Link>
          <Link href="/ukm" className="text-sm">Daftar UKM</Link>
          <Link href="/kontak" className="text-sm">Kontak</Link>
          <Link href="/login" className="text-sm btn btn-ghost">Login</Link>
          <Link href="/register" className="text-sm btn">Register</Link>
        </div>
      </div>
    </nav>
  );
}