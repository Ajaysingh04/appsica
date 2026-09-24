import { notFound } from "next/navigation";
import { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { defaultPortfolio } from "@/lib/defaultData";
import ProjectDetailClient, { ProjectDetailProps } from "@/app/components/Portfolio/ProjectDetailClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function formatLiveUrl(url?: string) {
  if (!url || !url.trim()) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectDB();
    const p = await Project.findOne({
      slug: slug.toLowerCase(),
      published: true,
      isDemo: { $ne: true },
    })
      .select("title summary")
      .lean();
    if (!p) {
      const fallback = defaultPortfolio.find((item) => item.slug === slug);
      if (fallback) {
        return {
          title: `${fallback.title} | Portfolio Case Study`,
          description: fallback.summary || `${fallback.title} — system architecture and project details.`,
        };
      }
      return { title: "Project Case Study | Appsica" };
    }
    return {
      title: `${p.title} | Portfolio Case Study`,
      description: p.summary || `${p.title} — system architecture and project details.`,
    };
  } catch {
    const fallback = defaultPortfolio.find((item) => item.slug === slug);
    if (fallback) {
      return {
        title: `${fallback.title} | Portfolio Case Study`,
        description: fallback.summary || `${fallback.title} — system architecture and project details.`,
      };
    }
    return { title: "Project Case Study | Appsica" };
  }
}

export default async function PortfolioProjectPage({ params }: Props) {
  const { slug } = await params;
  let project: Record<string, unknown> | null = null;
  try {
    await connectDB();
    const doc = await Project.findOne({
      slug: slug.toLowerCase(),
      published: true,
      isDemo: { $ne: true },
    }).lean();
    project = doc as Record<string, unknown> | null;
  } catch {
    // fallback
  }

  if (!project) {
    const fallback = defaultPortfolio.find((item) => item.slug === slug);
    if (fallback) {
      project = fallback as unknown as Record<string, unknown>;
    } else {
      notFound();
    }
  }

  const doc = project as {
    title: string;
    summary?: string;
    description?: string;
    coverImage: string;
    images?: string[];
    features?: { title: string; description?: string }[];
    techStack?: string[];
    liveLink?: string;
  };

  const projectData: ProjectDetailProps = {
    slug,
    title: doc.title,
    summary: doc.summary,
    description: doc.description,
    coverImage: doc.coverImage,
    images: doc.images,
    features: doc.features,
    techStack: doc.techStack,
    liveLink: formatLiveUrl(doc.liveLink),
  };

  return <ProjectDetailClient project={projectData} />;
}
