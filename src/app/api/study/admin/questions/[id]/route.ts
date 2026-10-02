import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Question from "@/models/study/Question";
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
    const { question, answer, subjectId, chapterId, marks, year, isImportant } = body;

    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      {
        question,
        answer,
        subjectId,
        chapterId: chapterId || undefined,
        marks: parseInt(marks || "5"),
        year: year ? parseInt(year) : undefined,
        isImportant: isImportant !== undefined ? isImportant : true,
      },
      { new: true }
    );

    if (!updatedQuestion) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ question: updatedQuestion });
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
    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
