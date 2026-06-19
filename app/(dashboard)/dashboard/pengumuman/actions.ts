"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createAnnouncementSchema, updateAnnouncementSchema, deleteAnnouncementSchema } from "@/lib/validators/announcement";
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from "@/lib/queries/announcement";

export async function createAnnouncementAction(formData: FormData) {
  const parsed = createAnnouncementSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    console.log("===== ANNOUNCEMENT VALIDATION ERROR =====");
    console.log(JSON.stringify(parsed.error.flatten(), null, 2));
    console.log(parsed.error.issues);
    console.log("===== FORM DATA =====");
    console.log(Object.fromEntries(formData.entries()));

    return { ok: false, message: "Periksa data pengumuman." };
  }

  const d = parsed.data;
  const a = await createAnnouncement({ title: d.title, content: d.content });
  revalidatePath("/dashboard/pengumuman");
  return { ok: true, data: a };
}

export async function updateAnnouncementAction(formData: FormData) {
  const parsed = updateAnnouncementSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    console.log("===== ANNOUNCEMENT VALIDATION ERROR =====");
    console.log(JSON.stringify(parsed.error.flatten(), null, 2));
    console.log(parsed.error.issues);
    console.log("===== FORM DATA =====");
    console.log(Object.fromEntries(formData.entries()));

    return { ok: false, message: "Periksa data pengumuman." };
  }

  const d = parsed.data;
  const a = await updateAnnouncement(Number(d.id), { title: d.title, content: d.content });
  revalidatePath("/dashboard/pengumuman");
  return { ok: true, data: a };
}

export async function deleteAnnouncementAction(formData: FormData) {
  const parsed = deleteAnnouncementSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    console.log("===== ANNOUNCEMENT VALIDATION ERROR =====");
    console.log(JSON.stringify(parsed.error.flatten(), null, 2));
    console.log(parsed.error.issues);
    console.log("===== FORM DATA =====");
    console.log(Object.fromEntries(formData.entries()));

    return { ok: false, message: "Periksa data pengumuman." };
  }

  const { id } = parsed.data;
  await deleteAnnouncement(Number(id));
  revalidatePath("/dashboard/pengumuman");
  return { ok: true };
}
