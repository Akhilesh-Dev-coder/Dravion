import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/study/Chapter";
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
    const { name, subjectId, description, chapterNumber, published } = body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const chapter = await Chapter.findByIdAndUpdate(
      id,
      {
        name,
        subjectId,
        description,
        chapterNumber: parseInt(chapterNumber),
        slug,
        published: published !== undefined ? published : true,
      },
      { new: true }
    );

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    return NextResponse.json({ chapter });
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
    const chapter = await Chapter.findByIdAndDelete(id);

    if (!chapter) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
