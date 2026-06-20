import { redirect } from "next/navigation";

export default async function MemberDashboardPage() {
  // Redirect /member to site root — members should use public website per new role flow
  redirect("/");
}
