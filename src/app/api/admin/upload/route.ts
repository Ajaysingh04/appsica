import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import { configureCloudinary, cloudinary } from "@/lib/cloudinary";
import { MAX_ADMIN_IMAGE_BYTES, formatMaxImageSizeLabel } from "@/lib/adminUploadLimits";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }
    if (file.size > MAX_ADMIN_IMAGE_BYTES) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${formatMaxImageSizeLabel()} per image.` },
        { status: 400 }
      );
    }

    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. If Cloudinary is fully configured, upload to Cloudinary
    if (cloudName && apiKey && apiSecret) {
      try {
        const base64 = buffer.toString("base64");
        const dataUri = `data:${file.type || "image/jpeg"};base64,${base64}`;

        process.env.CLOUDINARY_CLOUD_NAME = cloudName;
        configureCloudinary();
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: "agency-portfolio",
          resource_type: "auto",
        });

        return NextResponse.json({ url: result.secure_url });
      } catch (cloudErr) {
        console.warn("Cloudinary upload failed, falling back to local storage:", cloudErr);
      }
    }

    // 2. Local public/uploads fallback (guaranteed to work)
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const cleanName = (file.name || "image")
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, "-");
    const uniqueName = `${Date.now()}-${cleanName}`;
    const filePath = path.join(uploadsDir, uniqueName);

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ url: `/uploads/${uniqueName}` });
  } catch (e: unknown) {
    console.error("Upload error:", e);
    const message = e instanceof Error ? e.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
