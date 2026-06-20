"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { activitySchema } from "@/lib/validators/kegiatan";

export type KegiatanActionState = { ok: boolean; message: string; errors?: Record<string, string> };
const initial: KegiatanActionState = { ok: false, message: "" };

export async function createActivityAction(_: KegiatanActionState = initial, formData: FormData) {
  const parsed = activitySchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    console.log("===== ACTIVITY VALIDATION ERROR =====");
    try {
      console.log(JSON.stringify(parsed.error.flatten(), null, 2));
    } catch (e) {
      console.log("failed to stringify parsed.error.flatten():", e);
    }
    console.log(parsed.error.issues);
    console.log("===== ACTIVITY FORM DATA =====");
    try {
      console.log(Object.fromEntries(formData.entries()));
    } catch (e) {
      console.log("failed to read formData entries:", e);
    }

    return { ok: false, message: "Periksa data kegiatan.", errors: Object.fromEntries(Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v[0]])) };
  }

  try {
    const payload = parsed.data;
    console.log("ACTIVITY DATA:", parsed.data);
    console.log("UKM ID:", parsed.data.ukmId);
    const activity = await prisma.activity.create({
      data: {
        ukmId: BigInt(payload.ukmId),
        title: payload.title,
        description: payload.description ?? undefined,
        location: payload.location ?? undefined,
        startsAt: new Date(payload.startsAt),
        endsAt: payload.endsAt
  ? new Date(payload.endsAt)
  : new Date(payload.startsAt),
        budgetAmount: new Prisma.Decimal(payload.budgetAmount),
        status: payload.status as any,
      },
    });

    revalidatePath("/dashboard/kegiatan");
    revalidatePath("/dashboard");

    return { ok: true, message: "Kegiatan berhasil ditambahkan.", errors: undefined };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, message: "Duplikat data.", errors: { title: "Judul sudah ada." } };
    }
    return { ok: false, message: "Gagal menambahkan kegiatan." };
  }
}

export async function updateActivityAction(_: KegiatanActionState = initial, formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !/^\d+$/.test(id)) return { ok: false, message: "ID tidak valid." };

  const parsed = activitySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: "Periksa data kegiatan.", errors: Object.fromEntries(Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v[0]])) };
  }

  try {
    const payload = parsed.data;
    await prisma.activity.update({
      where: { id: BigInt(id) },
      data: {
        ukmId: BigInt(payload.ukmId),
        title: payload.title,
        description: payload.description ?? undefined,
        location: payload.location ?? undefined,
        startsAt: new Date(payload.startsAt),
        endsAt: payload.endsAt ? new Date(payload.endsAt) : undefined,
        budgetAmount: new Prisma.Decimal(payload.budgetAmount),
        status: payload.status as any,
      },
    });

    revalidatePath("/dashboard/kegiatan");
    revalidatePath(`/dashboard/kegiatan/${id}`);
    revalidatePath("/dashboard");

    return { ok: true, message: "Kegiatan berhasil diperbarui." };
  } catch (error) {
    return { ok: false, message: "Gagal memperbarui kegiatan." };
  }
}

export async function deleteActivityAction(_: KegiatanActionState = initial, formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !/^\d+$/.test(id)) return { ok: false, message: "ID tidak valid." };

  try {
    await prisma.activity.delete({ where: { id: BigInt(id) } });

    revalidatePath("/dashboard/kegiatan");
    revalidatePath("/dashboard");

    return { ok: true, message: "Kegiatan berhasil dihapus." };
  } catch (error) {
    return { ok: false, message: "Gagal menghapus kegiatan." };
  }
}
