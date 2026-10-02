import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import StudyMaterial from "@/models/study/StudyMaterial";
import Subject from "@/models/study/Subject";
import { verifyAdmin } from "@/lib/study/adminAuth";
import { uploadStudyFile, deleteStudyFile } from "@/lib/study/storage";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) return auth.response;

  try {
    const { id } = await params;
    await dbConnect();
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const subjectId = formData.get("subjectId") as string;
    const chapterId = formData.get("chapterId") as string;
    const type = formData.get("type") as string;
    let notebookLmUrl = (formData.get("notebookLmUrl") as string) || "";
    if (notebookLmUrl.trim() && !/^https?:\/\//i.test(notebookLmUrl.trim())) {
      notebookLmUrl = `https://${notebookLmUrl.trim()}`;
    }
    const file = formData.get("file") as File | null;

    const existingMaterial = await StudyMaterial.findById(id);
    if (!existingMaterial) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    let fileUrl = existingMaterial.fileUrl;
    let publicId = existingMaterial.publicId;
    let size = existingMaterial.size;

    if (file) {
      // Remove old file if replaced
      if (existingMaterial.publicId) {
        await deleteStudyFile(existingMaterial.publicId);
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadRes = await uploadStudyFile(buffer, file.name);
      fileUrl = uploadRes.fileUrl;
      publicId = uploadRes.publicId;
      size = uploadRes.size || file.size;
    }

    let targetSemesterId = existingMaterial.semesterId;
    if (subjectId) {
      const sub = await Subject.findById(subjectId);
      if (sub) targetSemesterId = sub.semesterId;
    }

    const updatedMaterial = await StudyMaterial.findByIdAndUpdate(
      id,
      {
        title,
        description,
        subjectId,
        chapterId: chapterId || undefined,
        semesterId: targetSemesterId,
        type,
        fileUrl,
        notebookLmUrl,
        publicId,
        size,
      },
      { new: true }
    );

    return NextResponse.json({ material: updatedMaterial });
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

    const material = await StudyMaterial.findByIdAndDelete(id);
    if (!material) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    if (material.publicId) {
      await deleteStudyFile(material.publicId);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
