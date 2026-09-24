import React from "react";
import { Metadata } from "next";
import Hero from "@/app/components/Home/Hero";
import Services from "@/app/components/Home/Services";
import Workflow from "@/app/components/Home/Workflow";
import Features from "@/app/components/Home/Features";
import ProductDoc from "@/app/components/Home/ProductDoc";
import Technologies from "@/app/components/Home/Technologies";
import FAQ from "@/app/components/Home/FAQ";
import Info from "@/app/components/Home/Info";
import Testimonials from "@/app/components/Home/Testimonials";
import Partners from "@/app/components/Home/Partner";
import CTASection from "@/app/components/Home/CTASection";

export const metadata: Metadata = {
  title: "Appsica | Enterprise Custom Software & Cloud Solutions",
  description: "Appsica delivers scalable custom software, mobile applications, and strategic IT consulting. Partner with us to drive digital innovation for your business.",
  keywords: ["Custom Software", "Cloud Architecture", "Mobile App Development", "IT Consulting", "Appsica"],
  openGraph: {
    title: "Appsica | Enterprise Custom Software Solutions",
    description: "Partner with Appsica to build scalable digital solutions and accelerate your business growth.",
    url: "https://appsica.com",
    siteName: "Appsica",
    type: "website",
  }
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <ProductDoc />
      <Technologies />
      <Workflow />
      <Features />
      {/* <FAQ /> */}
      <Info />
      <Testimonials />
      <Partners />
      <CTASection />
    </main>
  );
}
