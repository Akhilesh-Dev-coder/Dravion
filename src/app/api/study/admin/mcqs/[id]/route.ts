import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import MCQ from "@/models/study/MCQ";
import { verifyAdmin } from "@/lib/study/adminAuth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) return auth.response;

  try {
    const { id } = await params;
    await dbConnect();
    const body = await request.json();
    const { question, options, correctAnswer, explanation, subjectId, chapterId, difficulty } = body;

    const mcq = await MCQ.findByIdAndUpdate(
      id,
      {
        question,
        options,
        correctAnswer: parseInt(correctAnswer),
        explanation,
        subjectId,
        chapterId: chapterId || undefined,
        difficulty: difficulty || "medium",
      },
      { new: true }
    );

    if (!mcq) {
      return NextResponse.json({ error: "MCQ not found" }, { status: 404 });
    }

    return NextResponse.json({ mcq });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) return auth.response;

  try {
    const { id } = await params;
    await dbConnect();
    const mcq = await MCQ.findByIdAndDelete(id);

    if (!mcq) {
      return NextResponse.json({ error: "MCQ not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
