import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import type { SessionUser } from "@/types/auth";

type DashboardLayoutProps = {
  children: React.ReactNode;
  user: SessionUser;
};

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="academic-grid dashboard-shell min-h-screen bg-background">
      <Sidebar role={user.role} />
      <div className="lg:pl-80">
        <div className="px-4 py-4 lg:px-6">
          <Navbar user={user} />
          <main className="mx-auto mt-4 max-w-7xl pb-10 lg:mt-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
