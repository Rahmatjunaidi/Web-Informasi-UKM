"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  createFinanceSchema,
  updateFinanceSchema,
  deleteFinanceSchema,
  approvalSchema,
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from "@/lib/validators/finance";
import { createCategory, updateCategory, deleteCategory } from "@/lib/queries/finance";

export async function createFinanceAction(formData: FormData) {
  const parsed = createFinanceSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    console.log("===== FINANCE VALIDATION ERROR =====");
    console.log(JSON.stringify(parsed.error.flatten(), null, 2));
    console.log(parsed.error.issues);
    console.log("===== FINANCE FORM DATA =====");
    console.log(Object.fromEntries(formData.entries()));

    return {
      ok: false,
      message: "Periksa data transaksi.",
    };
  }

  const d = parsed.data;
  const tx = await prisma.financeTransaction.create({
    data: {
      ukmId: BigInt(d.ukmId),
      categoryId: BigInt(d.categoryId),
      title: d.title,
      description: d.description ?? null,
      type: d.type,
      amount: d.amount,
      transactionDate: d.transactionDate,
    },
    include: { ukm: true, category: true, approvals: { include: { approvedByUser: true } } },
  });

  // Normalize Decimal/BigInt to plain JS types
  const mapped = {
    ...tx,
    amount: typeof tx.amount === "object" && tx.amount !== null && typeof tx.amount.toNumber === "function" ? Number(tx.amount) : tx.amount,
    ukmId: typeof tx.ukmId === "bigint" ? Number(tx.ukmId) : tx.ukmId,
    categoryId: typeof tx.categoryId === "bigint" ? Number(tx.categoryId) : tx.categoryId,
    ukm: tx.ukm ? { ...tx.ukm, id: typeof tx.ukm.id === "bigint" ? Number(tx.ukm.id) : tx.ukm.id } : null,
    category: tx.category ? { ...tx.category, id: typeof tx.category.id === "bigint" ? Number(tx.category.id) : tx.category.id } : null,
    approvals: tx.approvals ? tx.approvals.map((a: any) => ({ ...a, id: typeof a.id === "bigint" ? Number(a.id) : a.id })) : [],
  };

  revalidatePath("/dashboard/keuangan");
  return { ok: true, data: mapped };
}

// Finance category CRUD actions
export async function createCategoryAction(_prevState: any = {}, formData: FormData) {
  const parsed = createCategorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    console.log("===== FINANCE VALIDATION ERROR =====");
    console.log(JSON.stringify(parsed.error.flatten(), null, 2));
    console.log(parsed.error.issues);
    console.log("===== FINANCE FORM DATA =====");
    try {
      console.log(Object.fromEntries(formData));
    } catch (e) {
      console.log("failed to read formData entries:", e);
    }

    return { ok: false, message: "Periksa data transaksi." };
  }

  const d = parsed.data;
  const cat = await createCategory({ ukmId: Number(d.ukmId), name: d.name, type: d.type });
  revalidatePath("/dashboard/keuangan/kategori");
  return { ok: true, data: cat };
}

export async function updateCategoryAction(_prevState: any = {}, formData: FormData) {
  const parsed = updateCategorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    console.log("===== FINANCE VALIDATION ERROR =====");
    console.log(JSON.stringify(parsed.error.flatten(), null, 2));
    console.log(parsed.error.issues);
    console.log("===== FINANCE FORM DATA =====");
    try {
      console.log(Object.fromEntries(formData));
    } catch (e) {
      console.log("failed to read formData entries:", e);
    }

    return { ok: false, message: "Periksa data transaksi." };
  }

  const d = parsed.data;
  const cat = await updateCategory(Number(d.id), { ukmId: Number(d.ukmId), name: d.name, type: d.type });
  revalidatePath("/dashboard/keuangan/kategori");
  return { ok: true, data: cat };
}

