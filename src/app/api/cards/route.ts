import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Card from "@/models/Card";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    await dbConnect();
    const cards = await Card.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(cards, { status: 200 });
  } catch (error: any) {
    console.error("GET Cards error:", error);
    return NextResponse.json({ error: "Internal server error fetching cards" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { username, name, title, company, bio } = await req.json();

    if (!username || !name) {
      return NextResponse.json({ error: "Username and Full Name are required" }, { status: 400 });
    }

    // Clean and validate username
    const cleanUsername = username.toLowerCase().trim();
    if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
      return NextResponse.json(
        { error: "Username can only contain letters, numbers, underscores, and hyphens" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Enforce global uniqueness on username slugs
    const existingCard = await Card.findOne({ username: cleanUsername });
    if (existingCard) {
      return NextResponse.json({ error: "Username is already registered by another user" }, { status: 400 });
    }

    // Generate unique short code
    let uniqueCode = "";
    let isUnique = false;
    while (!isUnique) {
      uniqueCode = Math.random().toString(36).substring(2, 8);
      const dup = await Card.findOne({ uniqueCode });
      if (!dup) isUnique = true;
    }

    const card = await Card.create({
      userId,
      username: cleanUsername,
      uniqueCode,
      name: name.trim(),
      title: title?.trim() || "",
      company: company?.trim() || "",
      bio: bio?.trim() || "",
      socialLinks: {},
      services: [],
      template: "modern_dark",
      customization: {
        accentColor: "#6366f1",
        fontStyle: "font-sans",
        backgroundStyle: "grid",
        themeMode: "dark",
      },
      isPublic: true,
    });

    return NextResponse.json(card, { status: 201 });
  } catch (error: any) {
    console.error("POST Card error:", error);
    return NextResponse.json({ error: "Internal server error during card creation" }, { status: 500 });
  }
}
