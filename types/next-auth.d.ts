import type { DefaultSession } from "next-auth";
import type { AppRole, AuthUserStatus } from "@/types/auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: AppRole;
      status: AuthUserStatus;
    } & DefaultSession["user"];
  }

  interface User {
    role: AppRole;
    status: AuthUserStatus;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: AppRole;
    status: AuthUserStatus;
  }
}
