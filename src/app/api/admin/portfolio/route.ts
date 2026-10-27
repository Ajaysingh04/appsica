import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/requireAdmin";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const projects = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ projects });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load projects." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    const rawSlug = String(body.slug || "").trim();
    let slug = rawSlug ? slugify(rawSlug) : slugify(title);
    const summary = String(body.summary || "").trim();
    const description = String(body.description || "").trim();
    const coverImage = String(body.coverImage || "").trim();

    let liveLink = String(body.liveLink || "").trim();
    if (liveLink && !/^https?:\/\//i.test(liveLink)) {
      liveLink = `https://${liveLink}`;
    }
    let playStoreUrl = String(body.playStoreUrl || "").trim();
    if (playStoreUrl && !/^https?:\/\//i.test(playStoreUrl)) {
      playStoreUrl = `https://${playStoreUrl}`;
    }
    let appStoreUrl = String(body.appStoreUrl || "").trim();
    if (appStoreUrl && !/^https?:\/\//i.test(appStoreUrl)) {
      appStoreUrl = `https://${appStoreUrl}`;
    }

    const apps = Array.isArray(body.apps)
      ? body.apps
          .map((a: any) => {
            let appLiveLink = String(a.liveLink || "").trim();
            if (appLiveLink && !/^https?:\/\//i.test(appLiveLink)) appLiveLink = `https://${appLiveLink}`;
            let appPlayStore = String(a.playStoreUrl || "").trim();
            if (appPlayStore && !/^https?:\/\//i.test(appPlayStore)) appPlayStore = `https://${appPlayStore}`;
            let appAppStore = String(a.appStoreUrl || "").trim();
            if (appAppStore && !/^https?:\/\//i.test(appAppStore)) appAppStore = `https://${appAppStore}`;

            return {
              role: String(a.role || "customer").trim(),
              title: String(a.title || "").trim(),
              summary: String(a.summary || "").trim(),
              playStoreUrl: appPlayStore,
              appStoreUrl: appAppStore,
              liveLink: appLiveLink,
              icon: String(a.icon || "").trim(),
              images: Array.isArray(a.images) ? a.images.map((img: any) => String(img).trim()).filter(Boolean) : [],
            };
          })
          .filter((a: any) => a.title || a.playStoreUrl || a.liveLink || a.appStoreUrl)
      : [];

    if (!liveLink && apps.length > 0) {
      const found = apps.find((a: any) => a.liveLink);
      if (found) liveLink = found.liveLink;
    }
    if (!playStoreUrl && apps.length > 0) {
      const found = apps.find((a: any) => a.playStoreUrl);
      if (found) playStoreUrl = found.playStoreUrl;
    }
    if (!appStoreUrl && apps.length > 0) {
      const found = apps.find((a: any) => a.appStoreUrl);
      if (found) appStoreUrl = found.appStoreUrl;
    }

    const category = String(body.category || "web").trim();
    const images = Array.isArray(body.images)
      ? body.images.map((u: unknown) => String(u).trim()).filter(Boolean)
      : [];
    const features = Array.isArray(body.features)
      ? body.features.map((f: { title?: string; description?: string }) => ({
          title: String(f.title || "").trim(),
          description: String(f.description || "").trim(),
        }))
      : [];
    const techStack = Array.isArray(body.techStack)
      ? body.techStack.map((t: unknown) => String(t).trim()).filter(Boolean)
      : [];
    const published = Boolean(body.published);
    const isDemo = Boolean(body.isDemo);
    const order = Number(body.order) || 0;

    if (!title) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }
    if (!slug) slug = slugify(title);
    if (!coverImage) {
      return NextResponse.json({ error: "Cover image URL is required." }, { status: 400 });
    }

    await connectDB();
    const project = await Project.create({
      title,
      slug,
      summary,
      description,
      coverImage,
      images,
      features: features.filter((f: { title: string }) => f.title),
      techStack,
      liveLink,
      category,
      playStoreUrl,
      appStoreUrl,
      apps,
      published,
      isDemo,
      order,
    });

    revalidatePath("/portfolio");
    revalidatePath("/");
    revalidatePath(`/portfolio/${project.slug}`);

    return NextResponse.json({ project });
  } catch (e: unknown) {
    const code = (e as { code?: number })?.code;
    if (code === 11000) {
      return NextResponse.json({ error: "Slug already exists. Use a unique slug." }, { status: 409 });
    }
    console.error(e);
    return NextResponse.json({ error: "Failed to create project." }, { status: 500 });
  }
}
