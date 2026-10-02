import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Download from "@/models/study/Download";
import StudyMaterial from "@/models/study/StudyMaterial";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { materialId, guestId } = body;

    const userId = session?.user ? (session.user as any).id : guestId;

    if (!materialId) {
      return NextResponse.json({ error: "Missing materialId" }, { status: 400 });
    }

    // Update download count on StudyMaterial model
    const material = await StudyMaterial.findByIdAndUpdate(
      materialId,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    // Record download analytics
    await Download.create({
      userId: userId || undefined,
      materialId,
    });

    return NextResponse.json({ downloadCount: material?.downloadCount || 1 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
