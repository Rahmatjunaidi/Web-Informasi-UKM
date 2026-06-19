import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const roles = [
  { name: "SUPER_ADMIN", label: "Super Admin" },
  { name: "ADVISOR", label: "Pembina UKM" },
  { name: "UKM_ADMIN", label: "Pengurus UKM" },
  { name: "MEMBER", label: "Anggota" },
];

async function main() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { label: role.label },
      create: role,
    });
  }

  const superAdminRole = await prisma.role.findUniqueOrThrow({
    where: { name: "SUPER_ADMIN" },
  });

  const passwordHash = await bcrypt.hash("Admin123", 12);

  await prisma.user.upsert({
    where: { email: "admin@ukm.local" },
    update: {
      roleId: superAdminRole.id,
      name: "Super Admin",
      passwordHash,
      status: "ACTIVE",
    },
    create: {
      roleId: superAdminRole.id,
      name: "Super Admin",
      email: "admin@ukm.local",
      passwordHash,
      status: "ACTIVE",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
