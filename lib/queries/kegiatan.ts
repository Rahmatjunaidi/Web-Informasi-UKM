import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const ACTIVITY_SELECT = Prisma.validator<Prisma.ActivitySelect>()({
  id: true,
  ukmId: true,
  title: true,
  description: true,
  location: true,
  startsAt: true,
  endsAt: true,
  budgetAmount: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  ukm: {
    select: {
      id: true,
      name: true,
    },
  },
});

export async function getActivityList(options?: {
  search?: string;
  ukmId?: bigint;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, options?.page ?? 1);
  const limit = Math.max(1, Math.min(100, options?.limit ?? 10));
  const skip = (page - 1) * limit;

  const where: Prisma.ActivityWhereInput = {};

  if (options?.search) {
    where.OR = [
      { title: { contains: options.search } },
      { description: { contains: options.search } },
      { location: { contains: options.search } },
    ];
  }

  if (options?.ukmId) {
    where.ukmId = options.ukmId;
  }

  if (options?.status) {
    where.status = options.status as any;
  }

  const [data, total] = await Promise.all([
    prisma.activity.findMany({ where, select: ACTIVITY_SELECT, orderBy: { startsAt: "desc" }, skip, take: limit }),
    prisma.activity.count({ where }),
  ]);

  return {
    data,
    pagination: { page, limit, total, pageCount: Math.ceil(total / limit) },
  };
}

export async function getActivityById(id: bigint) {
  return prisma.activity.findUnique({ where: { id }, select: ACTIVITY_SELECT });
}

export async function getUkmsForFilter() {
  return prisma.ukm.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
}
