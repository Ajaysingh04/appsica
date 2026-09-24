import React from "react";
import ServiceDetail from "@/app/components/ServiceDetail";
import connectDB from "@/lib/mongodb";
import Service from "@/models/Service";
import { defaultServices } from "@/lib/defaultData";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  try {
    const { slug } = await params;
    await connectDB();
    const serviceDoc = (await Service.findOne({ slug }).lean()) as any;
    const service = serviceDoc || defaultServices.find((item) => item.slug === slug);

    if (!service) {
      return {
        title: "Service Not Found | Appsica",
        description: "The requested service could not be found.",
      };
    }

    return {
      title: `${service.title} | Appsica`,
      description: service.description || "Enterprise Software Engineering by Appsica",
    };
  } catch (err) {
    return {
      title: "Services | Appsica",
      description: "Enterprise software development and architecture solutions.",
    };
  }
}

const Page = () => {

  return (
    <ServiceDetail />
  );
};

export default Page;