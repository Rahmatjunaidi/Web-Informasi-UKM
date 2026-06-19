"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { ukmSchema, type UkmFormErrors, type UkmInput } from "@/lib/validators/ukm";

export type UkmActionState = {
  ok: boolean;
  message: string;
  errors?: UkmFormErrors;
};

const initialErrorState: UkmActionState = {
  ok: false,
  message: "",
};

export async function createUkmAction(_: UkmActionState = initialErrorState, formData: FormData) {
  await requireRole(["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN"]);

  const parsed = ukmSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "Periksa kembali data UKM.",
      errors: flattenUkmErrors(parsed.error),
    };
  }

  try {
    const logoUrl = await saveLogo(formData.get("logo"));

    await prisma.ukm.create({
      data: {
        ...toPrismaUkmData(parsed.data),
        logoUrl,
      },
    });

    revalidatePath("/dashboard/ukm");
    revalidatePath("/dashboard");

    return { ok: true, message: "UKM berhasil ditambahkan." };
  } catch (error) {
    return handleUkmActionError(error, "Gagal menambahkan UKM.");
  }
}

export async function updateUkmAction(_: UkmActionState = initialErrorState, formData: FormData) {
  await requireRole(["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN"]);

  const id = parseUkmId(formData.get("id"));
  if (!id) {
    return { ok: false, message: "ID UKM tidak valid." };
  }

  const parsed = ukmSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "Periksa kembali data UKM.",
      errors: flattenUkmErrors(parsed.error),
    };
  }

  try {
    const current = await prisma.ukm.findUnique({
      select: { logoUrl: true },
      where: { id },
    });

    if (!current) {
      return { ok: false, message: "UKM tidak ditemukan." };
    }

    const nextLogoUrl = await saveLogo(formData.get("logo"));

    await prisma.ukm.update({
      data: {
        ...toPrismaUkmData(parsed.data),
        logoUrl: nextLogoUrl ?? current.logoUrl,
      },
      where: { id },
    });

    revalidatePath("/dashboard/ukm");
    revalidatePath(`/dashboard/ukm/${id.toString()}`);
    revalidatePath("/dashboard");

    return { ok: true, message: "UKM berhasil diperbarui." };
  } catch (error) {
    return handleUkmActionError(error, "Gagal memperbarui UKM.");
  }
}

export async function deleteUkmAction(_: UkmActionState = initialErrorState, formData: FormData) {
  await requireRole(["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN"]);

  const id = parseUkmId(formData.get("id"));
  if (!id) {
    return { ok: false, message: "ID UKM tidak valid." };
  }

  try {
    await prisma.ukm.delete({ where: { id } });

    revalidatePath("/dashboard/ukm");
    revalidatePath("/dashboard");

    return { ok: true, message: "UKM berhasil dihapus." };
  } catch (error) {
    return handleUkmActionError(error, "Gagal menghapus UKM.");
  }
}

function toPrismaUkmData(data: UkmInput) {
  return {
    code: data.code,
    name: data.name,
    description: data.description,
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    status: data.status,
    establishedAt: data.establishedAt ? new Date(data.establishedAt) : undefined,
  };
}

function parseUkmId(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !/^\d+$/.test(value)) {
    return null;
  }

  return BigInt(value);
}

async function saveLogo(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size === 0) {
    return undefined;
  }

  if (!value.type.startsWith("image/")) {
    throw new LogoValidationError("Logo harus berupa file gambar.");
  }

  const maxSize = 2 * 1024 * 1024;
  if (value.size > maxSize) {
    throw new LogoValidationError("Ukuran logo maksimal 2MB.");
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "ukm");
  await mkdir(uploadDir, { recursive: true });

  const extension = getSafeExtension(value.name);
  const fileName = `${randomUUID()}${extension}`;
  const filePath = path.join(uploadDir, fileName);
  const buffer = Buffer.from(await value.arrayBuffer());

  await writeFile(filePath, buffer);

  return `/uploads/ukm/${fileName}`;
}

function getSafeExtension(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(extension) ? extension : ".png";
}

function flattenUkmErrors(error: { flatten: () => { fieldErrors: Record<string, string[]> } }) {
  return Object.fromEntries(
    Object.entries(error.flatten().fieldErrors).map(([key, messages]) => [key, messages[0]]),
  ) as UkmFormErrors;
}

function handleUkmActionError(error: unknown, fallbackMessage: string): UkmActionState {
  if (error instanceof LogoValidationError) {
    return {
      ok: false,
      message: error.message,
      errors: { logo: error.message },
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return {
      ok: false,
      message: "Kode UKM sudah digunakan.",
      errors: { code: "Kode UKM harus unik." },
    };
  }

  return {
    ok: false,
    message: fallbackMessage,
  };
}

class LogoValidationError extends Error {}
