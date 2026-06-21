"use client"
import { useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { loginAction } from "./actions";

export default function LoginPage() {
  const [show, setShow] = useState(false);
  const searchParams = useSearchParams();
  const callback = searchParams?.get("callbackUrl") || "/";

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:block">
          <div className="h-full flex items-center justify-center">
            <div className="glass-panel p-6 rounded-3xl max-w-sm">
              <h2 className="text-2xl font-bold">Selamat Datang</h2>
              <p className="mt-2 text-sm text-slate-200/80">Masuk untuk mengelola keanggotaan dan aktivitas UKM.</p>
              <div className="mt-6 relative w-full h-48">
                <Image
                  src="/images/login-banner.png"
                  alt="Login banner"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        <section className="glass-panel p-6 rounded-3xl">
          <div className="mb-6 space-y-1">
            <h1 className="text-xl font-semibold">Masuk</h1>
            <p className="text-sm text-slate-200/80">Gunakan akun yang sudah terdaftar di sistem.</p>
          </div>

          <form action={loginAction} className="space-y-4">
            <input type="hidden" name="callbackUrl" value={callback} />
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <input
                className="h-10 w-full rounded-md border border-white/[0.12] bg-transparent px-3 text-sm outline-none"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className="h-10 w-full rounded-md border border-white/[0.12] bg-transparent px-3 text-sm outline-none"
                  id="password"
                  name="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-200/70">
                  {show ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" name="remember" /> Ingat saya</label>
              <a href="#" className="text-slate-200/80">Lupa password?</a>
            </div>

            <Button className="w-full" type="submit">
              Masuk
            </Button>

            <div className="flex items-center gap-2 mt-4">
              <span className="flex-1 h-px glass-surface" />
              <span className="text-sm text-slate-200/80">ATAU</span>
              <span className="flex-1 h-px glass-surface" />
            </div>

            <button type="button" className="w-full btn-glass mt-2">Login dengan Google</button>
          </form>
        </section>
      </div>
    </main>
  );
}
