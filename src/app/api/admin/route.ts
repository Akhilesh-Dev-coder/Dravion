import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Card from "@/models/Card";
import Analytics from "@/models/Analytics";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Secure auth check for admin role only
    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();

    const [totalUsers, totalCards, totalViews, totalScans] = await Promise.all([
      User.countDocuments(),
      Card.countDocuments(),
      Analytics.countDocuments({ eventType: "view" }),
      Analytics.countDocuments({ eventType: "qr_scan" })
    ]);

    const [users, cards] = await Promise.all([
      User.find().select("-passwordHash").sort({ createdAt: -1 }),
      Card.find().populate("userId", "name email").sort({ createdAt: -1 })
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalCards,
        totalViews,
        totalScans
      },
      users,
      cards
    }, { status: 200 });
  } catch (error: any) {
    console.error("GET Admin data error:", error);
    return NextResponse.json({ error: "Internal server error compiling admin logs" }, { status: 500 });
  }
}
