import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { requireUser } from "@/lib/auth/session";

export default async function ProtectedDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireUser();

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
