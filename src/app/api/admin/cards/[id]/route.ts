import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Card from "@/models/Card";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;
    const { isPublic } = await req.json();

    await dbConnect();

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { $set: { isPublic } },
      { new: true }
    );

    if (!updatedCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json(updatedCard, { status: 200 });
  } catch (error: any) {
    console.error("Admin PUT Card error:", error);
    return NextResponse.json({ error: "Server error during card status toggle" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();

    const deletedCard = await Card.findByIdAndDelete(id);

    if (!deletedCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Card deleted successfully by administrator" }, { status: 200 });
  } catch (error: any) {
    console.error("Admin DELETE Card error:", error);
    return NextResponse.json({ error: "Server error during admin card deletion" }, { status: 500 });
  }
}
