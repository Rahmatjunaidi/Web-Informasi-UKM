import { prisma } from "@/lib/prisma";

let _tableChecked = false;
let _tableExists = false;

async function websiteTableExists(): Promise<boolean> {
  if (_tableChecked) return _tableExists;
  _tableChecked = true;
  // Query information_schema to check if the table exists.
  // This never throws (it's a system view) and avoids Prisma logging
  // "table does not exist" errors when we use the model methods.
  try {
    const result: Array<{ cnt: bigint }> = await prisma.$queryRaw`
      SELECT COUNT(*) as cnt FROM information_schema.tables
      WHERE table_schema = DATABASE() AND table_name = 'website_settings'
    `;
    _tableExists = Number(result[0]?.cnt ?? BigInt(0)) > 0;
  } catch {
    _tableExists = false;
  }
  return _tableExists;
}

export async function getWebsiteSettings() {
  if (!(await websiteTableExists())) return {};
  try {
    const rows = await prisma.websiteSetting.findMany();
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    return map;
  } catch {
    return {};
  }
}

export async function getSetting(key: string) {
  if (!(await websiteTableExists())) return null;
  try {
    const r = await prisma.websiteSetting.findUnique({ where: { key } });
    return r?.value ?? null;
  } catch {
    return null;
  }
}

export async function upsertSetting(key: string, value: string) {
  if (!(await websiteTableExists())) return null;
  try {
    const exists = await prisma.websiteSetting.findUnique({ where: { key } });
    if (exists) {
      return prisma.websiteSetting.update({ where: { key }, data: { value } });
    }
    return prisma.websiteSetting.create({ data: { key, value } });
  } catch {
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
