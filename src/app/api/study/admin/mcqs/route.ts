import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MCQ from "@/models/study/MCQ";
import { verifyAdmin } from "@/lib/study/adminAuth";

export async function GET() {
  await dbConnect();
  const mcqs = await MCQ.find()
    .populate("subjectId", "name code")
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ mcqs });
}

export async function POST(request: Request) {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) return auth.response;

  try {
    await dbConnect();
    const body = await request.json();
    const { question, options, correctAnswer, explanation, subjectId, chapterId, difficulty } = body;

    if (!question || !options || options.length < 2 || correctAnswer === undefined || !subjectId) {
      return NextResponse.json({ error: "Question, at least 2 options, correct answer index, and subject are required" }, { status: 400 });
    }

    const mcq = await MCQ.create({
      question,
      options,
      correctAnswer: parseInt(correctAnswer),
      explanation,
      subjectId,
      chapterId: chapterId || undefined,
      difficulty: difficulty || "medium",
      published: true,
    });

    return NextResponse.json({ mcq });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
