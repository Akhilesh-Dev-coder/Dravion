import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Card from "@/models/Card";
import Analytics from "@/models/Analytics";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as any).id;

    await dbConnect();

    // Verify card ownership
    const card = await Card.findOne({ _id: id, userId });
    if (!card) {
      return NextResponse.json({ error: "Card not found or unauthorized" }, { status: 404 });
    }

    // Aggregate log counters by type
    const logs = await Analytics.aggregate([
      { $match: { cardId: card._id } },
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      views: 0,
      qr_scans: 0,
      whatsapp: 0,
      phone: 0,
      email: 0,
      website: 0,
      social_click: 0
    };

    logs.forEach((item) => {
      const type = item._id;
      if (type === "view") stats.views = item.count;
      else if (type === "qr_scan") stats.qr_scans = item.count;
      else if (type === "whatsapp") stats.whatsapp = item.count;
      else if (type === "phone") stats.phone = item.count;
      else if (type === "email") stats.email = item.count;
      else if (type === "website") stats.website = item.count;
      else if (type === "social_click") stats.social_click = item.count;
    });

    return NextResponse.json({
      cardName: card.name,
      username: card.username,
      stats
    }, { status: 200 });
  } catch (error: any) {
    console.error("GET Card stats error:", error);
    return NextResponse.json({ error: "Internal server error fetching card stats" }, { status: 500 });
  }
}
