import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Analytics from "@/models/Analytics";
import Card from "@/models/Card";

export async function POST(req: Request) {
  try {
    const { cardId, eventType, metadata } = await req.json();

    if (!cardId || !eventType) {
      return NextResponse.json({ error: "Missing cardId or eventType" }, { status: 400 });
    }

    const validEvents = ["view", "qr_scan", "whatsapp", "phone", "email", "website", "social_click"];
    if (!validEvents.includes(eventType)) {
      return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
    }

    await dbConnect();

    // Verify card exists before logging stats
    const cardExists = await Card.exists({ _id: cardId });
    if (!cardExists) {
      return NextResponse.json({ error: "Card does not exist" }, { status: 404 });
    }

    // Insert log entry
    await Analytics.create({
      cardId,
      eventType,
      metadata: {
        ...metadata,
        userAgent: req.headers.get("user-agent") || "unknown"
      }
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Analytics log error:", error);
    return NextResponse.json({ error: "Internal server error logging stats" }, { status: 500 });
  }
}
