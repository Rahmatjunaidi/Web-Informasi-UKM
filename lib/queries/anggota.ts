import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const STUDENT_SELECT = {
  id: true,
  userId: true,
  nim: true,
  name: true,
  studyProgram: true,
  faculty: true,
  phone: true,
  address: true,
  createdAt: true,
  updatedAt: true,
};

export async function getStudentList(options?: {
  search?: string;
  ukmId?: bigint;
  membershipStatus?: string; // e.g. "ACTIVE"
  page?: number;
  limit?: number;
}) {
  const page = Math.max(1, options?.page ?? 1);
  const limit = Math.max(1, Math.min(100, options?.limit ?? 10));
  const skip = (page - 1) * limit;

  const where: Prisma.StudentWhereInput = {};

  if (options?.search) {
    where.OR = [
      { nim: { contains: options.search } },
      { name: { contains: options.search } },
    ];
  }

  if (options?.ukmId || options?.membershipStatus) {
    where.memberships = {
      some: Object.assign({}, options.ukmId ? { ukmId: BigInt(options.ukmId as any) } : {}, options.membershipStatus ? { status: options.membershipStatus as any } : {}) as any,
    };
  }

  const [data, total] = await Promise.all([
    prisma.student.findMany({
      where,
      select: STUDENT_SELECT,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.student.count({ where }),
  ]);

  const pageCount = Math.ceil(total / limit);

  // OPTIMIZATION: Avoid N+1 queries when counting memberships per student.
  // Instead of calling prisma.ukmMembership.count() for each student, fetch counts for all returned student IDs in a single grouped query.
  const studentIds = data.map((d) => d.id);
  let membershipCounts: Record<string, number> = {};
  if (studentIds.length > 0) {
    const groups = await prisma.ukmMembership.groupBy({
      by: ["studentId"],
      where: { studentId: { in: studentIds } },
      _count: { _all: true },
    });
    // Convert to lookup map: studentId (string) -> count
    for (const g of groups) {
      membershipCounts[String(g.studentId)] = Number(g._count._all ?? 0);
    }
  }

  return {
    data,
    pagination: { page, limit, total, pageCount },
    // include precomputed membership counts to avoid per-row DB queries
    membershipCounts,
  };
}

export async function getStudentById(id: bigint) {
  return prisma.student.findUnique({
    where: { id },
    select: {
      ...STUDENT_SELECT,
      memberships: {
        select: {
          id: true,
          ukm: { select: { id: true, name: true } },
          position: true,
          status: true,
          joinedAt: true,
          leftAt: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getUkmsForFilter() {
  return prisma.ukm.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
}
