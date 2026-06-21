"use client"
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left hero */}
        <div className="hidden md:block">
          <div className="h-full flex items-center justify-center">
            <div className="glass-panel p-6 rounded-3xl max-w-sm">
              <h2 className="text-2xl font-bold">Bergabung dengan Komunitas</h2>
              <p className="mt-2 text-sm text-slate-200/80">Daftar untuk bergabung sebagai anggota UKM dan mulai berkontribusi pada kegiatan.</p>

              <div className="mt-6 relative w-full h-48">
                <Image
                  src="/images/login-banner.png"
                  alt="Register banner"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right form */}
        <section className="glass-panel p-6 rounded-3xl">
          <div className="mb-6 space-y-1">
            <h1 className="text-xl font-semibold">Daftar</h1>
            <p className="text-sm text-slate-200/80">Isi informasi akun untuk membuat profil baru.</p>
          </div>

          <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const fd = new FormData(form);
              // reset messages
              (document.getElementById('reg-message') as HTMLDivElement | null)?.classList.remove('text-emerald-400','text-rose-400');
              const btn = form.querySelector('button[type=submit]') as HTMLButtonElement | null;
              if (btn) { btn.disabled = true; btn.setAttribute('aria-busy','true'); }
              try {
                const res = await fetch('/api/auth/register', { method: 'POST', body: fd });
                const data = await res.json();
                const msgEl = document.getElementById('reg-message');
                if (btn) { btn.disabled = false; btn.removeAttribute('aria-busy'); }
                if (!data.ok) {
                  if (msgEl) {
                    msgEl.textContent = data.message || 'Gagal mendaftar.';
                    msgEl.className = 'mt-2 text-sm text-rose-400';
                  }
                } else {
                  if (msgEl) {
                    msgEl.textContent = data.message || 'Akun berhasil dibuat.';
                    msgEl.className = 'mt-2 text-sm text-emerald-400';
                  }
                  form.reset();
                }
              } catch (e) {
                const msgEl = document.getElementById('reg-message');
                if (msgEl) {
                  msgEl.textContent = 'Terjadi kesalahan saat mendaftar.';
                  msgEl.className = 'mt-2 text-sm text-rose-400';
                }
                if (btn) { btn.disabled = false; btn.removeAttribute('aria-busy'); }
              }
            }}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">Nama Lengkap</label>
              <input className="h-10 w-full rounded-md border border-white/[0.12] bg-transparent px-3 text-sm outline-none" id="name" name="name" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <input className="h-10 w-full rounded-md border border-white/[0.12] bg-transparent px-3 text-sm outline-none" id="email" name="email" type="email" autoComplete="email" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <div className="relative">
                <input className="h-10 w-full rounded-md border border-white/[0.12] bg-transparent px-3 text-sm outline-none" id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-200/70">{showPassword ? "Sembunyikan" : "Tampilkan"}</button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="confirm">Konfirmasi Password</label>
              <input className="h-10 w-full rounded-md border border-white/[0.12] bg-transparent px-3 text-sm outline-none" id="confirm" name="confirm" type={showPassword ? "text" : "password"} autoComplete="new-password" required />
            </div>

            <Button className="w-full" type="submit">Daftar</Button>

            <div id="reg-message" role="status" className="mt-2 h-5 text-sm" />

            <div className="flex items-center gap-2 mt-4">
              <span className="flex-1 h-px glass-surface" />
              <span className="text-sm text-slate-200/80">ATAU</span>
              <span className="flex-1 h-px glass-surface" />
            </div>

            <div className="text-center mt-2">
              <Link href="/login" className="text-sm text-slate-200/80">Sudah punya akun? <span className="text-primary-400">Login</span></Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}