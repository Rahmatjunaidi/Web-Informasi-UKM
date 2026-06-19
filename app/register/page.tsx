import Link from "next/link";
import { registerAction } from "./actions";
import { GlassCard } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md px-4">
        <GlassCard>
          <div className="p-6">
            <h2 className="text-xl font-semibold">Daftar Akun</h2>
            <p className="text-sm text-muted-foreground">Buat akun untuk bergabung sebagai anggota UKM.</p>

            <form action={registerAction} className="mt-6 space-y-4">
              <div>
                <label className="text-sm">Nama Lengkap</label>
                <input name="name" className="w-full input" />
              </div>

              <div>
                <label className="text-sm">Email</label>
                <input name="email" type="email" className="w-full input" />
              </div>

              <div>
                <label className="text-sm">Password</label>
                <input name="password" type="password" className="w-full input" />
              </div>

              <div>
                <label className="text-sm">Konfirmasi Password</label>
                <input name="confirm" type="password" className="w-full input" />
              </div>

              <div className="flex items-center gap-2">
                <button type="submit" className="btn btn-primary">Daftar</button>
                <Link href="/login" className="text-sm text-muted-foreground">Sudah punya akun? Login</Link>
              </div>
            </form>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}