import { notFound } from "next/navigation";
import { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { getStudentById } from "@/lib/queries/anggota";
import { GlassCard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteAnggotaDialog } from "@/components/anggota/delete-anggota-dialog";
import { AnggotaFormModal } from "@/components/anggota/anggota-form-modal";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const data = await getStudentById(BigInt(params.id));
    if (!data) return { title: "Anggota Tidak Ditemukan" };
    return { title: `${data.name} - Detail Anggota` };
  } catch {
    return { title: "Detail Anggota" };
  }
}

export default async function AnggotaDetailPage({ params }: { params: { id: string } }) {
  await requireUser();
  const { id } = params;
  let studentId: BigInt;
  try {
    studentId = BigInt(id);
  } catch {
    return notFound();
  }

  const student = await getStudentById(studentId);
  if (!student) return notFound();

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">{student.name}</h1>
        <p className="text-sm text-muted-foreground">NIM: {student.nim}</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <GlassCard>
          <CardHeader>
            <CardTitle>Informasi</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Program Studi: {student.studyProgram ?? '-'} </p>
            <p>Fakultas: {student.faculty ?? '-'} </p>
            <p>Telepon: {student.phone ?? '-'} </p>
            <p className="mt-2 text-sm text-muted-foreground">Terdaftar: {new Date(student.createdAt).toLocaleString()}</p>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader>
            <CardTitle>Riwayat Keanggotaan</CardTitle>
          </CardHeader>
          <CardContent>
            {student.memberships.length > 0 ? (
              <div className="space-y-3">
                {student.memberships.map((m) => (
                  <div key={m.id} className="border-l-2 border-primary/30 pl-3">
                    <p className="font-medium">{m.ukm?.name}</p>
                    <p className="text-xs text-muted-foreground">{m.position} • {m.status} • {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : '-'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada riwayat keanggotaan.</p>
            )}

            <div className="mt-4 flex gap-2">
              <AnggotaFormModal mode="edit" student={{ id: student.id.toString(), nim: student.nim, name: student.name, studyProgram: student.studyProgram ?? '', faculty: student.faculty ?? '', phone: student.phone ?? '', address: student.address ?? '' }} trigger={<button className="btn">Edit</button>} />
              <DeleteAnggotaDialog id={student.id.toString()} name={student.name} trigger={<button className="btn">Hapus</button>} />
            </div>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
