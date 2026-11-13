export interface IServiceItem {
  title: string;
  slug: string;
  icon: string;
  image: string;
  description: string;
  detail: string;
  features: { title: string; description: string }[];
  demoLinks?: { name: string; url: string }[];
  order?: number;
  published?: boolean;
}

export interface ITechCategory {
  category: string;
  items: { name: string; icon: string }[];
  order?: number;
}

export interface IWorkflowStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  details: string[];
  order?: number;
}

export interface IPartnerItem {
  name?: string;
  image: string;
  url?: string;
}

export interface IPortfolioItem {
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  coverImage: string;
  image?: string;
  images?: string[];
  features?: { title: string; description: string }[];
  techStack?: string[];
  liveLink?: string;
  category?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  apps?: {
    role?: string;
    title: string;
    summary?: string;
    playStoreUrl?: string;
    appStoreUrl?: string;
    liveLink?: string;
    icon?: string;
    images?: string[];
  }[];
  order?: number;
}

export const defaultSiteSettings = {
  companyName: "Appsica Technologies",
  tagline: "Enterprise Custom Software & Cloud Solutions",
  phone: "+91 9691847671",
  whatsapp: "+91 9691847671",
  emails: ["contact@appsica.com", "hr@appsica.com"],
  address: "F7, Second Floor, Ahinsa Tower, MG Road Indore, Madhya Pradesh 452001",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=F7,+Second+Floor,+Ahinsa+Tower,+MG+Road+Indore,+Madhya+Pradesh+452001",
  socialLinks: {
    instagram: "https://www.instagram.com/appsica_technology/?hl=en",
    linkedin: "https://www.linkedin.com/company/appsica/?viewAsMember=true",
    facebook: "https://www.facebook.com/profile.php?id=61591531577413",
  },
  hero: {
    badge: "Trusted IT Partner",
    titlePrefix: "Empowering Your",
    titleHighlight: "Digital Transformation",
    description:
      "Appsica delivers enterprise-grade custom software, cloud architecture, and strategic IT consulting to scale your business into the future.",
    videoUrl:
      "https://v1.pinimg.com/videos/mc/720p/44/e9/78/44e9787fdeeebbdb66fd50cf1aaab09e.mp4",
  },
  servicesSection: {
    badge: "Services We Provide",
    title: "Smart Solutions for Modern Enterprise",
    viewAllText: "All Services",
  },
  portfolioSection: {
    badge: "Project Portfolio",
    title: "Our Portfolio",
    subtitle: "Showcase of Our Projects.",
  },
  technologiesSection: {
    badge: "Technology Stack",
    title: "Technologies We Use",
    description:
      "We leverage the latest and most reliable technologies to build scalable and robust solutions for your business.",
  },
  workflowSection: {
    badge: "Workflow",
    title: "How We Work",
    description:
      "Our 7-step proven process takes your idea from concept to a successful reality. Click on any step to view details.",
  },
  partnersSection: {
    badge: "Trusted By Innovative Companies",
    description: "Powering next-generation digital products for industry leaders worldwide.",
  },
  ctaSection: {
    title: "Ready to Transform Your Business?",
    description:
      "Let's build your next application together. Partner with Appsica to drive digital innovation, scale your infrastructure, and achieve your business goals.",
    primaryButtonText: "Contact Sales",
    primaryButtonLink: "/contact",
    secondaryButtonText: "View Our Services",
    secondaryButtonLink: "/services",
  },
  footer: {
    aboutText:
      "Appsica builds custom software solutions that help your business grow and succeed in the digital world.",
    copyrightText: "© 2026 - All Rights Reserved by Appsica Technologies",
  },
};

