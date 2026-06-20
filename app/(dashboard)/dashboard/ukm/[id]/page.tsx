import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ArrowLeft, Pencil, Trash2, Users, Calendar, AlertCircle, Mail, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { GlassCard, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UkmFormModal } from "@/components/ukm/ukm-form-modal";
import { DeleteUkmDialog } from "@/components/ukm/delete-ukm-dialog";
import { requireUser } from "@/lib/auth/session";
import { getUkmWithMembers, getUkmWithActivities, getUkmById } from "@/lib/queries/ukm";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type UkmDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

async function generateMetadata({ params }: UkmDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const ukm = await getUkmById(BigInt(id));
    if (!ukm) {
      return { title: "UKM Tidak Ditemukan" };
    }
    return {
      title: `${ukm.name} - Detail UKM`,
      description: ukm.description || `Detail Unit Kegiatan Mahasiswa ${ukm.name}`,
    };
  } catch {
    return { title: "Detail UKM" };
  }
}

export default async function UkmDetailPage({ params }: UkmDetailPageProps) {
  await requireUser();

  const { id } = await params;

  let ukmId: bigint;
  try {
    ukmId = BigInt(id);
  } catch {
    return notFound();
  }

  const [ukm, ukmWithMembers, ukmWithActivities]: [any, any, any] = await Promise.all([
    getUkmById(ukmId),
    getUkmWithMembers(ukmId),
    getUkmWithActivities(ukmId),
  ]);

  if (!ukm) {
    return notFound();
  }

  const members = (ukmWithMembers as any)?.memberships ?? [];
  const activities = (ukmWithActivities as any)?.activities ?? [];

  const statusColor = ukm.status === "ACTIVE"
    ? "border-emerald-300 bg-emerald-900/10 text-emerald-200"
    : "border-white/[0.12] glass-surface text-white";

  const formatDate = (date: Date | null) => {
    if (!date) return "-";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button
          asChild
          variant="ghost"
          className="w-fit"
        >
          <Link href="/dashboard/ukm">
            <ArrowLeft className="size-4" />
            Kembali ke Daftar UKM
          </Link>
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4 sm:flex-col lg:flex-row">
            <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/60 bg-primary/10 text-3xl font-semibold text-primary shadow-md">
              {ukm.logoUrl ? (
                <Image
                  alt={`Logo ${ukm.name}`}
                  className="object-cover"
                  fill
                  sizes="96px"
                  src={ukm.logoUrl}
                />
              ) : (
                ukm.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950">{ukm.name}</h1>
                <p className="text-sm text-muted-foreground">Kode: {ukm.code}</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span
                  className={cn(
                    "inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-medium",
                    statusColor
                  )}
                >
                  {ukm.status}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <UkmFormModal
              mode="edit"
              ukm={{
                id: ukm.id.toString(),
                code: ukm.code,
                name: ukm.name,
                description: ukm.description,
                contactEmail: ukm.contactEmail,
                contactPhone: ukm.contactPhone,
                status: ukm.status as "ACTIVE" | "INACTIVE",
                establishedAt: ukm.establishedAt?.toISOString().split("T")[0],
              }}
              trigger={
                <Button variant="outline" className="gap-2">
                  <Pencil className="size-4" />
                  Edit
                </Button>
              }
            />
            <DeleteUkmDialog
              id={ukm.id.toString()}
              name={ukm.name}
              trigger={
                <Button variant="outline" className="gap-2">
                  <Trash2 className="size-4" />
                  Hapus
                </Button>
              }
            />
          </div>
        </div>
      </div>

      {/* Description and Info */}
      <GlassCard>
        <CardHeader>
          <CardTitle className="text-base">Informasi UKM</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          {ukm.description && (
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">Deskripsi</p>
              <p className="text-sm text-slate-950 leading-relaxed">{ukm.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ukm.contactEmail && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-slate-600">Email Kontak</p>
                </div>
                <p className="text-sm text-slate-950 ml-6">{ukm.contactEmail}</p>
              </div>
            )}

            {ukm.contactPhone && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-slate-600">Telepon Kontak</p>
                </div>
                <p className="text-sm text-slate-950 ml-6">{ukm.contactPhone}</p>
              </div>
            )}

            {ukm.advisor && (
              <div>
                <p className="text-sm font-medium text-slate-600 mb-2">Pembina</p>
                <p className="text-sm text-slate-950">{ukm.advisor.name}</p>
                <p className="text-xs text-muted-foreground">NIP: {ukm.advisor.nip}</p>
              </div>
            )}

            {ukm.establishedAt && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-slate-600">Tanggal Berdiri</p>
                </div>
                <p className="text-sm text-slate-950 ml-6">{formatDate(ukm.establishedAt)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Members Section */}
        <GlassCard className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4" />
              Anggota Aktif
            </CardTitle>
            <CardDescription>{members.length} anggota</CardDescription>
          </CardHeader>
          {members.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-transparent glass-hover">
                    <TableHead>Nama</TableHead>
                    <TableHead>NIM</TableHead>
                    <TableHead>Posisi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member: any) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.student.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{member.student.nim}</TableCell>
                      <TableCell className="text-sm">
                        <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-white border border-white/[0.06] glass-surface">
                          {member.position}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <CardContent>
              <p className="text-sm text-muted-foreground">Belum ada anggota aktif.</p>
            </CardContent>
          )}
        </GlassCard>

        {/* Activities Section */}
        <GlassCard className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="size-4" />
              Kegiatan Terbaru
            </CardTitle>
            <CardDescription>{activities.length} kegiatan</CardDescription>
          </CardHeader>
          {activities.length > 0 ? (
            <div className="space-y-3 p-6">
              {activities.slice(0, 5).map((activity: any) => (
                <div key={activity.id} className="border-l-2 border-primary/30 pl-3 pb-3">
                  <p className="font-medium text-sm text-slate-950">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(new Date(activity.startsAt))}
                  </p>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium text-white border border-white/[0.06] glass-surface mt-2">
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <CardContent>
              <p className="text-sm text-muted-foreground">Belum ada kegiatan.</p>
            </CardContent>
          )}
        </GlassCard>
      </div>

      {/* Additional Info */}
      <GlassCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertCircle className="size-4" />
            Catatan Sistem
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Dibuat: {formatDate(ukm.createdAt)}</p>
          <p>Terakhir diperbarui: {formatDate(ukm.updatedAt)}</p>
        </CardContent>
      </GlassCard>
    </div>
  );
}
