import bcrypt from "bcryptjs";
import { prisma } from "../lib/db/prisma";

async function main() {
  const email = "admin@ukm.local";
  const newPassword = "admin123";
  const saltRounds = 12;

  console.log(`Generating bcrypt hash for ${email} (saltRounds=${saltRounds})...`);
  const hash = await bcrypt.hash(newPassword, saltRounds);
  console.log(`Hash generated: ${hash}`);

  console.log(`Updating user with email=${email} ...`);
  const user = await prisma.user.update({
    where: { email },
    data: { passwordHash: hash },
  });

  console.log(`Password updated for user id=${user.id} email=${user.email}`);
}

main()
  .then(() => {
    console.log("Done.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed:", err);
    process.exit(1);
  });
