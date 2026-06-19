import type { AppRole } from "@/types/auth";

export const publicRoutes = ["/", "/login"];
export const authRoutes = ["/login"];
export const apiAuthPrefix = "/api/auth";
export const defaultLoginRedirect = "/dashboard";

export type RoutePermission = {
  prefix: string;
  allowedRoles: AppRole[];
};

export const routePermissions: RoutePermission[] = [
  {
    prefix: "/dashboard/admin",
    allowedRoles: ["SUPER_ADMIN"],
  },
  {
    prefix: "/dashboard/ukm",
    allowedRoles: ["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN"],
  },
  {
    prefix: "/dashboard/anggota",
    allowedRoles: ["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN"],
  },
  {
    prefix: "/dashboard/kegiatan",
    allowedRoles: ["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN", "MEMBER"],
  },
  {
    prefix: "/dashboard/keuangan",
    allowedRoles: ["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN"],
  },
  {
    prefix: "/dashboard/pengumuman",
    allowedRoles: ["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN", "MEMBER"],
  },
  {
    prefix: "/dashboard",
    allowedRoles: ["SUPER_ADMIN", "ADVISOR", "UKM_ADMIN", "MEMBER"],
  },
];

export function isPublicRoute(pathname: string) {
  return publicRoutes.includes(pathname);
}

export function isAuthRoute(pathname: string) {
  return authRoutes.includes(pathname);
}

export function getRoutePermission(pathname: string) {
  return routePermissions
    .filter((permission) => pathname === permission.prefix || pathname.startsWith(`${permission.prefix}/`))
    .sort((a, b) => b.prefix.length - a.prefix.length)[0];
}

export function canAccessRoute(pathname: string, role?: AppRole) {
  const permission = getRoutePermission(pathname);

  if (!permission) {
    return true;
  }

  return role ? permission.allowedRoles.includes(role) : false;
}

export function hasAnyRole(userRole: AppRole | undefined, allowedRoles: AppRole[]) {
  return userRole ? allowedRoles.includes(userRole) : false;
}
