"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";

export async function loginAction(formData: FormData) {
  const callback = String(formData.get("callbackUrl") || "");

  try {
    // Perform sign-in without an immediate redirect so we can inspect role
    const signInResult = await signIn("credentials", {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      redirect: false,
    });

    // If signIn returned an error, return early so client-side shows failure
    if (signInResult && (signInResult as any).error) {
      return;
    }

    // Read server session to determine role
    let session = await auth();
    let role = session?.user?.role as string | undefined;
    console.log("post-signin session.user.role:", role);

    // If session didn't reflect role yet (race), fall back to DB lookup by email
    if (!role) {
      try {
        const { prisma } = await import("@/lib/db/prisma");
        const email = String(formData.get("email") || "");
        if (email) {
          const user = await prisma.user.findUnique({ where: { email }, include: { role: true } });
          role = user?.role?.name as string | undefined;
          console.log("fallback db role:", role);
        }
      } catch (e) {
        // ignore fallback errors
        console.error("role fallback error", e);
      }

      // Re-read session once more in case NextAuth updated it
      session = await auth();
      role = role || (session?.user?.role as string | undefined);
    }

    // If a callback was provided by middleware, honor it for admin roles
    // Members should always land on public root (no member dashboard)
    if (callback) {
      try {
        const cb = String(callback);
        // Prevent sending MEMBER to /member even if callback existed
        if (role === "MEMBER") {
          redirect("/");
          return;
        }

        // For ADMIN/SUPER_ADMIN, honor callback (it may be a dashboard path)
        if (role === "SUPER_ADMIN" || role === "ADMIN") {
          redirect(cb);
          return;
        }
      } catch (e) {
        // fallback behavior below
      }
    }

    // Route admins to /dashboard, members to public root
    if (role === "SUPER_ADMIN" || role === "ADMIN") {
      redirect("/dashboard");
      return;
    }

    redirect("/");
  } catch (error) {
    if (error instanceof AuthError) {
      return;
    }

    throw error;
  }
}
