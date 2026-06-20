import { prisma } from "@/lib/prisma";

export async function getFinanceTransactions({ page = 1, perPage = 10, search, ukmId, categoryId, type } : any = {}) {
  const where: any = {};
  if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
  if (ukmId) where.ukmId = Number(ukmId);
  if (categoryId) where.categoryId = Number(categoryId);
  if (type) where.type = type;

  const total = await prisma.financeTransaction.count({ where });
  const rawItems = await prisma.financeTransaction.findMany({
    where,
    include: { ukm: true, category: true, approvals: { include: { approvedByUser: true } } },
    orderBy: { transactionDate: "desc" },
    skip: (page - 1) * perPage,
    take: perPage,
  });

  // Convert Decimal/BigInt fields to plain JS types before sending to client
  const items = rawItems.map((tx: any) => ({
    ...tx,
    amount: typeof tx.amount === "object" && tx.amount !== null && typeof tx.amount.toNumber === "function" ? Number(tx.amount) : tx.amount,
    ukmId: typeof tx.ukmId === "bigint" ? Number(tx.ukmId) : tx.ukmId,
    categoryId: typeof tx.categoryId === "bigint" ? Number(tx.categoryId) : tx.categoryId,
    ukm: tx.ukm ? { ...tx.ukm, id: typeof tx.ukm.id === "bigint" ? Number(tx.ukm.id) : tx.ukm.id } : null,
    category: tx.category ? { ...tx.category, id: typeof tx.category.id === "bigint" ? Number(tx.category.id) : tx.category.id } : null,
    approvals: tx.approvals ? tx.approvals.map((a: any) => ({ ...a, id: typeof a.id === "bigint" ? Number(a.id) : a.id })) : [],
  }));

  return { items, total, page, perPage };
}

export async function getFinanceById(id: number) {
  const tx = await prisma.financeTransaction.findUnique({
    where: { id },
    include: { ukm: true, category: true, approvals: { include: { approvedByUser: true } }, createdByUser: true },
  });
  if (!tx) return null;
  return {
    ...tx,
    amount: typeof tx.amount === "object" && tx.amount !== null && typeof tx.amount.toNumber === "function" ? Number(tx.amount) : tx.amount,
    ukmId: typeof tx.ukmId === "bigint" ? Number(tx.ukmId) : tx.ukmId,
    categoryId: typeof tx.categoryId === "bigint" ? Number(tx.categoryId) : tx.categoryId,
    ukm: tx.ukm ? { ...tx.ukm, id: typeof tx.ukm.id === "bigint" ? Number(tx.ukm.id) : tx.ukm.id } : null,
    category: tx.category ? { ...tx.category, id: typeof tx.category.id === "bigint" ? Number(tx.category.id) : tx.category.id } : null,
    approvals: tx.approvals ? tx.approvals.map((a: any) => ({ ...a, id: typeof a.id === "bigint" ? Number(a.id) : a.id })) : [],
  };
}

export async function getFinanceCategories(ukmId?: number) {
  const where = ukmId ? { ukmId: Number(ukmId) } : undefined;
  return prisma.financeCategory.findMany({ select: { id: true, name: true, ukmId: true, type: true, ukm: { select: { id: true, name: true } } }, where, orderBy: { name: "asc" } });
}

export async function getCategoryById(id: number) {
  return prisma.financeCategory.findUnique({ where: { id }, include: { ukm: true } });
}

export async function createCategory(data: { ukmId: number; name: string; type: string }) {
  return prisma.financeCategory.create({ data: { ukmId: BigInt(data.ukmId), name: data.name, type: data.type as any } });
}

export async function updateCategory(id: number, data: { ukmId: number; name: string; type: string }) {
  return prisma.financeCategory.update({ where: { id }, data: { ukmId: BigInt(data.ukmId), name: data.name, type: data.type as any } });
}

export async function deleteCategory(id: number) {
  return prisma.financeCategory.delete({ where: { id } });
}

export async function getFinanceSummary({ ukmId, from, to } : any = {}) {
  const baseWhere: any = {};
  if (ukmId) baseWhere.ukmId = Number(ukmId);
  if (from) baseWhere.transactionDate = { gte: new Date(from) };
  if (to) baseWhere.transactionDate = { ...baseWhere.transactionDate, lte: new Date(to) };

  const income = await prisma.financeTransaction.aggregate({ _sum: { amount: true }, where: { ...baseWhere, type: "INCOME" } });
  const expense = await prisma.financeTransaction.aggregate({ _sum: { amount: true }, where: { ...baseWhere, type: "EXPENSE" } });

  return {
    totalIncome: Number(income._sum.amount ?? 0),
    totalExpense: Number(expense._sum.amount ?? 0),
    balance: Number(income._sum.amount ?? 0) - Number(expense._sum.amount ?? 0),
  };
}