export const defaultServices: IServiceItem[] = [
  {
    icon: "solar:code-linear",
    title: "Web Development",
    slug: "web-development",
    image: "/images/ServiceDetail/web.jpg",
    description:
      "Build fast, scalable, and secure web applications tailored to your business needs.",
    detail:
      "We develop high-performance web applications using modern technologies like React, Next.js, and Node.js. Our focus is on creating scalable architectures, optimized performance, and seamless user experiences. Whether it's a SaaS platform, dashboard, or custom web solution, we ensure reliability and long-term maintainability.",
    features: [
      { title: "Custom Web Apps", description: "Tailored solutions for your business requirements." },
      { title: "Frontend Development", description: "Modern UI with React, Next.js, and responsive design." },
      { title: "Backend Development", description: "Robust APIs and scalable server architecture." },
      { title: "Performance Optimization", description: "Fast loading and SEO-friendly applications." },
      { title: "Security & Scalability", description: "Secure and scalable systems for growth." },
    ],
    order: 1,
  },
  {
    icon: "solar:smartphone-linear",
    title: "Mobile App Development",
    slug: "mobile-app-development",
    image: "/images/ServiceDetail/mobile.jpg",
    description:
      "Develop high-quality Android and iOS apps with smooth performance and great UX.",
    detail:
      "We create powerful mobile applications for Android and iOS using cross-platform and native technologies. Our apps are designed for performance, usability, and scalability, ensuring a seamless experience across devices.",
    features: [
      { title: "Cross-Platform Apps", description: "Build apps using React Native or Flutter." },
      { title: "Native Development", description: "High-performance native apps for Android & iOS." },
      { title: "API Integration", description: "Seamless backend and third-party integrations." },
      { title: "App Store Deployment", description: "End-to-end publishing support." },
      { title: "Maintenance & Updates", description: "Continuous improvements and bug fixes." },
    ],
    order: 2,
  },
  {
    icon: "solar:cloud-linear",
    title: "Cloud & DevOps",
    slug: "cloud-devops",
    image: "/images/ServiceDetail/cloud.jpg",
    description:
      "Automate deployments, manage infrastructure, and scale your applications with ease.",
    detail:
      "We help businesses adopt cloud infrastructure and DevOps practices to improve deployment speed, scalability, and reliability. From CI/CD pipelines to cloud architecture, we ensure smooth and efficient operations.",
    features: [
      { title: "CI/CD Pipelines", description: "Automate build, test, and deployment workflows." },
      { title: "Cloud Infrastructure", description: "Deploy on AWS, GCP, or Azure." },
      { title: "Containerization", description: "Use Docker and Kubernetes for scalability." },
      { title: "Monitoring & Logging", description: "Track performance and system health." },
      { title: "Cost Optimization", description: "Efficient resource usage to reduce costs." },
    ],
    order: 3,
  },
  {
    icon: "solar:settings-linear",
    title: "Custom Software Development",
    slug: "custom-software",
    image: "/images/ServiceDetail/custom.jpg",
    description:
      "Develop tailored software solutions to streamline operations and improve efficiency.",
    detail:
      "We create custom software solutions designed specifically for your workflows and business processes. From internal tools to enterprise platforms, we ensure scalability and performance.",
    features: [
      { title: "Business Automation", description: "Automate repetitive processes." },
      { title: "Enterprise Solutions", description: "Scalable systems for large operations." },
      { title: "API Development", description: "Build and integrate custom APIs." },
      { title: "System Integration", description: "Connect multiple tools into one system." },
      { title: "Ongoing Support", description: "Continuous maintenance and improvements." },
    ],
    order: 4,
  },
  {
    icon: "solar:pen-linear",
    title: "UI/UX Design",
    slug: "ui-ux-design",
    image: "/images/ServiceDetail/ui.jpg",
    description:
      "Design intuitive and visually appealing user interfaces for better user engagement.",
    detail:
      "We design user-centric interfaces that enhance usability and engagement. From wireframes to high-fidelity designs, we focus on delivering seamless digital experiences.",
    features: [
      { title: "User Research", description: "Understand user behavior and needs." },
      { title: "Wireframing", description: "Plan structure and layout effectively." },
      { title: "UI Design", description: "Modern and clean visual designs." },
      { title: "UX Optimization", description: "Improve usability and user flow." },
      { title: "Prototyping", description: "Interactive prototypes for testing." },
    ],
    order: 5,
  },
  {
    icon: "solar:graph-up-linear",
    title: "Digital Marketing",
    slug: "digital-marketing",
    image: "/images/ServiceDetail/digital-marketing.jpg",
    description: "Accelerate your brand's growth with data-driven digital marketing strategies.",
    detail:
      "Our comprehensive digital marketing services are designed to increase your online presence and drive conversions. We leverage analytics, targeted campaigns, and creative content to ensure your brand reaches its maximum potential in the digital space.",
    features: [
      { title: "Strategic Planning", description: "Custom strategies aligned with business goals." },
      { title: "Brand Positioning", description: "Establish a strong market presence." },
      { title: "Conversion Optimization", description: "Turn visitors into loyal customers." },
      { title: "Analytics & Reporting", description: "Real-time performance tracking." },
      { title: "Content Creation", description: "Engaging media for your target audience." },
    ],
    order: 6,
  },
  {
    icon: "solar:cart-large-2-linear",
    title: "E-commerce Development",
    slug: "e-commerce-development",
    image: "/images/ServiceDetail/ecommerce.jpg",
    description: "Build high-converting online stores that deliver seamless shopping experiences.",
    detail:
      "We specialize in developing robust and scalable e-commerce platforms. Whether you need a custom Shopify, WooCommerce, or a headless e-commerce solution, we build secure, lightning-fast stores optimized for maximum sales.",
    features: [
      { title: "Custom Storefronts", description: "Tailored designs for your brand." },
      { title: "Payment Gateway", description: "Secure and seamless transactions." },
      { title: "Inventory Management", description: "Automated stock tracking systems." },
      { title: "Mobile Optimization", description: "Perfect shopping experience on all devices." },
      { title: "Performance Tuning", description: "Fast loading speeds to reduce bounce rates." },
    ],
    order: 7,
  },
  {
    icon: "solar:chart-square-linear",
    title: "PPC Management",
    slug: "ppc-management",
    image: "/images/ServiceDetail/ppc.jpg",
    description: "Maximize your ROI with highly targeted Pay-Per-Click advertising campaigns.",
    detail:
      "Our PPC experts create and manage data-driven ad campaigns on Google, Bing, and social media platforms. We focus on minimizing your cost-per-acquisition while maximizing qualified traffic and sales.",
    features: [
      { title: "Keyword Research", description: "Identify high-converting search terms." },
      { title: "Ad Copywriting", description: "Compelling text that drives clicks." },
      { title: "Bid Management", description: "Optimize ad spend for maximum ROI." },
      { title: "A/B Testing", description: "Continuous optimization of ad creatives." },
      { title: "Conversion Tracking", description: "Measure every sale and lead accurately." },
    ],
    order: 8,
  },
  {
    icon: "solar:target-linear",
    title: "Search Engine Marketing",
    slug: "search-engine-marketing",
    image: "/images/ServiceDetail/sem.jpg",
    description: "Dominate search engine results and drive immediate traffic to your business.",
    detail:
      "Search Engine Marketing (SEM) combines paid advertising with search intent. We ensure your business appears at the exact moment potential customers are searching for your products or services.",
    features: [
      { title: "Search Ads", description: "High-visibility text ads on Google." },
      { title: "Display Network", description: "Visual ads across thousands of websites." },
      { title: "Retargeting", description: "Bring back visitors who didn't convert." },
      { title: "Competitor Analysis", description: "Stay ahead of industry rivals." },
      { title: "Landing Page Optimization", description: "Improve post-click experiences." },
    ],
    order: 9,
  },
  {
    icon: "solar:global-linear",
    title: "SEO Optimization",
    slug: "seo",
    image: "/images/ServiceDetail/seo.jpg",
    description: "Achieve long-term organic growth with advanced search engine optimization.",
    detail:
      "We improve your website's visibility on Google through technical SEO, high-quality backlinking, and content optimization. Our white-hat strategies ensure sustainable and compounding traffic growth.",
    features: [
      { title: "Technical SEO", description: "Optimize site speed and architecture." },
      { title: "On-Page SEO", description: "Optimize content and meta tags." },
      { title: "Off-Page SEO", description: "Build high-authority backlinks." },
      { title: "Local SEO", description: "Dominate local search results." },
      { title: "Keyword Strategy", description: "Target queries with high intent." },
    ],
    order: 10,
  },
  {
    icon: "solar:hashtag-linear",
    title: "Social Media Marketing",
    slug: "social-media-marketing",
    image: "/images/ServiceDetail/social-media.jpg",
    description: "Build a passionate community and engage with your audience across platforms.",
    detail:
      "We manage and grow your presence on platforms like Instagram, Facebook, LinkedIn, and Twitter. From viral content creation to community management, we turn your followers into loyal brand advocates.",
    features: [
      { title: "Social Strategy", description: "Platform-specific growth plans." },
      { title: "Content Calendar", description: "Consistent and engaging posting." },
      { title: "Community Management", description: "Interact with your audience daily." },
      { title: "Influencer Outreach", description: "Collaborate with industry voices." },
      { title: "Paid Social Ads", description: "Targeted campaigns for rapid growth." },
    ],
    order: 11,
  },
  {
    icon: "solar:devices-linear",
    title: "Responsive Web Design",
    slug: "responsive-web-design",
    image: "/images/ServiceDetail/responsive.jpg",
    description: "Craft beautiful, pixel-perfect websites that look flawless on any screen.",
    detail:
      "We design websites that automatically adapt to mobile, tablet, and desktop screens. By prioritizing user experience and modern aesthetics, we ensure your digital storefront makes a stunning first impression everywhere.",
    features: [
      { title: "Mobile-First Design", description: "Optimized for mobile users." },
      { title: "Fluid Grids", description: "Layouts that adapt to any screen size." },
      { title: "Cross-Browser Testing", description: "Flawless on Chrome, Safari, Firefox." },
      { title: "Fast Loading", description: "Optimized images and lightweight code." },
      { title: "Accessible UI", description: "Designed for all user demographics." },
    ],
    order: 12,
  },
  {
    icon: "solar:users-group-rounded-linear",
    title: "CRM & ERP Solutions",
    slug: "crm-erp-solutions",
    image: "/images/ServiceDetail/crm.jpg",
    description: "Streamline operations with custom CRM, HRMS, and enterprise dashboards.",
    detail:
      "We specialize in developing robust enterprise solutions like Customer Relationship Management (CRM) systems, Human Resource Management Systems (HRMS), and Admin Dashboards to automate your business processes.",
    demoLinks: [
      { name: "Admin Dashboard Pack", url: "https://dashboardpack.com/live-demo-preview/?livedemo=391333" },
      { name: "HRMS Portal", url: "https://hrms-sample.vercel.app/" },
      { name: "ProManage PMS", url: "https://hotel-management-iota-black.vercel.app/dashboard" },
      { name: "Luxury Hotel Platform", url: "https://hotel-management-6v5a.vercel.app/" },
      { name: "Noor-e-Adah Admin", url: "https://noor-e-adah-sample.vercel.app/admin/dashboard" },
    ],
    features: [
      { title: "Custom Dashboards", description: "Data-driven administrative panels." },
      { title: "Workflow Automation", description: "Automate repetitive enterprise tasks." },
      { title: "HRMS Integration", description: "Manage employees, payroll, and attendance." },
      { title: "Data Visualization", description: "Advanced charts and reporting tools." },
      { title: "Role-Based Access", description: "Secure multi-tier user authentication." },
    ],
    order: 13,
  },
];

