import { prisma } from "@/lib/prisma";

const client: any = prisma as any;

export async function getWebsiteSettings() {
  // defensive: if Prisma client was not generated after adding WebsiteSetting model,
  // prisma.websiteSetting may be undefined. Return empty map instead of crashing.
  try {
    if (!client || !client.websiteSetting || typeof client.websiteSetting.findMany !== "function") {
      return {};
    }

    const rows = await client.websiteSetting.findMany();
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    return map;
  } catch (e) {
    // On any error (missing table, db not migrated), return empty settings map
    return {};
  }
}

export async function getSetting(key: string) {
  try {
    if (!client || !client.websiteSetting || typeof client.websiteSetting.findUnique !== "function") {
      return null;
    }
    const r = await client.websiteSetting.findUnique({ where: { key } });
    return r?.value ?? null;
  } catch (e) {
    return null;
  }
}

export async function upsertSetting(key: string, value: string) {
  try {
    if (!client || !client.websiteSetting) {
      // Prisma client is missing the WebsiteSetting model (likely prisma generate not run).
      // Return null so caller can handle or log the issue. Do not crash.
      return null;
    }

    const exists = await client.websiteSetting.findUnique({ where: { key } });
    if (exists) {
      return client.websiteSetting.update({ where: { key }, data: { value } });
    }
    return client.websiteSetting.create({ data: { key, value } });
  } catch (e) {
    return null;
  }
}

export async function getFeaturedUkms() {
  const val = await getSetting("featured_ukm_ids");
  if (!val) return [];
  try {
    const ids: number[] = JSON.parse(val);
    if (!Array.isArray(ids) || ids.length === 0) return [];
    // fetch ukms
    const ukms = await prisma.ukm.findMany({ where: { id: { in: ids.map((i) => BigInt(i)) } } });
    // preserve order
    const byId = new Map(ukms.map((u) => [String(u.id), u]));
    return ids.map((i) => byId.get(String(BigInt(i)))).filter(Boolean);
  } catch (e) {
    return [];
  }
}
