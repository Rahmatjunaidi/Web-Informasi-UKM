import { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getStudentById } from "@/lib/queries/anggota";
import { AnggotaFormModal } from "@/components/anggota/anggota-form-modal";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const s = await getStudentById(BigInt(params.id));
    if (!s) return { title: "Anggota tidak ditemukan" };
    return { title: `Edit ${s.name}` };
  } catch {
    return { title: "Edit Anggota" };
  }
}

export default async function AnggotaEditPage({ params }: { params: { id: string } }) {
  await requireUser();
  const { id } = params;
  let studentId: BigInt;
  try {
    studentId = BigInt(id);
  } catch {
    return notFound();
  }

  const s = await getStudentById(studentId);
  if (!s) return notFound();

  const formValue = { id: s.id.toString(), nim: s.nim, name: s.name, studyProgram: s.studyProgram ?? "", faculty: s.faculty ?? "", phone: s.phone ?? "", address: s.address ?? "" };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Edit Anggota</h1>
        <p className="text-sm text-muted-foreground">Ubah data anggota.</p>
      </div>

      <div>
        <AnggotaFormModal mode="edit" student={formValue} trigger={null} />
      </div>
    </div>
  );
}
