import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Card from "@/models/Card";
import Analytics from "@/models/Analytics";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    await dbConnect();
    
    // Find all cards owned by the logged in user
    const userCards = await Card.find({ userId });
    const cardIds = userCards.map((c) => c._id);

    // Aggregate logs by eventType for the user's cards
    const logAggregation = await Analytics.aggregate([
      { $match: { cardId: { $in: cardIds } } },
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 },
        },
      },
    ]);

    const aggregatedStats = {
      views: 0,
      qr_scans: 0,
      whatsapp: 0,
      phone: 0,
      email: 0,
      website: 0,
      social_click: 0,
    };

    logAggregation.forEach((item) => {
      const type = item._id;
      if (type === "view") aggregatedStats.views = item.count;
      else if (type === "qr_scan") aggregatedStats.qr_scans = item.count;
      else if (type === "whatsapp") aggregatedStats.whatsapp = item.count;
      else if (type === "phone") aggregatedStats.phone = item.count;
      else if (type === "email") aggregatedStats.email = item.count;
      else if (type === "website") aggregatedStats.website = item.count;
      else if (type === "social_click") aggregatedStats.social_click = item.count;
    });

    return NextResponse.json({
      cardsCount: userCards.length,
      stats: aggregatedStats,
    }, { status: 200 });
  } catch (error: any) {
    console.error("GET Dashboard stats error:", error);
    return NextResponse.json({ error: "Internal server error fetching dashboard stats" }, { status: 500 });
  }
}
