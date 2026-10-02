import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Subject from "@/models/study/Subject";
import { verifyAdmin } from "@/lib/study/adminAuth";

export async function GET() {
  await dbConnect();
  const subjects = await Subject.find().populate("semesterId", "name number").lean();
  return NextResponse.json({ subjects });
}

export async function POST(request: Request) {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) return auth.response;

  try {
    await dbConnect();
    const body = await request.json();
    const { name, code, semesterId, description, thumbnail, published } = body;

    if (!name || !code || !semesterId) {
      return NextResponse.json({ error: "Name, code, and semester are required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const subject = await Subject.create({
      name,
      code,
      semesterId,
      description,
      thumbnail,
      slug,
      published: published !== undefined ? published : true,
    });

    return NextResponse.json({ subject });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
