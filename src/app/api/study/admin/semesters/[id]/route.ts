import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Semester from "@/models/study/Semester";
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
    const { name, number, description, published } = body;

    const semester = await Semester.findByIdAndUpdate(
      id,
      {
        name,
        number: parseInt(number),
        description,
        published: published !== undefined ? published : true,
        slug: `semester-${number}`,
      },
      { new: true }
    );

    if (!semester) {
      return NextResponse.json({ error: "Semester not found" }, { status: 404 });
    }

    return NextResponse.json({ semester });
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
    const semester = await Semester.findByIdAndDelete(id);

    if (!semester) {
      return NextResponse.json({ error: "Semester not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
