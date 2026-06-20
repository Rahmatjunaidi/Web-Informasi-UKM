"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export type RegisterResult =
  | { ok: true; message: string }
  | { ok: false; message: string; code?: string };

export async function registerAction(formData: FormData): Promise<RegisterResult> {
  const data = Object.fromEntries(formData.entries());
  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "");
  const confirm = String(data.confirm || "");

  if (!name || !email || !password) {
    return { ok: false, message: "Validasi gagal: semua field wajib diisi.", code: "VALIDATION" };
  }

  if (password !== confirm) {
    return { ok: false, message: "Validasi gagal: password tidak cocok.", code: "VALIDATION" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // keep validation logic — instead of throwing, return structured response
    return { ok: false, message: "Email sudah terdaftar.", code: "EMAIL_EXISTS" };
  }

  const role = await prisma.role.findUnique({ where: { name: "MEMBER" } });
  if (!role) {
    return { ok: false, message: "Role MEMBER tidak ditemukan di database.", code: "ROLE_MISSING" };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      roleId: role.id,
      status: "ACTIVE",
    },
  });

  // Return success — UI will show success state and prompt to login
  return { ok: true, message: "Akun berhasil dibuat. Silakan login." };
}
