import { prisma } from "@/lib/prisma";

export async function getAnnouncements({ page = 1, perPage = 10, search }: any = {}) {
  const where: any = {};
  if (search) {
    where.OR = [
      { title: { contains: String(search), mode: "insensitive" } },
      { content: { contains: String(search), mode: "insensitive" } },
    ];
  }

  const total = await prisma.announcement.count({ where });
  const rawItems = await prisma.announcement.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * perPage,
    take: perPage,
  });

  // normalize BigInt/Date to plain JS types
  const items = rawItems.map((a: any) => ({
    ...a,
    id: typeof a.id === "bigint" ? Number(a.id) : a.id,
    createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : null,
    updatedAt: a.updatedAt ? new Date(a.updatedAt).toISOString() : null,
  }));

  return { items, total, page, perPage };
}

export async function getAnnouncementById(id: number) {
  const a = await prisma.announcement.findUnique({ where: { id } });
  if (!a) return null;
  return {
    ...a,
    id: typeof a.id === "bigint" ? Number(a.id) : a.id,
    createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : null,
    updatedAt: a.updatedAt ? new Date(a.updatedAt).toISOString() : null,
  };
}

export async function createAnnouncement(data: { title: string; content: string }) {
  const a = await prisma.announcement.create({ data: { title: data.title, content: data.content } });
  return {
    ...a,
    id: typeof a.id === "bigint" ? Number(a.id) : a.id,
    createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : null,
    updatedAt: a.updatedAt ? new Date(a.updatedAt).toISOString() : null,
  };
}

export async function updateAnnouncement(id: number, data: { title: string; content: string }) {
  const a = await prisma.announcement.update({ where: { id }, data: { title: data.title, content: data.content } });
  return {
    ...a,
    id: typeof a.id === "bigint" ? Number(a.id) : a.id,
    createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : null,
    updatedAt: a.updatedAt ? new Date(a.updatedAt).toISOString() : null,
  };
}

export async function deleteAnnouncement(id: number) {
  return prisma.announcement.delete({ where: { id } });
}
