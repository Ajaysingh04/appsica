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
      } catch (cloudErr: unknown) {
        console.error("Cloudinary upload failed:", cloudErr);
        const errMsg = cloudErr instanceof Error ? cloudErr.message : String(cloudErr);
        // On serverless or production, local disk write will fail with EROFS. Return the error directly.
        if (process.env.VERCEL || process.env.NODE_ENV === "production" || process.env.AWS_LAMBDA_FUNCTION_NAME) {
          return NextResponse.json(
            { error: `Cloudinary upload failed: ${errMsg}` },
            { status: 502 }
          );
        }
      }
    }

    // 2. If running on Vercel/production and Cloudinary is missing or failed:
    if (process.env.VERCEL || process.env.NODE_ENV === "production" || process.env.AWS_LAMBDA_FUNCTION_NAME) {
      const missingKeys: string[] = [];
      if (!cloudName) missingKeys.push("CLOUDINARY_CLOUD_NAME");
      if (!apiKey) missingKeys.push("CLOUDINARY_API_KEY");
      if (!apiSecret) missingKeys.push("CLOUDINARY_API_SECRET");

      return NextResponse.json(
        {
          error: `Cloudinary environment variables missing: ${missingKeys.join(", ")}. Vercel serverless environment is read-only and requires Cloudinary. Please add these in Vercel Settings > Environment Variables.`,
        },
        { status: 400 }
      );
    }

    // 3. Local public/uploads fallback (only for local development)
    try {
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
    } catch (writeErr: unknown) {
      const isErofs =
        writeErr instanceof Error &&
        ((writeErr as { code?: string }).code === "EROFS" ||
          writeErr.message.includes("EROFS"));
      if (isErofs) {
        return NextResponse.json(
          {
            error:
              "Read-only filesystem detected. Please configure Cloudinary (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) for file uploads.",
          },
          { status: 500 }
        );
      }
      throw writeErr;
    }
  } catch (e: unknown) {
    console.error("Upload error:", e);
    const message = e instanceof Error ? e.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
