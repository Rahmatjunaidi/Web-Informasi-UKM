import type { AppRole } from "@/types/auth";

export const roleLabels: Record<AppRole, string> = {
  SUPER_ADMIN: "Super Admin",
  ADVISOR: "Pembina UKM",
  UKM_ADMIN: "Pengurus UKM",
  MEMBER: "Anggota",
};

export const protectedRoles = {
  superAdmin: ["SUPER_ADMIN"],
  advisor: ["SUPER_ADMIN", "ADVISOR"],
  ukmAdmin: ["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN"],
  authenticated: ["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN", "MEMBER"],
} satisfies Record<string, AppRole[]>;
