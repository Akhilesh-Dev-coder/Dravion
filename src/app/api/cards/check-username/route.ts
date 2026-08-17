import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Card from "@/models/Card";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const cleanUsername = username.toLowerCase().trim();
    if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
      return NextResponse.json(
        { available: false, error: "Only letters, numbers, underscores, and hyphens are allowed" },
        { status: 400 }
      );
    }

    await dbConnect();
    const existingCard = await Card.findOne({ username: cleanUsername });

    if (existingCard) {
      return NextResponse.json({ available: false, message: "Username is already taken" }, { status: 200 });
    }

    return NextResponse.json({ available: true, message: "Username is available" }, { status: 200 });
  } catch (error: any) {
    console.error("Check username endpoint error:", error);
    return NextResponse.json({ error: "Internal server error checking username" }, { status: 500 });
  }
}
