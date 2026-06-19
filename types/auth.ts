export const appRoles = ["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN", "MEMBER"] as const;

export type AppRole = (typeof appRoles)[number];

export type AuthUserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: AppRole;
  status: AuthUserStatus;
};
