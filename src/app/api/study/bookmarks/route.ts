import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Bookmark from "@/models/study/Bookmark";
import StudyMaterial from "@/models/study/StudyMaterial";
import Subject from "@/models/study/Subject";
import Chapter from "@/models/study/Chapter";

export async function GET(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const guestId = searchParams.get("guestId");

    const userId = session?.user ? (session.user as any).id : guestId;

    if (!userId) {
      return NextResponse.json({ bookmarks: [] });
    }

    const bookmarks = await Bookmark.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // Populate materials, subjects, chapters details
    const populated = await Promise.all(
      bookmarks.map(async (b) => {
        let details = null;
        if (b.targetType === "material") {
          details = await StudyMaterial.findById(b.targetId)
            .populate("subjectId", "name code slug")
            .populate("chapterId", "name chapterNumber slug")
            .lean();
        } else if (b.targetType === "subject") {
          details = await Subject.findById(b.targetId).lean();
        } else if (b.targetType === "chapter") {
          details = await Chapter.findById(b.targetId).lean();
        }
        return {
          ...b,
          details,
        };
      })
    );

    return NextResponse.json({ bookmarks: populated.filter((b) => b.details) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { targetId, targetType, guestId } = body;

    const userId = session?.user ? (session.user as any).id : guestId;

    if (!userId || !targetId || !targetType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await Bookmark.findOne({ userId, targetId, targetType });

    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      return NextResponse.json({ bookmarked: false });
    } else {
      await Bookmark.create({ userId, targetId, targetType });
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
