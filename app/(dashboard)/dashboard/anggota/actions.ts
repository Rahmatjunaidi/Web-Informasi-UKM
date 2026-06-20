"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { createStudentSchema, studentSchema, membershipSchema } from "@/lib/validators/anggota";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { MembershipPosition, MembershipStatus } from "@prisma/client";

export type AnggotaActionState = { ok: boolean; message: string; errors?: Record<string, string> };
const initial: AnggotaActionState = { ok: false, message: "" };

export async function createStudentAction(_: AnggotaActionState = initial, formData: FormData) {
  const parsed = createStudentSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    console.log("===== VALIDATION ERROR =====");
    try {
      console.log(JSON.stringify(parsed.error.flatten(), null, 2));
    } catch (e) {
      console.log("failed to stringify parsed.error.flatten():", e);
    }
    console.log(parsed.error.issues);
    console.log("===== FORM DATA =====");
    try {
      console.log(Object.fromEntries(formData.entries()));
    } catch (e) {
      console.log("failed to read formData entries:", e);
    }

    return { ok: false, message: "Periksa data anggota.", errors: flattenErrors(parsed.error) };
  }

  // temporary logging for debugging parsed input
  console.info("createStudentAction parsed.data:", parsed.data);

  try {
    // find MEMBER role
    const role = await prisma.role.findUnique({ where: { name: "MEMBER" } });
    if (!role) {
      return { ok: false, message: "Role MEMBER tidak ditemukan. Hubungi admin." };
    }

    const passwordRaw = parsed.data.password ?? randomBytes(8).toString("hex");
    const passwordHash = await bcrypt.hash(passwordRaw, 10);

    // use transaction: create user then student, optionally membership
    const ukmId = formData.get("ukmId");

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          roleId: role.id,
          name: parsed.data.name,
          email: parsed.data.email,
          passwordHash,
        },
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          nim: parsed.data.nim,
          name: parsed.data.name,
studyProgram: parsed.data.studyProgram ?? "",
faculty: parsed.data.faculty ?? "",
phone: parsed.data.phone ?? null,
address: parsed.data.address ?? null,
        },
      });

      if (typeof ukmId === "string" && /^\d+$/.test(ukmId)) {
        await tx.ukmMembership.create({
          data: {
            ukmId: BigInt(ukmId),
            studentId: student.id,
            position:
  ((formData.get("position") as MembershipPosition) ??
    MembershipPosition.MEMBER),

status:
  ((formData.get("membershipStatus") as MembershipStatus) ??
    MembershipStatus.ACTIVE),
            joinedAt: formData.get("joinedAt") ? new Date(String(formData.get("joinedAt"))) : undefined,
            createdByUserId: undefined,
          },
        });
      }

      return { user, student };
    });

    revalidatePath("/dashboard/anggota");
    revalidatePath("/dashboard");

    return { ok: true, message: "Anggota berhasil ditambahkan." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      // determine which field
      const target = (error.meta as any)?.target as string[] | undefined;
      if (target?.includes("email")) {
        return { ok: false, message: "Email sudah terdaftar.", errors: { email: "Email harus unik." } };
      }
      if (target?.includes("nim")) {
        return { ok: false, message: "NIM sudah terdaftar.", errors: { nim: "NIM harus unik." } };
      }
    }
    return { ok: false, message: "Gagal menambahkan anggota." };
  }
}

export async function updateStudentAction(_: AnggotaActionState = initial, formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !/^\d+$/.test(id)) return { ok: false, message: "ID tidak valid." };

  const parsed = studentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: "Periksa data anggota.", errors: flattenErrors(parsed.error) };
  }

  try {
    await prisma.student.update({
  where: { id: BigInt(id) },
  data: {
    nim: parsed.data.nim,
    name: parsed.data.name,
    studyProgram: parsed.data.studyProgram ?? "",
    faculty: parsed.data.faculty ?? "",
    phone: parsed.data.phone ?? null,
    address: parsed.data.address ?? null,
  },
});

    revalidatePath("/dashboard/anggota");
    revalidatePath(`/dashboard/anggota/${id}`);
    revalidatePath("/dashboard");

    return { ok: true, message: "Anggota berhasil diperbarui." };
  } catch (error) {
    return { ok: false, message: "Gagal memperbarui anggota." };
  }
}

export async function deleteStudentAction(_: AnggotaActionState = initial, formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !/^\d+$/.test(id)) return { ok: false, message: "ID tidak valid." };

  try {
    await prisma.student.delete({ where: { id: BigInt(id) } });

    revalidatePath("/dashboard/anggota");
    revalidatePath("/dashboard");

    return { ok: true, message: "Anggota berhasil dihapus." };
  } catch (error) {
    return { ok: false, message: "Gagal menghapus anggota." };
  }
}

export async function assignMembershipAction(_: AnggotaActionState = initial, formData: FormData) {
  const parsed = membershipSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: "Periksa data keanggotaan.", errors: flattenErrors(parsed.error) };
  }

  try {
    await prisma.ukmMembership.create({
      data: {
        ukmId: BigInt(parsed.data.ukmId),
        studentId: BigInt(parsed.data.studentId),
       position:
  (parsed.data.position as MembershipPosition) ??
  MembershipPosition.MEMBER,

status:
  (parsed.data.status as MembershipStatus) ??
  MembershipStatus.ACTIVE,
        joinedAt: parsed.data.joinedAt ? new Date(parsed.data.joinedAt) : undefined,
      },
    });

    revalidatePath("/dashboard/anggota");
    revalidatePath(`/dashboard/anggota/${parsed.data.studentId}`);

    return { ok: true, message: "Anggota berhasil ditugaskan ke UKM." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, message: "Anggota sudah tergabung di UKM tersebut.", errors: { ukmId: "Sudah tergabung" } };
    }
    return { ok: false, message: "Gagal menambahkan keanggotaan." };
  }
}

function flattenErrors(error: { flatten: () => { fieldErrors: Record<string, string[]> } }) {
  return Object.fromEntries(Object.entries(error.flatten().fieldErrors).map(([k, v]) => [k, v[0]]));
}
