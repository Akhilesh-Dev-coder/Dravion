import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "admin") {
    return {
      isAdmin: false,
      response: NextResponse.json({ error: "Unauthorized access. Admin role required." }, { status: 403 }),
    };
  }
  return { isAdmin: true, user: session.user };
}
