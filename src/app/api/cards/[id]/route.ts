import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Card from "@/models/Card";

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
    const card = await Card.findOne({ _id: id, userId });

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    if (!card.uniqueCode) {
      let uniqueCode = "";
      let isUnique = false;
      while (!isUnique) {
        uniqueCode = Math.random().toString(36).substring(2, 8);
        const dup = await Card.findOne({ uniqueCode });
        if (!dup) isUnique = true;
      }
      card.uniqueCode = uniqueCode;
      await card.save();
    }

    return NextResponse.json(card, { status: 200 });
  } catch (error: any) {
    console.error("GET Card details error:", error);
    return NextResponse.json({ error: "Internal server error fetching details" }, { status: 500 });
  }
}

export async function PUT(
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
    const updateData = await req.json();

    await dbConnect();

    // Verify card ownership
    const card = await Card.findOne({ _id: id, userId });
    if (!card) {
      return NextResponse.json({ error: "Card not found or unauthorized" }, { status: 404 });
    }

    // Prevent updating read-only/immutable fields
    const { _id, userId: cardUserId, uniqueCode, createdAt, updatedAt, __v, ...cleanUpdateData } = updateData;

    // Handle username slug changes
    if (cleanUpdateData.username && cleanUpdateData.username !== card.username) {
      const cleanUsername = cleanUpdateData.username.toLowerCase().trim();
      if (!/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
        return NextResponse.json(
          { error: "Username can only contain letters, numbers, underscores, and hyphens" },
          { status: 400 }
        );
      }

      const existingCard = await Card.findOne({ username: cleanUsername });
      if (existingCard && existingCard._id.toString() !== id) {
        return NextResponse.json({ error: "Username is already registered" }, { status: 400 });
      }
      cleanUpdateData.username = cleanUsername;
    }

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { $set: cleanUpdateData },
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedCard, { status: 200 });
  } catch (error: any) {
    console.error("PUT Card error:", error);
    return NextResponse.json({ error: "Internal server error during card update" }, { status: 500 });
  }
}

export async function DELETE(
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

    // Verify card ownership and delete card
    const card = await Card.findOneAndDelete({ _id: id, userId });

    if (!card) {
      return NextResponse.json({ error: "Card not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Card deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE Card error:", error);
    return NextResponse.json({ error: "Internal server error during card deletion" }, { status: 500 });
  }
}
