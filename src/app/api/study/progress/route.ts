import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Progress from "@/models/study/Progress";
import StudyMaterial from "@/models/study/StudyMaterial";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get("guestId");

    const userId = session?.user ? (session.user as any).id : guestId;

    if (!userId) {
      return NextResponse.json({ progressList: [], recentMaterial: null });
    }

    const progressList = await Progress.find({ userId })
      .sort({ lastOpenedAt: -1 })
      .populate({
        path: "materialId",
        populate: [
          { path: "subjectId", select: "name code slug" },
          { path: "chapterId", select: "name chapterNumber slug" },
          { path: "semesterId", select: "number name slug" },
        ],
      })
      .lean();

    const recentMaterial = progressList.length > 0 ? progressList[0] : null;

    return NextResponse.json({ progressList, recentMaterial });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { materialId, lastPage, completed, guestId } = body;

    const userId = session?.user ? (session.user as any).id : guestId;

    if (!userId || !materialId) {
      return NextResponse.json({ error: "Missing materialId or userId" }, { status: 400 });
    }

    const material = await StudyMaterial.findById(materialId);
    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    // Increment view count on first open
    await StudyMaterial.findByIdAndUpdate(materialId, { $inc: { viewCount: 1 } });

    const progress = await Progress.findOneAndUpdate(
      { userId, materialId },
      {
        userId,
        materialId,
        subjectId: material.subjectId,
        chapterId: material.chapterId,
        lastPage: lastPage || 1,
        completed: completed || false,
        lastOpenedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ progress });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
