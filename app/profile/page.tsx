import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/card";

export const metadata: Metadata = { title: "Profil Saya" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser();

  const profile = await prisma.user.findUnique({
    where: { id: BigInt(user.id) },
    include: { role: true },
  });

  if (!profile) return null;

  return (
    <div className="py-10 max-w-4xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Profil Saya</h1>
      <GlassCard>
        <div className="p-6 space-y-3">
          <div>
            <div className="text-sm text-muted-foreground">Nama</div>
            <div className="font-medium">{profile.name}</div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Email</div>
            <div className="font-medium">{profile.email}</div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Role</div>
            <div className="font-medium">{profile.role?.name}</div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="font-medium">{profile.status}</div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}