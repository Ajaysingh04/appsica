import { Metadata } from "next";
import PrivacyPolicyClient from "@/app/components/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy | Appsica Technology",
  description:
    "Read the Privacy Policy of Appsica Technology. Understand how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return <PrivacyPolicyClient />;
}
