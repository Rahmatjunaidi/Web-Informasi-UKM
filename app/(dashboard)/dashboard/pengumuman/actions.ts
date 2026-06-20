"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createAnnouncementSchema, updateAnnouncementSchema, deleteAnnouncementSchema } from "@/lib/validators/announcement";
import { createAnnouncement, updateAnnouncement, deleteAnnouncement } from "@/lib/queries/announcement";

export async function createAnnouncementAction(formData: FormData): Promise<void> {
  const parsed = createAnnouncementSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    console.log("===== ANNOUNCEMENT VALIDATION ERROR =====");
    console.log(JSON.stringify(parsed.error.flatten(), null, 2));
    console.log(parsed.error.issues);
    console.log("===== FORM DATA =====");
    console.log(Object.fromEntries(formData.entries()));

    return;
  }

  const d = parsed.data;
  await createAnnouncement({ title: d.title, content: d.content });
  revalidatePath("/dashboard/pengumuman");
}

export async function updateAnnouncementAction(formData: FormData): Promise<void> {
  const parsed = updateAnnouncementSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    console.log("===== ANNOUNCEMENT VALIDATION ERROR =====");
    console.log(JSON.stringify(parsed.error.flatten(), null, 2));
    console.log(parsed.error.issues);
    console.log("===== FORM DATA =====");
    console.log(Object.fromEntries(formData.entries()));

    return;
  }

  const d = parsed.data;
  await updateAnnouncement(Number(d.id), { title: d.title, content: d.content });
  revalidatePath("/dashboard/pengumuman");
}

export async function deleteAnnouncementAction(formData: FormData): Promise<void> {
  const parsed = deleteAnnouncementSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    console.log("===== ANNOUNCEMENT VALIDATION ERROR =====");
    console.log(JSON.stringify(parsed.error.flatten(), null, 2));
    console.log(parsed.error.issues);
    console.log("===== FORM DATA =====");
    console.log(Object.fromEntries(formData.entries()));

    return;
  }

  const { id } = parsed.data;
  await deleteAnnouncement(Number(id));
  revalidatePath("/dashboard/pengumuman");
}
