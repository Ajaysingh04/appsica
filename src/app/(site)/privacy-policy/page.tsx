import { Metadata } from "next";
import PrivacyPolicyClient from "@/app/components/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | Appsica Technology",
  description:
    "Read the Privacy Policy of Appsica Technology. Understand how we collect, use, and protect your information across our website, Meta lead forms, phone, email, and WhatsApp communications.",
  keywords: [
    "Privacy Policy Appsica",
    "Appsica Technology Privacy",
    "Data Protection Policy",
    "Appsica IT Solutions Privacy",
    "Terms and Privacy Appsica",
  ],
  openGraph: {
    title: "Privacy Policy | Appsica Technology",
    description:
      "Learn how Appsica Technology collects, safeguards, and processes personal information for inquiries, software engineering consultations, and services.",
    url: "https://appsica.com/privacy-policy",
    siteName: "Appsica Technology",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
