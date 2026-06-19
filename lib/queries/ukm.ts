import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const UKM_QUERY_SELECT = {
  id: true,
  code: true,
  name: true,
  description: true,
  logoUrl: true,
  contactEmail: true,
  contactPhone: true,
  status: true,
  establishedAt: true,
  createdAt: true,
  updatedAt: true,
  advisor: {
    select: {
      id: true,
      name: true,
      nip: true,
    },
  },
};

export type UkmWithAdvisor = Prisma.UkmGetPayload<{
  select: typeof UKM_QUERY_SELECT;
}>;

/**
 * Get a single UKM by ID with advisor information
 */
export async function getUkmById(id: BigInt) {
  return prisma.ukm.findUnique({
    where: { id },
    select: UKM_QUERY_SELECT,
  });
}

/**
 * Get UKM list with search, status filter, and pagination
 */
export async function getUkmList(options?: {
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, options?.page ?? 1);
  const limit = Math.max(1, Math.min(100, options?.limit ?? 10));
  const skip = (page - 1) * limit;

  const where: Prisma.UkmWhereInput = {};

  // Add search filter
  if (options?.search) {
    where.OR = [
      { code: { contains: options.search, mode: "insensitive" } },
      { name: { contains: options.search, mode: "insensitive" } },
      { description: { contains: options.search, mode: "insensitive" } },
    ];
  }

  // Add status filter
  if (options?.status) {
    where.status = options.status;
  }

  const [data, total] = await Promise.all([
    prisma.ukm.findMany({
      where,
      select: UKM_QUERY_SELECT,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.ukm.count({ where }),
  ]);

  const pageCount = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pageCount,
    },
  };
}

/**
 * Get UKM with members count
 */
export async function getUkmWithMembersCount(id: BigInt) {
  const ukm = await prisma.ukm.findUnique({
    where: { id },
    select: {
      ...UKM_QUERY_SELECT,
      memberships: {
        where: { status: "ACTIVE" },
        select: { id: true },
      },
    },
  });

  if (!ukm) return null;

  const { memberships, ...rest } = ukm;
  return {
    ...rest,
    memberCount: memberships.length,
  };
}

/**
 * Get UKM with members list
 */
export async function getUkmWithMembers(id: BigInt, options?: { limit?: number }) {
  const limit = options?.limit ?? 50;

  return prisma.ukm.findUnique({
    where: { id },
    select: {
      ...UKM_QUERY_SELECT,
      memberships: {
        where: { status: "ACTIVE" },
        select: {
          id: true,
          position: true,
          joinedAt: true,
          student: {
            select: {
              id: true,
              nim: true,
              name: true,
              studyProgram: true,
            },
          },
        },
        orderBy: { joinedAt: "asc" },
        take: limit,
      },
    },
  });
}

/**
 * Get UKM with activities list
 */
export async function getUkmWithActivities(id: BigInt, options?: { limit?: number }) {
  const limit = options?.limit ?? 10;

  return prisma.ukm.findUnique({
    where: { id },
    select: {
      ...UKM_QUERY_SELECT,
      activities: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          startsAt: true,
          endsAt: true,
        },
        orderBy: { startsAt: "desc" },
        take: limit,
      },
    },
  });
}

/**
 * Get UKM list with member and activity counts
 */
export async function getUkmListWithStats(options?: {
  search?: string;
  status?: "ACTIVE" | "INACTIVE";
  page?: number;
  limit?: number;
}) {
  const result = await getUkmList(options);

  // OPTIMIZATION: avoid N+1 by aggregating counts for all UKM IDs in one or two queries.
  const ukmIds = result.data.map((u) => u.id);
  let memberCountsMap: Record<string, number> = {};
  let activityCountsMap: Record<string, number> = {};

  if (ukmIds.length > 0) {
    // groupBy memberships per ukmId with active status
    const memberGroups = await prisma.ukmMembership.groupBy({
      by: ["ukmId"],
      where: { ukmId: { in: ukmIds }, status: "ACTIVE" },
      _count: { _all: true },
    });
    for (const g of memberGroups) {
      memberCountsMap[String(g.ukmId)] = Number(g._count._all ?? 0);
    }

    // groupBy activities per ukmId
    const activityGroups = await prisma.activity.groupBy({
      by: ["ukmId"],
      where: { ukmId: { in: ukmIds } },
      _count: { _all: true },
    });
    for (const g of activityGroups) {
      activityCountsMap[String(g.ukmId)] = Number(g._count._all ?? 0);
    }
  }

  const dataWithStats = result.data.map((ukm) => ({
    ...ukm,
    memberCount: memberCountsMap[String(ukm.id)] ?? 0,
    activityCount: activityCountsMap[String(ukm.id)] ?? 0,
  }));

  return {
    data: dataWithStats,
    pagination: result.pagination,
  };
}
