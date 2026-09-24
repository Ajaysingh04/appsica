import { Metadata } from "next";
import CareersClient from "@/app/components/Careers";

export const metadata: Metadata = {
  title: "Careers at Appsica | Join Our Elite Software Engineering Team",
  description:
    "Explore high-impact career opportunities at Appsica Technologies. Join our engineering hub at Ahinsha Tower F7, MG Road, Indore or hybrid. Work on high-scale web apps, cloud infrastructure, and AI systems with high-performance workstations and competitive pay.",
  keywords: [
    "Careers at Appsica",
    "Software Engineer Jobs Indore",
    "Next.js Developer Jobs",
    "Cloud Architect Jobs",
    "Mobile Developer Jobs",
    "Indore IT Jobs",
    "Appsica Hiring",
    "Tech Jobs MG Road Indore",
  ],
  openGraph: {
    title: "Careers at Appsica | Supercharge Your Engineering Career",
    description:
      "Join an elite squad of engineers building next-generation digital products. Top-spec workstations, zero corporate bureaucracy, and rapid career growth.",
    url: "https://appsica.com/careers",
    siteName: "Appsica Technologies",
    type: "website",
  },
};

export default function CareersPage() {
  return <CareersClient />;
}