export const defaultTechnologies: ITechCategory[] = [
  {
    category: "Front-end Technologies:",
    items: [
      { name: "React.js", icon: "logos:react" },
      { name: "Angular", icon: "logos:angular-icon" },
      { name: "Next.js", icon: "logos:nextjs-icon" },
      { name: "Vue.js", icon: "logos:vue" },
      { name: "Tailwind CSS", icon: "logos:tailwindcss-icon" },
      { name: "TypeScript", icon: "logos:typescript-icon" },
    ],
    order: 1,
  },
  {
    category: "Backend Technologies:",
    items: [
      { name: "Node.js", icon: "logos:nodejs-icon" },
      { name: "PHP / Laravel", icon: "logos:laravel" },
      { name: "PHP / CodeIgniter", icon: "logos:codeigniter-icon" },
      { name: "Python / Django", icon: "logos:python" },
      { name: "Java / Spring", icon: "logos:java" },
      { name: "Express.js", icon: "simple-icons:express" },
    ],
    order: 2,
  },
  {
    category: "Application Technologies:",
    items: [
      { name: "Flutter", icon: "logos:flutter" },
      { name: "React Native", icon: "logos:react" },
      { name: "Android Native", icon: "logos:android-icon" },
      { name: "iOS Swift", icon: "logos:swift" },
      { name: "Electron", icon: "logos:electron" },
      { name: "PWA", icon: "logos:pwa" },
    ],
    order: 3,
  },
  {
    category: "Database Technologies:",
    items: [
      { name: "MongoDB", icon: "logos:mongodb-icon" },
      { name: "MySQL", icon: "logos:mysql" },
      { name: "PostgreSQL", icon: "logos:postgresql" },
      { name: "Redis", icon: "logos:redis" },
      { name: "Firebase", icon: "logos:firebase" },
      { name: "Supabase", icon: "logos:supabase-icon" },
    ],
    order: 4,
  },
  {
    category: "CMS Technologies:",
    items: [
      { name: "WordPress", icon: "logos:wordpress-icon" },
      { name: "Shopify", icon: "logos:shopify" },
      { name: "Wix", icon: "logos:wix" },
      { name: "Strapi", icon: "logos:strapi-icon" },
      { name: "WooCommerce", icon: "logos:woocommerce-icon" },
      { name: "Webflow", icon: "logos:webflow" },
    ],
    order: 5,
  },
  {
    category: "Digital Marketing & Analytics:",
    items: [
      { name: "Google Analytics", icon: "logos:google-analytics" },
      { name: "Google Ads", icon: "logos:google-ads" },
      { name: "Semrush", icon: "simple-icons:semrush" },
      { name: "Meta Ads", icon: "logos:facebook" },
      { name: "Search Console", icon: "logos:google-icon" },
      { name: "HubSpot", icon: "logos:hubspot" },
    ],
    order: 6,
  },
];

