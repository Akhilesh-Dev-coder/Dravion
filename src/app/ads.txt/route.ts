import { NextResponse } from "next/server";

export async function GET() {
  const content = "google.com, pub-1988525992738589, DIRECT, f08c47fec0942fa0\n";
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
