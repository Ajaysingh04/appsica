import mongoose, { Schema, models, model } from "mongoose";

const SiteSettingsSchema = new Schema(
  {
    companyName: { type: String, default: "Appsica Technologies" },
    tagline: { type: String, default: "Enterprise Custom Software & Cloud Solutions" },
    phone: { type: String, default: "+91 9691847671" },
    whatsapp: { type: String, default: "+91 9691847671" },
    emails: {
      type: [String],
      default: ["contact@appsica.com", "hr@appsica.com"],
    },
    address: {
      type: String,
      default: "F7, Second Floor, Ahinsa Tower, MG Road Indore, Madhya Pradesh 452001",
    },
    mapUrl: {
      type: String,
      default:
        "https://www.google.com/maps/search/?api=1&query=F7,+Second+Floor,+Ahinsa+Tower,+MG+Road+Indore,+Madhya+Pradesh+452001",
    },
    socialLinks: {
      instagram: {
        type: String,
        default: "https://www.instagram.com/appsica_technology/?hl=en",
      },
      linkedin: {
        type: String,
        default: "https://www.linkedin.com/company/appsica/?viewAsMember=true",
      },
      facebook: {
        type: String,
        default: "https://www.facebook.com/profile.php?id=61591531577413",
      },
    },
    hero: {
      badge: { type: String, default: "Trusted IT Partner" },
      titlePrefix: { type: String, default: "Empowering Your" },
      titleHighlight: { type: String, default: "Digital Transformation" },
      description: {
        type: String,
        default:
          "Appsica delivers enterprise-grade custom software, cloud architecture, and strategic IT consulting to scale your business into the future.",
      },
      videoUrl: {
        type: String,
        default:
          "https://v1.pinimg.com/videos/mc/720p/44/e9/78/44e9787fdeeebbdb66fd50cf1aaab09e.mp4",
      },
    },
    servicesSection: {
      badge: { type: String, default: "Services We Provide" },
      title: { type: String, default: "Smart Solutions for Modern Enterprise" },
      viewAllText: { type: String, default: "All Services" },
    },
    portfolioSection: {
      badge: { type: String, default: "Project Portfolio" },
      title: { type: String, default: "Our Portfolio" },
      subtitle: { type: String, default: "Showcase of Our Projects." },
    },
    technologiesSection: {
      badge: { type: String, default: "Technology Stack" },
      title: { type: String, default: "Technologies We Use" },
      description: {
        type: String,
        default:
          "We leverage the latest and most reliable technologies to build scalable and robust solutions for your business.",
      },
    },
    workflowSection: {
      badge: { type: String, default: "Workflow" },
      title: { type: String, default: "How We Work" },
      description: {
        type: String,
        default:
          "Our 7-step proven process takes your idea from concept to a successful reality. Click on any step to view details.",
      },
    },
    partnersSection: {
      badge: { type: String, default: "Trusted By Innovative Companies" },
      description: {
        type: String,
        default: "Powering next-generation digital products for industry leaders worldwide.",
      },
    },
    ctaSection: {
      title: { type: String, default: "Ready to Transform Your Business?" },
      description: {
        type: String,
        default:
          "Let's build your next application together. Partner with Appsica to drive digital innovation, scale your infrastructure, and achieve your business goals.",
      },
      primaryButtonText: { type: String, default: "Contact Sales" },
      primaryButtonLink: { type: String, default: "/contact" },
      secondaryButtonText: { type: String, default: "View Our Services" },
      secondaryButtonLink: { type: String, default: "/services" },
    },
    footer: {
      aboutText: {
        type: String,
        default:
          "Appsica builds custom software solutions that help your business grow and succeed in the digital world.",
      },
      copyrightText: {
        type: String,
        default: "© 2026 - All Rights Reserved by Appsica Technologies",
      },
    },
  },
  { timestamps: true }
);

export default models.SiteSettings || model("SiteSettings", SiteSettingsSchema);
