import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import StudyMaterial, { MaterialType } from "@/models/study/StudyMaterial";
import Subject from "@/models/study/Subject";
import { verifyAdmin } from "@/lib/study/adminAuth";
import { uploadStudyFile } from "@/lib/study/storage";

export async function GET() {
  await dbConnect();
  const materials = await StudyMaterial.find()
    .populate("subjectId", "name code")
    .populate("chapterId", "name chapterNumber")
    .populate("semesterId", "number name")
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json({ materials });
}

export async function POST(request: Request) {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) return auth.response;

  try {
    await dbConnect();
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const semesterId = formData.get("semesterId") as string;
    const subjectId = formData.get("subjectId") as string;
    const chapterId = formData.get("chapterId") as string;
    const type = (formData.get("type") as MaterialType) || "notes";
    let notebookLmUrl = (formData.get("notebookLmUrl") as string) || "";
    if (notebookLmUrl.trim() && !/^https?:\/\//i.test(notebookLmUrl.trim())) {
      notebookLmUrl = `https://${notebookLmUrl.trim()}`;
    }
    const file = formData.get("file") as File | null;

    if (!title || !subjectId || !type) {
      return NextResponse.json({ error: "Title, Subject, and Material Type are required" }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: "PDF file upload is required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadRes = await uploadStudyFile(buffer, file.name);

    // Lookup subject if semesterId not provided directly
    let targetSemesterId = semesterId;
    if (!targetSemesterId) {
      const sub = await Subject.findById(subjectId);
      if (sub) targetSemesterId = sub.semesterId.toString();
    }

    const material = await StudyMaterial.create({
      title,
      description,
      chapterId: chapterId || undefined,
      subjectId,
      semesterId: targetSemesterId,
      type: type as MaterialType,
      fileUrl: uploadRes.fileUrl,
      notebookLmUrl,
      publicId: uploadRes.publicId,
      size: uploadRes.size || file.size,
      published: true,
    });

    return NextResponse.json({ material });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
