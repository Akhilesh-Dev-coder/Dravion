import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary if credentials exist
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get("url");

  if (!fileUrl) {
    return new NextResponse("Missing file URL", { status: 400 });
  }

  try {
    // 1. Local Disk File
    if (fileUrl.startsWith("/uploads/study/")) {
      const cleanPath = fileUrl.replace(/^\/uploads\/study\//, "");
      const fullPath = path.join(process.cwd(), "public", "uploads", "study", cleanPath);

      if (!fs.existsSync(fullPath)) {
        return new NextResponse("File not found on server", { status: 404 });
      }

      const fileBuffer = await fs.promises.readFile(fullPath);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${path.basename(fullPath)}"`,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // 2. Data URI
    if (fileUrl.startsWith("data:application/pdf;base64,")) {
      const base64Data = fileUrl.replace("data:application/pdf;base64,", "");
      const fileBuffer = Buffer.from(base64Data, "base64");
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="document.pdf"',
        },
      });
    }

    // 3. Remote Cloudinary or HTTP URL
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      let res: Response | null = null;

      // Special Cloudinary Signed Download Handler
      if (
        fileUrl.includes("cloudinary.com") &&
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ) {
        try {
          const isRaw = fileUrl.includes("/raw/upload/");

          if (isRaw) {
            // Raw files in Cloudinary include their file extension as part of public_id
            const rawMatch = fileUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/i);
            const rawPublicId = rawMatch ? rawMatch[1] : null;

            if (rawPublicId) {
              const signedRawUrl = cloudinary.utils.private_download_url(rawPublicId, "", {
                resource_type: "raw",
                type: "upload",
              });
              res = await fetch(signedRawUrl);
            }
          } else {
            // Non-raw (image/auto) Cloudinary URLs
            const uploadMatch = fileUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.pdf)?$/i);
            const publicId = uploadMatch ? uploadMatch[1] : null;

            if (publicId) {
              // Try fetching via Cloudinary Private Download URL (image resource_type)
              const signedImageUrl = cloudinary.utils.private_download_url(publicId, "pdf", {
                resource_type: "image",
                type: "upload",
              });

              res = await fetch(signedImageUrl);

              // If image fails, try raw resource_type with full public_id
              if (!res.ok) {
                const fullMatch = fileUrl.match(/\/upload\/(?:v\d+\/)?(.+)$/i);
                const fullPublicId = fullMatch ? fullMatch[1] : publicId;
                const signedRawUrl = cloudinary.utils.private_download_url(fullPublicId, "", {
                  resource_type: "raw",
                  type: "upload",
                });
                res = await fetch(signedRawUrl);
              }
            }
          }
        } catch (signedErr) {
          console.error("[Cloudinary Private Download Error]:", signedErr);
        }
      }

      // Fallback: direct HTTP fetch if not Cloudinary or if signed fetch didn't return OK
      if (!res || !res.ok) {
        res = await fetch(fileUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          },
        });
      }

      if (!res.ok) {
        console.error("[PDF Proxy Fetch Failed]:", res.status, res.statusText, fileUrl);
        return new NextResponse(`Failed to fetch remote PDF: ${res.statusText}`, { status: res.status });
      }

      const arrayBuffer = await res.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'inline; filename="document.pdf"',
          "Cache-Control": "public, max-age=3600",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new NextResponse("Invalid PDF URL format", { status: 400 });
  } catch (error: any) {
    console.error("[PDF Proxy Error]:", error);
    return new NextResponse(error.message || "Error proxying PDF file", { status: 500 });
  }
}
