import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import authConfig from "@/auth.config";
import { prisma } from "@/lib/db/prisma";
import { loginSchema } from "@/lib/validators/auth";
import type { AppRole, AuthUserStatus } from "@/types/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { role: true },
        });

        if (!user || user.status !== "ACTIVE") {
          return null;
        }

        const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

        if (!passwordIsValid) {
          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          role: user.role.name as AppRole,
          status: user.status as AuthUserStatus,
        };
      },
    }),
  ],
});
