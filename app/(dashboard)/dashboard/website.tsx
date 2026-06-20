"use server";

import { getUkmListWithStats } from "@/lib/queries/ukm";
import { getWebsiteSettings, upsertSetting } from "@/lib/queries/website";
import { GlassCard } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";

export default async function WebsiteAdminPage() {
  await requireUser();

  const [ukmResult, settings] = await Promise.all([
    getUkmListWithStats({ page: 1, limit: 100 }),
    getWebsiteSettings(),
  ]);

  const featured = settings["featured_ukm_ids"] ?? "[]";
  const heroTitle = settings["hero_title"] ?? "Kembangkan Potensimu Bersama UKM UPJ";
  const heroDesc = settings["hero_description"] ?? "Temukan komunitas terbaik...";
  const contact = settings["contact_json"] ?? "{}";
  const social = settings["social_json"] ?? "{}";
  const footerTitle = settings["footer_title"] ?? "UKM UPJ";
  const footerDesc = settings["footer_description"] ?? "Portal Unit Kegiatan Mahasiswa";
  const copyright = settings["footer_copyright"] ?? `© ${new Date().getFullYear()} UKM UPJ`;

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Website Management</h1>

      <form action={saveWebsite} className="grid gap-4">
        <GlassCard className="p-4">
          <h3 className="font-semibold">Hero Section</h3>
          <div className="grid gap-2 mt-3">
            <label className="text-sm">Hero Title</label>
            <input name="hero_title" defaultValue={heroTitle} className="input" />
            <label className="text-sm">Hero Description</label>
            <textarea name="hero_description" defaultValue={heroDesc} className="textarea" />
            <label className="text-sm">Hero Image URL (optional)</label>
            <input name="hero_image" defaultValue={settings["hero_image"] ?? ""} className="input" />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <h3 className="font-semibold">UKM Unggulan</h3>
          <p className="text-sm">Pilih UKM yang akan ditampilkan pada homepage (masukkan id yang dipisah koma)</p>
          <input name="featured_ukm_ids" defaultValue={featured} className="input" />
          <p className="text-xs text-muted-foreground mt-2">Catatan: simpan sebagai JSON array, mis: [1,2,3]</p>
        </GlassCard>

        <GlassCard className="p-4">
          <h3 className="font-semibold">Kontak</h3>
          <div className="grid gap-2 mt-3">
            <input name="contact_json" defaultValue={contact} className="input" />
            <p className="text-xs text-muted-foreground">Format JSON: {`{\"address\":\"...\",\"email\":\"...\"}`}</p>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <h3 className="font-semibold">Sosial Media</h3>
          <div className="grid gap-2 mt-3">
            <input name="social_json" defaultValue={social} className="input" />
            <p className="text-xs text-muted-foreground">Format JSON: {`{\"instagram\":\"...\",\"youtube\":\"...\"}`}</p>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <h3 className="font-semibold">Footer</h3>
          <div className="grid gap-2 mt-3">
            <input name="footer_title" defaultValue={footerTitle} className="input" />
            <input name="footer_description" defaultValue={footerDesc} className="input" />
            <input name="footer_copyright" defaultValue={copyright} className="input" />
          </div>
        </GlassCard>

        <div>
          <button type="submit" className="btn-glass">Simpan Pengaturan Website</button>
        </div>
      </form>

    </div>
  );
}

// server action
async function saveWebsite(formData: FormData) {
  'use server';
  const entries = Object.fromEntries(formData.entries());
  for (const [k, v] of Object.entries(entries)) {
    await upsertSetting(k, String(v));
  }
  return { ok: true };
}
