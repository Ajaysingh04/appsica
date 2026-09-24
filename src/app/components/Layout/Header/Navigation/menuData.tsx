import { HeaderItem } from "../../../../types/menu";

type ServiceMenuItem = {
  title: string;
  slug: string;
};

export const getHeaderData = (services: ServiceMenuItem[] = []): HeaderItem[] => {
  const serviceSubmenu =
    services.length > 0
      ? services.map((service) => ({
          label: service.title,
          href: `/services/${service.slug}`,
        }))
      : [{ label: "Services", href: "/services" }];

  return [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Projects", href: "/portfolio" },
    {
      label: "Services",
      href: "/services",
      submenu: serviceSubmenu,
      cta: { label: "All Services", href: "/services" },
    },
    { label: "Blogs", href: "/blogs" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ];
};
