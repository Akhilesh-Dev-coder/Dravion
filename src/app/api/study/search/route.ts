import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Semester from "@/models/study/Semester";
import Subject from "@/models/study/Subject";
import Chapter from "@/models/study/Chapter";
import StudyMaterial from "@/models/study/StudyMaterial";
import Question from "@/models/study/Question";
import { ensureSeedData } from "@/lib/study/seed";

export async function GET(request: Request) {
  try {
    await dbConnect();
    await ensureSeedData();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        subjects: [],
        chapters: [],
        materials: [],
        questions: [],
      });
    }

    const regex = new RegExp(query.trim(), "i");

    const [subjects, chapters, materials, questions] = await Promise.all([
      Subject.find({ $or: [{ name: regex }, { code: regex }, { description: regex }], published: true })
        .populate("semesterId", "name number slug")
        .limit(10)
        .lean(),
      Chapter.find({ name: regex, published: true })
        .populate("subjectId", "name code slug")
        .limit(10)
        .lean(),
      StudyMaterial.find({ $or: [{ title: regex }, { description: regex }], published: true })
        .populate("subjectId", "name code slug")
        .populate("chapterId", "name chapterNumber slug")
        .populate("semesterId", "number name slug")
        .limit(15)
        .lean(),
      Question.find({ question: regex, published: true })
        .populate("subjectId", "name code slug")
        .limit(10)
        .lean(),
    ]);

    return NextResponse.json({
      subjects,
      chapters,
      materials,
      questions,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Search failed" }, { status: 500 });
  }
}
