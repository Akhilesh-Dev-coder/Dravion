import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Configure Cloudinary if env vars are present
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

export interface UploadResult {
  fileUrl: string;
  publicId: string;
  size?: number;
}

/**
 * Storage Abstraction Layer
 * Uploads PDF files directly to Cloudinary or falls back to local disk storage.
 * Ensures the generated PDF URL is valid, clean, and publicly viewable.
 */
export async function uploadStudyFile(
  fileBuffer: Buffer,
  filename: string,
  folder: string = "dravion_study"
): Promise<UploadResult> {
  const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const uniqueName = `${Date.now()}_${cleanFilename}`;
  const basePublicId = uniqueName.toLowerCase().endsWith(".pdf")
    ? uniqueName.slice(0, -4)
    : uniqueName;

  // 1. Cloudinary Upload Driver
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    try {
      const cloudinaryResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: "raw",
            type: "upload",
            access_mode: "public",
            public_id: basePublicId,
            format: "pdf",
          },
          (error, result) => {
            if (error || !result) {
              console.error("[Cloudinary Error]", error);
              return reject(error || new Error("Cloudinary upload stream failed"));
            }
            resolve(result);
          }
        );
        uploadStream.end(fileBuffer);
      });

      let secureUrl = cloudinaryResult.secure_url;
      if (!secureUrl.toLowerCase().endsWith(".pdf")) {
        secureUrl = `${secureUrl}.pdf`;
      }

      console.log("[Cloudinary Upload Success]:", secureUrl);

      return {
        fileUrl: secureUrl,
        publicId: cloudinaryResult.public_id,
        size: cloudinaryResult.bytes || fileBuffer.length,
      };
    } catch (cloudinaryErr: any) {
      console.warn(
        "[Cloudinary Upload Failed, Falling back to local disk]:",
        cloudinaryErr?.message || cloudinaryErr
      );
      // Fallthrough to local disk upload fallback if Cloudinary stream fails
    }
  }

  // 2. Local Disk Storage Driver (Saves file under public/uploads/study/)
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads", "study");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const diskFileName = `${uniqueName}.pdf`;
    const filePath = path.join(uploadDir, diskFileName);
    fs.writeFileSync(filePath, fileBuffer);

    const relativeUrl = `/uploads/study/${diskFileName}`;
    console.log("[Local Disk Upload Success]:", relativeUrl);

    return {
      fileUrl: relativeUrl,
      publicId: `local_${diskFileName}`,
      size: fileBuffer.length,
    };
  } catch (diskErr: any) {
    console.error("[Local Disk Write Failed]:", diskErr);
    
    // Safety check for base64 payload size limit on serverless hosts
    if (fileBuffer.length > 10 * 1024 * 1024) {
      throw new Error(
        "PDF file is too large (>10MB) for serverless memory storage. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your hosting environment variables."
      );
    }

    // 3. Ultimate Fallback: Data URI
    const base64Data = fileBuffer.toString("base64");
    return {
      fileUrl: `data:application/pdf;base64,${base64Data}`,
      publicId: `data_${Date.now()}_${cleanFilename}`,
      size: fileBuffer.length,
    };
  }
}

export async function deleteStudyFile(publicId: string): Promise<boolean> {
  if (!publicId) return true;

  if (publicId.startsWith("local_")) {
    try {
      const filename = publicId.replace("local_", "");
      const filePath = path.join(process.cwd(), "public", "uploads", "study", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return true;
    } catch {
      return false;
    }
  }

  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: "auto" });
      await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
      await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
      return true;
    } catch {
      return false;
    }
  }

  return true;
}
