import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Semester from "@/models/study/Semester";
import { verifyAdmin } from "@/lib/study/adminAuth";

export async function GET() {
  await dbConnect();
  const semesters = await Semester.find().sort({ number: 1 }).lean();
  return NextResponse.json({ semesters });
}

export async function POST(request: Request) {
  const auth = await verifyAdmin();
  if (!auth.isAdmin) return auth.response;

  try {
    await dbConnect();
    const body = await request.json();
    const { name, number, description, published } = body;

    if (!name || !number) {
      return NextResponse.json({ error: "Name and semester number are required" }, { status: 400 });
    }

    const slug = `semester-${number}`;
    const semester = await Semester.create({
      name,
      number: parseInt(number),
      description,
      published: published !== undefined ? published : true,
      slug,
    });

    return NextResponse.json({ semester });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
