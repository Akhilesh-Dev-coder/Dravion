import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Question from "@/models/study/Question";
import { verifyAdmin } from "@/lib/study/adminAuth";

export async function GET() {
  await dbConnect();
  const questions = await Question.find()
    .populate("subjectId", "name code")
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ questions });
}

export async function POST(request: Request) {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) return auth.response;

  try {
    await dbConnect();
    const body = await request.json();
    const { question, answer, subjectId, chapterId, marks, year, isImportant } = body;

    if (!question || !subjectId) {
      return NextResponse.json({ error: "Question text and subject are required" }, { status: 400 });
    }

    const newQuestion = await Question.create({
      question,
      answer,
      subjectId,
      chapterId: chapterId || undefined,
      marks: parseInt(marks || "5"),
      year: year ? parseInt(year) : undefined,
      isImportant: isImportant !== undefined ? isImportant : true,
      published: true,
    });

    return NextResponse.json({ question: newQuestion });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
