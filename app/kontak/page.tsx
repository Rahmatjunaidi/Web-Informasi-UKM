import { Metadata } from "next";
import { GlassCard } from "@/components/ui/card";

export const metadata: Metadata = { title: "Kontak / Helpdesk" };

export default function KontakPage() {
  return (
    <div className="py-10 max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-2">Kontak / Helpdesk</h1>
      <p className="text-sm text-muted-foreground mb-6">Jika membutuhkan bantuan, silakan hubungi admin atau tim support kami.</p>

      <GlassCard>
        <div className="p-6 space-y-4">
          <div>
            <div className="font-medium">Email</div>
            <div className="text-sm text-muted-foreground">support@ukm.univ.local</div>
          </div>

          <div>
            <div className="font-medium">WhatsApp</div>
            <div className="text-sm text-muted-foreground">+62 812-3456-7890</div>
          </div>

          <div>
            <div className="font-medium">Alamat</div>
            <div className="text-sm text-muted-foreground">Kampus Universitas, Jl. Merdeka No.1</div>
          </div>

          <div>
            <div className="font-medium">FAQ</div>
            <div className="text-sm text-muted-foreground">Lihat halaman FAQ atau kirim email ke support.</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}