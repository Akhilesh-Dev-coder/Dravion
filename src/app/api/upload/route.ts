import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn("WARNING: Cloudinary credentials not defined. Profile uploads will fallback to mock URLs.");
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file selected for upload" }, { status: 400 });
    }

    // Standard client image format checking
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File type must be an image" }, { status: 400 });
    }

    // Limit files to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image size cannot exceed 5MB" }, { status: 400 });
    }

    // Fallback Mock URL generation if environment variables are not yet present
    if (!isCloudinaryConfigured) {
      await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate networking
      const randomSeed = Math.floor(Math.random() * 100000);
      const mockAvatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`;
      
      return NextResponse.json(
        { url: mockAvatarUrl, public_id: `mock_id_${randomSeed}` },
        { status: 200 }
      );
    }

    // Convert file object to buffer stream for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "dravion_profile_images",
            transformation: [{ width: 400, height: 400, crop: "thumb", gravity: "face" }],
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    return NextResponse.json(
      { url: uploadResult.secure_url, public_id: uploadResult.public_id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Upload endpoint error:", error);
    return NextResponse.json({ error: "Server error during media upload" }, { status: 500 });
  }
}
