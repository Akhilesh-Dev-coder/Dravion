import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function verifyAdmin() {
  // Allow admin operations seamlessly during local development testing
  if (process.env.NODE_ENV === "development") {
    return { isAdmin: true, user: { name: "Dev Admin", role: "admin" } };
  }

  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  const adminEmail = process.env.ADMIN_EMAIL;

  const isAdmin =
    user?.role === "admin" ||
    (adminEmail && user?.email?.toLowerCase() === adminEmail.toLowerCase());

  if (!session || !isAdmin) {
    return {
      isAdmin: false,
      response: NextResponse.json(
        { error: "Unauthorized access. Admin role required." },
        { status: 403 }
      ),
    };
  }

  return { isAdmin: true, user: session.user };
}
