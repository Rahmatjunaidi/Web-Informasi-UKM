import type { NextAuthConfig } from "next-auth";
import type { AppRole, AuthUserStatus } from "@/types/auth";

export default {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as AppRole;
        session.user.status = token.status as AuthUserStatus;
      }

      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