export const defaultWorkflowSteps: IWorkflowStep[] = [
  {
    icon: "material-symbols:lightbulb-outline-rounded",
    number: "01",
    title: "Idea & Plan",
    subtitle: "The Beginning",
    description: "We discuss your vision and create a solid roadmap.",
    details: [
      "Requirement Gathering & Analysis",
      "Feasibility Study & Tech Stack Selection",
      "Project Roadmap & Timeline Creation",
      "Cost Estimation & Resource Allocation",
    ],
    order: 1,
  },
  {
    icon: "material-symbols:edit-note-rounded",
    number: "02",
    title: "Sketching",
    subtitle: "Rough Draft",
    description: "Drafting the basic layout to visualize structure.",
    details: [
      "Information Architecture Planning",
      "Low-fidelity Wireframing",
      "User Flow Mapping",
      "Initial Feedback & Iterations",
    ],
    order: 2,
  },
  {
    icon: "material-symbols:palette-outline-rounded",
    number: "03",
    title: "Designing",
    subtitle: "Look & Feel",
    description: "Adding colors and styles for a beautiful UI.",
    details: [
      "High-fidelity UI Prototyping",
      "Interactive Mockups (Figma/Adobe XD)",
      "Brand Identity & Color Psychology",
      "Final UI/UX Sign-off",
    ],
    order: 3,
  },
  {
    icon: "material-symbols:code-rounded",
    number: "04",
    title: "Coding",
    subtitle: "Building It",
    description: "Writing clean code to bring designs to life.",
    details: [
      "Frontend Development (React, Next.js)",
      "Backend API & Database Architecture",
      "Third-Party Service Integrations",
      "Agile Sprints & Progress Tracking",
    ],
    order: 4,
  },
  {
    icon: "material-symbols:bug-report-outline-rounded",
    number: "05",
    title: "Testing",
    subtitle: "Quality Check",
    description: "Ensuring zero bugs across all devices.",
    details: [
      "Automated Unit & Integration Testing",
      "Cross-Browser & Device Compatibility",
      "Security & Performance Audits",
      "User Acceptance Testing (UAT)",
    ],
    order: 5,
  },
  {
    icon: "material-symbols:rocket-launch-outline-rounded",
    number: "06",
    title: "Launch",
    subtitle: "Going Live",
    description: "Deploying your project to the world.",
    details: [
      "Cloud Server Setup (AWS, Vercel)",
      "CI/CD Pipeline Deployment",
      "Domain & SSL Configuration",
      "App Store/Play Store Submission",
    ],
    order: 6,
  },
  {
    icon: "material-symbols:support-agent-rounded",
    number: "07",
    title: "Support",
    subtitle: "Here to Help",
    description: "Continuous growth and maintenance.",
    details: [
      "24/7 Monitoring & Bug Fixes",
      "Feature Updates & Scaling",
      "Performance Optimization",
      "Dedicated Technical Account Manager",
    ],
    order: 7,
  },
];

