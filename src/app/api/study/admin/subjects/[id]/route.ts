import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Subject from "@/models/study/Subject";
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
    const { name, code, semesterId, description, thumbnail, published } = body;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const subject = await Subject.findByIdAndUpdate(
      id,
      {
        name,
        code,
        semesterId,
        description,
        thumbnail,
        slug,
        published: published !== undefined ? published : true,
      },
      { new: true }
    );

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json({ subject });
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
    const subject = await Subject.findByIdAndDelete(id);

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
