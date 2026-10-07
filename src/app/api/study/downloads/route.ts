import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Download from "@/models/study/Download";
import StudyMaterial from "@/models/study/StudyMaterial";
import Semester from "@/models/study/Semester";
import Subject from "@/models/study/Subject";
import Chapter from "@/models/study/Chapter";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get("guestId");

    const userId = session?.user ? (session.user as any).id : guestId;

    let userDownloads: any[] = [];
    if (userId) {
      const records = await Download.find({ userId })
        .sort({ createdAt: -1 })
        .populate({
          path: "materialId",
          populate: [
            { path: "subjectId", select: "name code slug" },
            { path: "chapterId", select: "name chapterNumber slug" },
            { path: "semesterId", select: "number name slug" },
          ],
        })
        .lean();

      userDownloads = records.map((r) => r.materialId).filter(Boolean);
    }

    const popularMaterials = await StudyMaterial.find({ published: true, downloadCount: { $gt: 0 } })
      .populate("subjectId", "name code slug")
      .populate("chapterId", "name chapterNumber slug")
      .populate("semesterId", "number name slug")
      .sort({ downloadCount: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ userDownloads, popularMaterials });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
