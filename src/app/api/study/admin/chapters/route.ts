import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Chapter from "@/models/study/Chapter";
import { verifyAdmin } from "@/lib/study/adminAuth";

export async function GET() {
  await dbConnect();
  const chapters = await Chapter.find()
    .populate("subjectId", "name code")
    .sort({ chapterNumber: 1 })
    .lean();
  return NextResponse.json({ chapters });
}

export async function POST(request: Request) {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) return auth.response;

  try {
    await dbConnect();
    const body = await request.json();
    const { name, subjectId, description, chapterNumber, published } = body;

    if (!name || !subjectId || !chapterNumber) {
      return NextResponse.json({ error: "Name, subject, and chapter number are required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const chapter = await Chapter.create({
      name,
      subjectId,
      description,
      chapterNumber: parseInt(chapterNumber),
      slug,
      published: published !== undefined ? published : true,
    });

    return NextResponse.json({ chapter });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
