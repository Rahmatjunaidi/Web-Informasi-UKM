"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const name = String(data.name || "").trim();
  const email = String(data.email || "").trim().toLowerCase();
  const password = String(data.password || "");
  const confirm = String(data.confirm || "");

  if (!name || !email || !password) {
    // simple validation — in real app return errors to client
    throw new Error("Validasi gagal: semua field wajib diisi.");
  }

  if (password !== confirm) {
    throw new Error("Validasi gagal: password tidak cocok.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Email sudah terdaftar.");
  }

  const role = await prisma.role.findUnique({ where: { name: "MEMBER" } });
  if (!role) {
    throw new Error("Role MEMBER tidak ditemukan di database.");
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

  // redirect to login after successful registration
  redirect("/login");
}
