import type { AppRole } from "@/types/auth";

// Public routes that don't require authentication
export const publicRoutes = ["/", "/login", "/register", "/ukm", "/kontak"];
export const authRoutes = ["/login", "/register"];
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
  // Member dashboard (root /member)
  {
    prefix: "/member",
    allowedRoles: ["MEMBER"],
  },
];

export function isPublicRoute(pathname: string) {
  // allow public access to landing, ukm listing/detail, kontak, login and register
  if (pathname === "/") return true;
  if (pathname.startsWith("/ukm")) return true;
  if (pathname.startsWith("/kontak")) return true;
  if (publicRoutes.includes(pathname)) return true;
  return false;
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