export const defaultSuccessProjects = [
  {
    name: "Global E-Commerce Platform",
    tech: "Next.js, Stripe, TailwindCSS",
    rating: "5.0",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Taxi Ride Booking App",
    tech: "React Native, Node.js, Google Maps",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Food Delivery Aggregator",
    tech: "React Native, Firebase, Node.js",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Hotel Booking App",
    tech: "Next.js, Prisma, PostgreSQL",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Real Estate Property CRM",
    tech: "Vue.js, Laravel, MySQL",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Healthcare Patient Portal",
    tech: "React, Express, MongoDB",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "EdTech Learning Management",
    tech: "Next.js, Django, PostgreSQL",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Fitness & Workout App",
    tech: "Flutter, Firebase",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Supply Chain Tracker",
    tech: "React, GraphQL, AWS",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Fintech Dashboard Pro",
    tech: "Next.js, Node.js, PostgreSQL",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Crypto Trading Exchange",
    tech: "React, WebSockets, Python",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "SaaS Analytics Tool",
    tech: "React, Node.js, ClickHouse",
    rating: "5.0",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "IoT Device Manager",
    tech: "Vue.js, Go, InfluxDB",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Social Media Scheduler",
    tech: "React, Express, PostgreSQL",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "HR & Payroll System",
    tech: "Next.js, .NET Core, SQL Server",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Event Ticketing Platform",
    tech: "React, Stripe, Firebase",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "AI Chatbot Assistant",
    tech: "React, Python, OpenAI API",
    rating: "5.0",
    image:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Insurance Claim Portal",
    tech: "Angular, Java, Oracle",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Video Streaming App",
    tech: "React Native, AWS MediaLive",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Local Service Finder",
    tech: "Next.js, MongoDB, Google Maps",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Restaurant POS System",
    tech: "Electron, React, SQLite",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=600&q=80",
  },
  {
    name: "Legal Document Generator",
    tech: "React, Node.js, PDFKit",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
  },
];

export const defaultPartners: IPartnerItem[] = [
  {
    name: "Shree Ganesh",
    image: "/images/info/shree-ganesh.png",
  },
  {
    name: "Collect Flow",
    image: "/images/info/collect-flow.png",
  },
  {
    name: "Exp 141",
    image: "/images/info/exp141.png",
  },
  {
    name: "TechCorp",
    image:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='70'><circle cx='20' cy='35' r='12' fill='%233b82f6'/><text x='40' y='42' font-family='sans-serif' font-size='18' font-weight='bold' fill='%23475569'>TechCorp</text></svg>",
  },
  {
    name: "InnovateHQ",
    image:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='70'><rect x='10' y='25' width='20' height='20' fill='%2310b981' rx='4'/><text x='40' y='42' font-family='sans-serif' font-size='18' font-weight='bold' fill='%23475569'>InnovateHQ</text></svg>",
  },
  {
    name: "CloudSync",
    image:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='70'><polygon points='20,20 35,50 5,50' fill='%23f59e0b'/><text x='45' y='42' font-family='sans-serif' font-size='18' font-weight='bold' fill='%23475569'>CloudSync</text></svg>",
  },
  {
    name: "NextGen",
    image:
      "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='70'><path d='M10,35 L20,15 L30,35 L20,55 Z' fill='%238b5cf6'/><text x='40' y='42' font-family='sans-serif' font-size='18' font-weight='bold' fill='%23475569'>NextGen</text></svg>",
  },
];

