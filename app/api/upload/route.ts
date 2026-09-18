import { NextResponse } from "next/server";
import { uploadToR2 } from "@/lib/r2";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No image file provided for upload" },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type '${file.type}'. Please upload a PNG, JPEG, WEBP, or GIF image.`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds the 10MB limit." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const folder = (formData.get("folder") as string) || "discussions";

    const result = await uploadToR2(buffer, file.name, file.type, folder);

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (error: any) {
    console.error("Cloudflare R2 upload error:", error);
    return NextResponse.json(
      {
        error: error?.message || "Failed to upload image to Cloudflare R2 storage",
      },
      { status: 500 }
    );
  }
}
