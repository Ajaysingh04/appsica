import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary() {
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  cloudinary.config({
    cloud_name: cloudName,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export function extractCloudinaryPublicId(url: string): string | null {
  try {
    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName || !url.includes("res.cloudinary.com")) return null;
    const marker = `/res.cloudinary.com/${cloudName}/image/upload/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    let rest = url.slice(idx + marker.length);
    // Strip transformation segment if present.
    if (rest.startsWith("v")) {
      const slash = rest.indexOf("/");
      if (slash !== -1) rest = rest.slice(slash + 1);
    }
    // Remove extension.
    rest = rest.replace(/\.[a-zA-Z0-9]+$/, "");
    return rest || null;
  } catch {
    return null;
  }
}

export async function deleteCloudinaryImageByUrl(url: string) {
  const publicId = extractCloudinaryPublicId(url);
  if (!publicId) return;
  configureCloudinary();
  await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
}

export { cloudinary };
