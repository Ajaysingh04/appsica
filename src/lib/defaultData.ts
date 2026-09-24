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
  coverImage: string;
  image?: string;
  images?: string[];
  liveLink?: string;
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
    coverImage: "/images/Staff management.jpg",
    image: "/images/Staff management.jpg",
    title: "Staff Management System",
    slug: "staff-management",
    summary: "An enterprise employee and shift management platform with real-time attendance, roster planning, and automated leave tracking.",
    liveLink: "https://staffmanage.app/employee/",
  },
  {
    coverImage: "/images/Appsica-Food-Delivery.png",
    image: "/images/Appsica-Food-Delivery.png",
    title: "Food Delivery Application",
    slug: "food-delivery",
    summary: "A modern, full-stack food delivery application with seamless user experience, restaurant menus, cart checkout, and live order tracking.",
    liveLink: "https://food.appsica.com/",
  },
  {
    coverImage: "/images/edjucator.in.jpg",
    image: "/images/edjucator.in.jpg",
    title: "Edjucator.in - Learning Platform",
    slug: "edjucator",
    summary: "Comprehensive edtech platform facilitating online video courses, test series, interactive learning, and student performance analytics.",
    liveLink: "https://edjucator.in/",
  },
  {
    coverImage: "/images/Baazarpur.png",
    image: "/images/Baazarpur.png",
    title: "Baazarpur E-Commerce",
    slug: "baazarpur",
    summary: "A complete multi-vendor e-commerce platform offering a wide catalog of products with secure payment gateway integration.",
    liveLink: "https://baazarpur.vercel.app/",
  },
  {
    coverImage: "/uploads/1789810670858-rose-product-delivery-1.png",
    image: "/uploads/1789810670858-rose-product-delivery-1.png",
    title: "quick-commerce",
    slug: "quick-commerce",
    summary: "Ultra-fast hyper-local grocery and goods delivery platform with micro-fulfillment center logistics and live courier routing.",
    liveLink: "https://quickcommerce.appsica.com/",
  },
  {
    coverImage: "/images/Bachat Book - Expense Tracker.jpg",
    image: "/images/Bachat Book - Expense Tracker.jpg",
    title: "Bachat Book - Expense Tracker",
    slug: "bachat-book",
    summary: "A personal finance and expense tracking application to manage monthly budgets, analyze spending trends, and monitor daily savings.",
    liveLink: "https://bachat-book-expense-tracker-app-1.onrender.com/login",
  },
  {
    coverImage: "/images/Gym Fitness Platform.jpg",
    image: "/images/Gym Fitness Platform.jpg",
    title: "Gym Fitness Platform",
    slug: "gym-fitness",
    summary: "A modern fitness application for gym members to track workouts, customized diet plans, schedules, and membership packages.",
    liveLink: "https://gym-eta-five.vercel.app/",
  },
  {
    coverImage: "/images/Travel-Book-.png",
    image: "/images/Travel-Book-.png",
    title: "Travelbook Explorer",
    slug: "travelbook",
    summary: "A travel booking and exploration platform to discover curated destinations, book itineraries, and view verified traveler reviews.",
    liveLink: "https://travelbook-pi.vercel.app/",
  },
  {
    coverImage: "/images/DashboardPack-.png",
    image: "/images/DashboardPack-.png",
    title: "Enterprise Analytics Dashboard",
    slug: "dashboard-pack",
    summary: "A comprehensive and responsive admin dashboard template with business intelligence charts and real-time revenue telemetry.",
    liveLink: "https://dashboardpack.com/live-demo-preview/?livedemo=391333",
  },
  {
    coverImage: "/images/Hotel Management System.jpg",
    image: "/images/Hotel Management System.jpg",
    title: "Hotel Management System",
    slug: "hotel-management-1",
    summary: "A complete hotel operations management system for booking rooms, managing guests, housekeeping status, and billing.",
    liveLink: "https://hotel-management-iota-black.vercel.app/dashboard",
  },
  {
    coverImage: "/images/Luxury Hotel Platform.jpg",
    image: "/images/Luxury Hotel Platform.jpg",
    title: "Luxury Hotel Platform",
    slug: "hotel-management-2",
    summary: "An elegant platform for luxury hotel reservations, featuring rich property showcases, suite tours, and instant availability checks.",
    liveLink: "https://hotel-management-6v5a.vercel.app/",
  },
  {
    coverImage: "/images/Plywood Studio.jpg",
    image: "/images/Plywood Studio.jpg",
    title: "Plywood Studio",
    slug: "plywood",
    summary: "A creative digital catalog and portfolio built for showcasing engineered plywood products, laminates, and interior design projects.",
    liveLink: "https://riyakaushal321.wixstudio.com/plywood",
  },
  {
    coverImage: "/images/Noor-e-Adah.jpg",
    image: "/images/Noor-e-Adah.jpg",
    title: "Noor-e-Adah Designer Boutique",
    slug: "noor-e-adah",
    summary: "A beautiful and culturally rich digital boutique showcasing designer couture, luxury ethnic wear, and bespoke collections.",
    liveLink: "https://noor-e-adah-sample.vercel.app/admin/dashboard",
  },
];
