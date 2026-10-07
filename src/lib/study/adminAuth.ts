import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function verifyAdmin() {
  // 1. Allow seamless admin access if explicitly bypassed in env vars or local dev
  if (
    process.env.ALLOW_ADMIN_BYPASS === "true" ||
    process.env.DISABLE_ADMIN_AUTH === "true" ||
    process.env.NODE_ENV === "development"
  ) {
    return { isAdmin: true, user: { name: "Admin User", role: "admin" } };
  }

  // 2. Check NextAuth session
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  const isEmailAdmin =
    Boolean(adminEmail) &&
    Boolean(user?.email) &&
    user.email.toLowerCase() === adminEmail!.toLowerCase();

  const isRoleAdmin = user?.role === "admin";

  const isAdmin = isRoleAdmin || isEmailAdmin;

  if (!session || !isAdmin) {
    let message = "Unauthorized access. Admin privileges required.";
    if (!session) {
      message = "Please log in with your admin account to perform admin actions.";
    } else if (adminEmail) {
      message = `Logged in as '${user?.email}'. This email is not authorized as admin (expected: ${adminEmail}).`;
    }

    return {
      isAdmin: false,
      response: NextResponse.json({ error: message }, { status: 403 }),
    };
  }

  return { isAdmin: true, user: session.user };
}
