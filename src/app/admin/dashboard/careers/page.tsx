import { Metadata } from "next";
import CareersDashboardClient from "./CareersDashboardClient";

export const metadata: Metadata = {
  title: "Careers & Hiring Console | Appsica Admin",
};

export default function AdminCareersPage() {
  return <CareersDashboardClient />;
}