export async function deleteCategoryAction(_prevState: any = {}, formData: FormData) {
  const parsed = deleteCategorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    console.log("===== FINANCE VALIDATION ERROR =====");
    console.log(JSON.stringify(parsed.error.flatten(), null, 2));
    console.log(parsed.error.issues);
    console.log("===== FINANCE FORM DATA =====");
    try {
      console.log(Object.fromEntries(formData));
    } catch (e) {
      console.log("failed to read formData entries:", e);
    }

    return { ok: false, message: "Periksa data transaksi." };
  }

  const { id } = parsed.data;
  const res = await deleteCategory(Number(id));
  revalidatePath("/dashboard/keuangan/kategori");
  return { ok: true };
}

export async function updateFinanceAction(formData: FormData) {
  const parsed = updateFinanceSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    console.log("===== FINANCE VALIDATION ERROR =====");
    console.log(JSON.stringify(parsed.error.flatten(), null, 2));
    console.log(parsed.error.issues);
    console.log("===== FINANCE FORM DATA =====");
    console.log(Object.fromEntries(formData.entries()));

    return {
      ok: false,
      message: "Periksa data transaksi.",
    };
  }

  const d = parsed.data;
  const tx = await prisma.financeTransaction.update({
    where: { id: Number(d.id) },
    data: {
      ukmId: BigInt(d.ukmId),
      categoryId: BigInt(d.categoryId),
      title: d.title,
      description: d.description ?? null,
      type: d.type,
      amount: d.amount,
      transactionDate: d.transactionDate,
    },
    include: { ukm: true, category: true, approvals: { include: { approvedByUser: true } } },
  });

  const mapped = {
    ...tx,
    amount: typeof tx.amount === "object" && tx.amount !== null && typeof tx.amount.toNumber === "function" ? Number(tx.amount) : tx.amount,
    ukmId: typeof tx.ukmId === "bigint" ? Number(tx.ukmId) : tx.ukmId,
    categoryId: typeof tx.categoryId === "bigint" ? Number(tx.categoryId) : tx.categoryId,
    ukm: tx.ukm ? { ...tx.ukm, id: typeof tx.ukm.id === "bigint" ? Number(tx.ukm.id) : tx.ukm.id } : null,
    category: tx.category ? { ...tx.category, id: typeof tx.category.id === "bigint" ? Number(tx.category.id) : tx.category.id } : null,
    approvals: tx.approvals ? tx.approvals.map((a: any) => ({ ...a, id: typeof a.id === "bigint" ? Number(a.id) : a.id })) : [],
  };

  revalidatePath("/dashboard/keuangan");
  return mapped;
}

export async function deleteFinanceAction(formData: FormData) {
  const parsed = deleteFinanceSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    console.log("===== FINANCE VALIDATION ERROR =====");
    console.log(JSON.stringify(parsed.error.flatten(), null, 2));
    console.log(parsed.error.issues);
    console.log("===== FINANCE FORM DATA =====");
    console.log(Object.fromEntries(formData.entries()));

    return {
      ok: false,
      message: "Periksa data transaksi.",
    };
  }

  const { id } = parsed.data;
  await prisma.financeTransaction.delete({ where: { id } });
  revalidatePath("/dashboard/keuangan");
  return true;
}

export async function createApprovalAction(formData: FormData) {
  const parsed = approvalSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    console.log("===== FINANCE VALIDATION ERROR =====");
    console.log(JSON.stringify(parsed.error.flatten(), null, 2));
    console.log(parsed.error.issues);
    console.log("===== FINANCE FORM DATA =====");
    console.log(Object.fromEntries(formData.entries()));

    return {
      ok: false,
      message: "Periksa data transaksi.",
    };
  }

  const d = parsed.data;

  await prisma.$transaction(async (tx) => {
    await tx.financeApproval.create({
      data: {
        transactionId: BigInt(d.transactionId),
        status: d.status as any,
        notes: d.notes ?? null,
        approvedAt: d.status === "APPROVED" ? new Date() : null,
      },
    });

    if (d.status === "APPROVED" || d.status === "REJECTED") {
      await tx.financeTransaction.update({ where: { id: Number(d.transactionId) }, data: { status: d.status === "APPROVED" ? "APPROVED" : "REJECTED" } });
    }
  });

  revalidatePath("/dashboard/keuangan");
  return true;
}