export const defaultPortfolio: IPortfolioItem[] = [
  {
    "title": "CaSa",
    "slug": "casa",
    "summary": "A modern, full-stack e-commerce platform featuring multiple product categories, seamless shopping experiences, smart product discovery, and a responsive user interface.",
    "description": "A modern, full-stack e-commerce platform featuring multiple product categories, seamless shopping experiences, smart product discovery, and a responsive user interface.",
    "coverImage": "https://res.cloudinary.com/tjpkgicy/image/upload/v1792416059/agency-portfolio/wzyp0c4ublynikkzqc8a.png",
    "image": "https://res.cloudinary.com/tjpkgicy/image/upload/v1792416059/agency-portfolio/wzyp0c4ublynikkzqc8a.png",
    "images": [
      "https://res.cloudinary.com/tjpkgicy/image/upload/v1792416059/agency-portfolio/wzyp0c4ublynikkzqc8a.png",
      "https://res.cloudinary.com/tjpkgicy/image/upload/v1792561900/agency-portfolio/rsrzzkeapa5canlvcrvy.png",
      "https://res.cloudinary.com/tjpkgicy/image/upload/v1792561902/agency-portfolio/nr3s8ougrghjowanwjhq.png"
    ],
    "features": [],
    "techStack": [],
    "liveLink": "https://casa.appsica.com/",
    "category": "ecommerce",
    "playStoreUrl": "",
    "appStoreUrl": "",
    "apps": []
  },
  {
    "title": "Helper Service provider",
    "slug": "helper-service-provider",
    "summary": "A modern, full-stack home service booking platform connecting users with trusted professionals for plumbing, electrical work, cleaning, painting, and other everyday services, with seamless booking and service management.",
    "description": "A modern, full-stack home service booking platform connecting users with trusted professionals for plumbing, electrical work, cleaning, painting, and other everyday services, with seamless booking and service management.",
    "coverImage": "https://res.cloudinary.com/tjpkgicy/image/upload/v1791629693/agency-portfolio/xltey1ypej3oh0ylwvxa.png",
    "image": "https://res.cloudinary.com/tjpkgicy/image/upload/v1791629693/agency-portfolio/xltey1ypej3oh0ylwvxa.png",
    "images": [
      "https://res.cloudinary.com/tjpkgicy/image/upload/v1791629693/agency-portfolio/xltey1ypej3oh0ylwvxa.png",
      "https://res.cloudinary.com/tjpkgicy/image/upload/v1791629712/agency-portfolio/i7xbg60yyxzzy6iazcxo.png",
      "https://res.cloudinary.com/tjpkgicy/image/upload/v1791629714/agency-portfolio/k9nm4biy7b0tqmmzi93s.png",
      "https://res.cloudinary.com/tjpkgicy/image/upload/v1791629715/agency-portfolio/ej7innnwxjc36433esgx.png",
      "https://res.cloudinary.com/tjpkgicy/image/upload/v1791629717/agency-portfolio/cgedsapstzv2kv7tzivd.png",
      "https://res.cloudinary.com/tjpkgicy/image/upload/v1791629718/agency-portfolio/qjfnm00slrsbxmabezn6.png",
      "https://res.cloudinary.com/tjpkgicy/image/upload/v1791629720/agency-portfolio/etro165iiuqg2jfft8w7.png"
    ],
    "features": [],
    "techStack": [],
    "liveLink": "https://helper.appsica.com/",
    "category": "web",
    "playStoreUrl": "",
    "appStoreUrl": "",
    "apps": []
  },
  {
    "title": "Food Delivery Application",
    "slug": "food-delivery-application",
    "summary": "A modern, full-stack food delivery application with seamless user experience, real-time order tracking, and intuitive navigation.",
    "description": "",
    "coverImage": "/uploads/1789630904782-appsica-food-delivery.png",
    "image": "/uploads/1789630904782-appsica-food-delivery.png",
    "images": [
      "/uploads/1789630904782-appsica-food-delivery.png",
      "/uploads/1789810089715-appsica-food-delivery-7.png",
      "/uploads/1789810089802-appsica-food-delivery-5.png",
      "/uploads/1789810089882-appsica-food-delivery-4png.png",
      "/uploads/1789810089996-appsica-food-delivery-3.png",
      "/uploads/1789810090082-appsica-food-delivery-2.png"
    ],
    "features": [],
    "techStack": [],
    "liveLink": "https://food.appsica.com/",
    "category": "mobile",
    "playStoreUrl": "https://play.google.com/store/apps/details?id=com.appsica.food",
    "appStoreUrl": "",
    "apps": [
      {
        "role": "customer",
        "title": "Customer Mobile App",
        "summary": "Browse menus & catalog, real-time live order tracking, secure payment checkout.",
        "playStoreUrl": "https://play.google.com/store/apps/details?id=com.appsica.food",
        "appStoreUrl": "",
        "liveLink": "",
        "icon": "",
        "images": []
      }
    ]
  },
  {
    "title": "quick-commerce",
    "slug": "quick-commerce",
    "summary": "Delivery,shop are also in there",
    "description": "",
    "coverImage": "/uploads/1789810670858-rose-product-delivery-1.png",
    "image": "/uploads/1789810670858-rose-product-delivery-1.png",
    "images": [
      "/uploads/1789810670858-rose-product-delivery-1.png",
      "/uploads/1789810680098-rose-product-delivery-2.png",
      "/uploads/1789810680182-rose-product-delivery-03.png",
      "/uploads/1789810680262-rose-product-delivery-4.png",
      "/uploads/1789810680341-rose-product-delivery-5png.png"
    ],
    "features": [],
    "techStack": [],
    "liveLink": "https://quickcommerce.appsica.com/",
    "category": "mobile",
    "playStoreUrl": "https://play.google.com/store/apps/details?id=com.appsicauser.app&pcampaignid=web_share",
    "appStoreUrl": "",
    "apps": [
      {
        "role": "customer",
        "title": "Customer Mobile App",
        "summary": "Browse menus & catalog, real-time live order tracking, secure payment checkout.",
        "playStoreUrl": "https://play.google.com/store/apps/details?id=com.appsicauser.app&pcampaignid=web_share",
        "appStoreUrl": "",
        "liveLink": "",
        "icon": "",
        "images": []
      },
      {
        "role": "vendor",
        "title": "Vendor / Store Partner App",
        "summary": "Order management, menu & inventory control, live revenue dashboard.",
        "playStoreUrl": "https://play.google.com/store/apps/details?id=com.appsica.vendor&pcampaignid=web_share",
        "appStoreUrl": "",
        "liveLink": "",
        "icon": "",
        "images": []
      },
      {
        "role": "delivery",
        "title": "Delivery Partner App",
        "summary": "Instant dispatch alerts, live turn-by-turn route navigation, earnings payout.",
        "playStoreUrl": "https://play.google.com/store/apps/details?id=com.appsica.rider&pcampaignid=web_share",
        "appStoreUrl": "",
        "liveLink": "",
        "icon": "",
        "images": []
      }
    ]
  },
  {
    "title": "Admin Dashboard Template",
    "slug": "admin-dashboard-template",
    "summary": "A comprehensive and responsive admin dashboard template with various data visualization components.",
    "description": "",
    "coverImage": "/uploads/1789640297191-dashboardpack-.png",
    "image": "/uploads/1789640297191-dashboardpack-.png",
    "images": [
      "/uploads/1789640297191-dashboardpack-.png",
      "/uploads/1789813003776-live-demo-preview-dashboardpack-1.png",
      "/uploads/1789813003842-live-demo-preview-dashboardpack-2.png",
      "/uploads/1789813003920-live-demo-preview-dashboardpack-3.png",
      "/uploads/1789813004011-live-demo-preview-dashboardpack-4.png",
      "/uploads/1789813004074-live-demo-preview-dashboardpack-6.png",
      "/uploads/1789813004154-live-demo-preview-dashboardpack-7.png",
      "/uploads/1789813004258-live-demo-preview-dashboardpack-8.png",
      "/uploads/1789813004357-live-demo-preview-dashboardpack-9.png",
      "/uploads/1789813004438-apex-dashboard---shadcn-next-js-16-admin-template-dashboardpack-11.png",
      "/uploads/1789813009877-live-demo-preview-dashboardpack-5.png",
      "/uploads/1789813009970-apex-dashboard---shadcn-next-js-16-admin-template-dashboardpack-10.png"
    ],
    "features": [],
    "techStack": [],
    "liveLink": "https://dashboardpack.com/live-demo-preview/?livedemo=391333",
    "category": "",
    "playStoreUrl": "",
    "appStoreUrl": "",
    "apps": []
  },
  {
    "title": "edjucator.in",
    "slug": "edjucatorin",
    "summary": "for a educational website",
    "description": "",
    "coverImage": "/uploads/1789811093184-edjucator-2.png",
    "image": "/uploads/1789811093184-edjucator-2.png",
    "images": [
      "/uploads/1789811082773-edjucator-1.png",
      "/uploads/1789811093184-edjucator-2.png",
      "/uploads/1789811093258-edjucator-3.png",
      "/uploads/1789811093324-edjucator-4png.png"
    ],
    "features": [],
    "techStack": [],
    "liveLink": "https://edjucator.in/",
    "category": "",
    "playStoreUrl": "",
    "appStoreUrl": "",
    "apps": []
  },
  {
    "title": "Staff Management",
    "slug": "staff-management",
    "summary": "",
    "description": "",
    "coverImage": "/uploads/1789724061042-staff-management.jpg",
    "image": "/uploads/1789724061042-staff-management.jpg",
    "images": [
      "/uploads/1789724061042-staff-management.jpg",
      "/uploads/1789728875797-ss1.jpeg",
      "/uploads/1789728875977-ss2.jpeg",
      "/uploads/1789728876210-ss3.jpeg",
      "/uploads/1789728889002-ss4.jpeg"
    ],
    "features": [],
    "techStack": [],
    "liveLink": "https://staffmanage.app/admin/",
    "category": "",
    "playStoreUrl": "",
    "appStoreUrl": "",
    "apps": []
  },
  {
    "title": "Noor-e-Adah",
    "slug": "noor-e-adah-",
    "summary": "A beautiful and culturally rich platform showcasing traditional crafts, clothing, or boutique items.",
    "description": "",
    "coverImage": "/uploads/1789642344191-noor-e-adah.jpg",
    "image": "/uploads/1789642344191-noor-e-adah.jpg",
    "images": [
      "/uploads/1789642344191-noor-e-adah.jpg",
      "/uploads/1789814600878-noor-e-adah-premium-fashion-1.png",
      "/uploads/1789814601029-noor-e-adah-premium-fashion-2.png",
      "/uploads/1789814601160-noor-e-adah-premium-fashion-3.png",
      "/uploads/1789814607325-noor-e-adah-premium-fashion-4.png",
      "/uploads/1789814607432-noor-e-adah-premium-fashion-5.png"
    ],
    "features": [],
    "techStack": [],
    "liveLink": "https://noor-e-adah-sample.vercel.app/admin/dashboard",
    "category": "",
    "playStoreUrl": "",
    "appStoreUrl": "",
    "apps": []
  },
  {
    "title": "Luxury Hotel Platform",
    "slug": "luxury-hotel-platform",
    "summary": "An elegant platform for luxury hotel reservations, featuring rich property showcases and availability checks.",
    "description": "",
    "coverImage": "/uploads/1789815426955-the-divine-sanctuary-2.png",
    "image": "/uploads/1789815426955-the-divine-sanctuary-2.png",
    "images": [
      "/uploads/1789642238715-luxury-hotel-platform.jpg",
      "/uploads/1789815426955-the-divine-sanctuary-2.png",
      "/uploads/1789815427098-the-divine-sanctuary-3.png",
      "/uploads/1789815433064-the-divine-sanctuary-4.png"
    ],
    "features": [],
    "techStack": [],
    "liveLink": "https://hotel-management-6v5a.vercel.app/",
    "category": "",
    "playStoreUrl": "",
    "appStoreUrl": "",
    "apps": []
  },
  {
    "title": "Hotel Management System",
    "slug": "hotel-management-system",
    "summary": "A complete hotel management system for booking rooms, managing guests, and handling operations.",
    "description": "",
    "coverImage": "/uploads/1789642156388-hotel-management-system.jpg",
    "image": "/uploads/1789642156388-hotel-management-system.jpg",
    "images": [
      "/uploads/1789642156388-hotel-management-system.jpg",
      "/uploads/1789815648081-promanage-pms-1.png"
    ],
    "features": [],
    "techStack": [],
    "liveLink": "https://hotel-management-iota-black.vercel.app/login",
    "category": "",
    "playStoreUrl": "",
    "appStoreUrl": "",
    "apps": []
  },
  {
    "title": "Travelbook",
    "slug": "travel-book",
    "summary": "A travel booking and exploration platform to discover new destinations and manage trip itineraries.",
    "description": "",
    "coverImage": "/uploads/1789642030571-travelbook.jpg",
    "image": "/uploads/1789642030571-travelbook.jpg",
    "images": [
      "/uploads/1789642030571-travelbook.jpg",
      "/uploads/1789812464666-travel-book-1.png",
      "/uploads/1789812595058-travel-book-2.png",
      "/uploads/1789812595143-travel-book-3.png",
      "/uploads/1789812595200-travel-book-4.png",
      "/uploads/1789812600797-travel-book-5.png"
    ],
    "features": [],
    "techStack": [],
    "liveLink": "https://travelbook-pi.vercel.app/",
    "category": "",
    "playStoreUrl": "",
    "appStoreUrl": "",
    "apps": []
  },
  {
    "title": "Gym Fitness Platform",
    "slug": "gym-fitness-platform",
    "summary": "A modern fitness application for gym members to track workouts, schedules, and membership details.",
    "description": "",
    "coverImage": "/uploads/1789641810533-gym-fitness-platform.jpg",
    "image": "/uploads/1789641810533-gym-fitness-platform.jpg",
    "images": [
      "/uploads/1789641810533-gym-fitness-platform.jpg",
      "/uploads/1789811973460-gym-1.png",
      "/uploads/1789811980676-gym-2.png",
      "/uploads/1789811980775-gym-4.png",
      "/uploads/1789811980880-gym-5.png",
      "/uploads/1789811980949-gym-6.png"
    ],
    "features": [],
    "techStack": [],
    "liveLink": "https://gym-eta-five.vercel.app/",
    "category": "",
    "playStoreUrl": "",
    "appStoreUrl": "",
    "apps": []
  },
  {
    "title": "Plywood Studio",
    "slug": "plywood-studio",
    "summary": "A creative portfolio and business website built for showcasing plywood products and interior designs.",
    "description": "",
    "coverImage": "/uploads/1789641692288-plywood-studio.jpg",
    "image": "/uploads/1789641692288-plywood-studio.jpg",
    "images": [
      "/uploads/1789641692288-plywood-studio.jpg",
      "/uploads/1789811671412-blog-my-site-6png.png",
      "/uploads/1789811679059-certification-my-site-4.png",
      "/uploads/1789811679691-contact-us-my-site-5.png"
    ],
    "features": [],
    "techStack": [],
    "liveLink": "https://riyakaushal321.wixstudio.com/plywood",
    "category": "",
    "playStoreUrl": "",
    "appStoreUrl": "",
    "apps": []
  },
  {
    "title": "Baazarpur E-Commerce",
    "slug": "baazarpur-e-commerce",
    "summary": "A complete e-commerce platform offering a wide range of products with secure checkout and user-friendly interface.",
    "description": "",
    "coverImage": "/uploads/1789641575215-bazarbook.jpg",
    "image": "/uploads/1789641575215-bazarbook.jpg",
    "images": [
      "/uploads/1789641575215-bazarbook.jpg",
      "/uploads/1789811319298-baazarpur-1.png",
      "/uploads/1789811319402-baazarpur-2.png",
      "/uploads/1789811326184-baazarpur-3.png",
      "/uploads/1789811326275-baazarpur-4.png",
      "/uploads/1789811326335-baazarpur-05.png"
    ],
    "features": [],
    "techStack": [],
    "liveLink": "https://baazarpur.vercel.app/",
    "category": "",
    "playStoreUrl": "",
    "appStoreUrl": "",
    "apps": []
  }
];
