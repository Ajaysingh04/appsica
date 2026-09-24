import { Metadata } from "next";
import AboutUsClient from "@/app/components/About";

export const metadata: Metadata = {
  title: "About Us | Elite Software Engineering & Cloud Consulting | Appsica",
  description:
    "Learn about Appsica Technologies—an elite software engineering company specializing in high-performance web applications, scalable cloud architecture, enterprise systems, and custom AI integrations.",
  keywords: [
    "About Appsica",
    "IT Company",
    "Software Engineering Firm",
    "Cloud Consulting",
    "Enterprise Web Development",
    "Appsica Technologies",
  ],
  openGraph: {
    title: "About Appsica Technologies | Engineering Digital Excellence",
    description:
      "We design, build, and scale mission-critical digital products for ambitious enterprises and high-growth startups globally.",
    url: "https://appsica.com/about",
    siteName: "Appsica Technologies",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutUsClient />;
}
