import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Card from "@/models/Card";
import Analytics from "@/models/Analytics";

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

    // Prevent admin from deleting their own account
    if (id === (session.user as any).id) {
      return NextResponse.json({ error: "You cannot delete your own administrator account" }, { status: 400 });
    }

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find and delete all cards and associated analytics owned by this user
    const cards = await Card.find({ userId: id });
    const cardIds = cards.map(c => c._id);

    await Promise.all([
      Analytics.deleteMany({ cardId: { $in: cardIds } }),
      Card.deleteMany({ userId: id }),
      User.findByIdAndDelete(id)
    ]);

    return NextResponse.json({ message: "User account and all associated cards deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Admin DELETE User error:", error);
    return NextResponse.json({ error: "Server error during user deletion" }, { status: 500 });
  }
}
