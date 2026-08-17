import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Card from "@/models/Card";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await dbConnect();
    const card = await Card.findById(id);

    if (!card) {
      return new Response("Card not found", { status: 404 });
    }

    const vcardContent = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${card.name || "Contact"};;;;`,
      `FN:${card.name || "Contact"}`,
      card.title ? `TITLE:${card.title}` : "",
      card.company ? `ORG:${card.company}` : "",
      card.phone ? `TEL;TYPE=CELL:${card.phone}` : "",
      card.email ? `EMAIL;TYPE=INTERNET:${card.email}` : "",
      card.website ? `URL:${card.website}` : "",
      card.location ? `ADR;TYPE=WORK:;;${card.location};;;;` : "",
      "END:VCARD"
    ].filter(Boolean).join("\n");

    const safeUsername = (card.username || "contact").replace(/[^a-zA-Z0-9_-]/g, "");

    return new Response(vcardContent, {
      status: 200,
      headers: {
        "Content-Type": "text/vcard; charset=utf-8",
        "Content-Disposition": `attachment; filename="${safeUsername}.vcf"`,
        "Cache-Control": "no-cache"
      }
    });
  } catch (error: any) {
    console.error("vCard generation error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}
