import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { hasAnyRole } from "@/lib/auth/permissions";
import type { AppRole, SessionUser } from "@/types/auth";

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth();

  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(allowedRoles: AppRole[]) {
  const user = await requireUser();

  if (!hasAnyRole(user.role, allowedRoles)) {
    redirect("/dashboard");
  }

  return user;
}
