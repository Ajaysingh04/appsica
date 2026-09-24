"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Icon } from "@iconify/react";
import { defaultJobRoles } from "@/lib/defaultJobs";
import { IJobRole } from "@/types/job";

const perksList = [
  {
    icon: "solar:laptop-minimalistic-bold",
    title: "High-Performance Workstations & Tools",
    desc: "Every engineer gets a top-spec workstation, dual high-res external monitors, licensed IDEs, and modern AI developer tools to build at maximum velocity.",
    tag: "Pro Workstation",
  },
  {
    icon: "solar:buildings-bold",
    title: "Modern Tech Hub in Indore",
    desc: "Our headquarters at Ahinsha Tower F7, MG Road, Indore features ergonomic chairs, high-speed dual fiber lines, focus pods, and free snacks.",
    tag: "Ahinsha Tower F7, MG Road",
  },
  {
    icon: "solar:card-recive-bold",
    title: "Top 10% Compensation",
    desc: "Above-market base salary, milestone performance bonuses, biannual reviews, and rewarding project referral incentives.",
    tag: "Competitive Pay",
  },
  {
    icon: "solar:diploma-verified-bold",
    title: "100% Learning Sponsorship",
    desc: "Unlimited budget for AWS, GCP, Next.js certifications, premium courses, tech books, and international conference passes.",
    tag: "Skill Acceleration",
  },
  {
    icon: "solar:sun-2-bold",
    title: "Flexible Hybrid Work Policy",
    desc: "We prioritize output over seat time. Enjoy flexible working hours, remote-friendly sprints, and zero micromanagement.",
    tag: "True Autonomy",
  },
  {
    icon: "solar:heart-pulse-bold",
    title: "Health & Comprehensive Care",
    desc: "Complete medical insurance for you and your dependents, paid wellness leaves, and ergonomic health reimbursements.",
    tag: "Health First",
  },
  {
    icon: "solar:shield-star-bold",
    title: "Zero Bureaucracy, Pure Craft",
    desc: "Flat engineering hierarchy where your ideas directly shape client solutions and internal architecture. Work directly with leadership.",
    tag: "Fast Track",
  },
  {
    icon: "solar:cup-star-bold",
    title: "Team Offsites & Celebrations",
    desc: "Quarterly hackathons, tech demo Fridays, rooftop dinners, games nights, and annual team retreats to unwind.",
    tag: "Thriving Culture",
  },
];

const hiringSteps = [
  {
    step: "01",
    title: "Application & Skills Review",
    desc: "Our HR desk and engineering leads evaluate your skills, resume, GitHub repositories, and live project work within 24 to 48 hours.",
    icon: "solar:document-text-bold",
  },
  {
    step: "02",
    title: "Technical Architecture Discussion",
    desc: "A 45-minute deep dive on system design and practical coding patterns. No esoteric trivia—just how you solve real engineering problems.",
    icon: "solar:code-square-bold",
  },
  {
    step: "03",
    title: "Founder & Culture Alignment",
    desc: "Connect directly with Founder Krishna Gopal Singh to discuss our shared engineering values, growth milestones, and long-term vision.",
    icon: "solar:chat-round-dots-bold",
  },
  {
    step: "04",
    title: "Offer & Seamless Onboarding",
    desc: "Receive a transparent, competitive offer letter, your workstation setup ready, and a comprehensive onboarding roadmap.",
    icon: "solar:confetti-bold",
  },
];

export default function CareersClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  // Form State
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    role: "",
    experience: "3 - 5 Years",
    resumeUrl: "",
    message: "",
  });

  // Resume mode: 'file' | 'link'
  const [resumeMode, setResumeMode] = useState<"file" | "link">("file");

  // Attached resume file (converted to base64)
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    size: string;
    base64: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  // Dynamic roles state
  const [roles, setRoles] = useState<IJobRole[]>(defaultJobRoles as IJobRole[]);

  useEffect(() => {
    async function loadRoles() {
      try {
        const res = await fetch("/api/careers/roles");
        if (!res.ok) return;
        const data = await res.json();
        if (data.roles && data.roles.length > 0) {
          setRoles(data.roles);
        }
      } catch (err) {
        console.warn("Using fallback default roles:", err);
      }
    }
    loadRoles();
  }, []);

  const activeRoles = roles.filter((job) => job.isActive !== false);
  const filteredRoles =
    selectedCategory === "all"
      ? activeRoles
      : activeRoles.filter((job) => job.category === selectedCategory);

  const handleApplyClick = (job: IJobRole) => {
    setFormData((prev) => ({
      ...prev,
      role: job.title,
    }));
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please upload a smaller file or paste a Google Drive link.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      setAttachedFile({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        base64: base64String,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.skills.trim()) {
      setStatus({
        type: "error",
        message: "Please enter your technical skills (e.g. Next.js, Node.js, Python, AWS).",
      });
      return;
    }

    if (!formData.resumeUrl && !attachedFile) {
      setStatus({
        type: "error",
        message: "Please either upload your Resume file (.PDF / .DOCX) or paste a Drive/Portfolio link.",
      });
      return;
    }

    setLoading(true);
    setStatus({ type: "idle", message: "" });

    try {
      const payload: Record<string, unknown> = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        skills: formData.skills.trim(),
        role: formData.role || "General Application",
        experience: formData.experience,
        resumeUrl: formData.resumeUrl,
        message: formData.message,
        source: "career-application",
        type: "career",
      };

      if (attachedFile) {
        payload.resumeAttachment = {
          filename: attachedFile.name,
          content: attachedFile.base64,
        };
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          type: "success",
          message:
            "Thank you! Your resume, skills, and application have been delivered directly to our Official HR Desk at hr@appsica.com. Our talent team will review your profile and reach out within 24-48 hours.",
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          skills: "",
          role: "",
          experience: "3 - 5 Years",
          resumeUrl: "",
          message: "",
        });
        setAttachedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setStatus({
          type: "error",
          message:
            data.error ||
            "Unable to submit your application right now. Please email your resume directly to hr@appsica.com.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message:
          "A network glitch occurred. Please reach out directly to our HR team at hr@appsica.com.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-white selection:bg-blue-600 selection:text-white overflow-hidden">
      {/* Dynamic Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[35%] right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-[65%] left-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[160px] pointer-events-none -z-10" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-36 pb-16 md:pt-44 md:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 backdrop-blur-md text-blue-400 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-8 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-3.5" />
          <span>We Are Actively Hiring &bull; Ahinsha Tower F7, MG Road, Indore</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]"
        >
          Build Next-Gen Software.{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Supercharge Your Career
          </span>{" "}
          With Appsica.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal"
        >
          We are an elite squad of 10-20 software architects, cloud engineers, and creative builders delivering mission-critical applications across startups, e-commerce, healthcare, and fintech. No corporate politics, no micromanagement—just pure engineering excellence.
        </motion.p>

        {/* Quick Badges */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-400"
        >
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <Icon icon="solar:users-group-two-rounded-bold" className="text-blue-400" />
            <span>High-Growth Squad</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <Icon icon="solar:map-point-bold" className="text-purple-400" />
            <span>Ahinsha Tower F7, MG Road</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <Icon icon="solar:stars-bold" className="text-emerald-400" />
            <span>Founded 2026 &bull; 100+ Shipped</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <Icon icon="solar:mailbox-bold" className="text-amber-400" />
            <span>Official HR: <strong className="text-slate-200">hr@appsica.com</strong></span>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#openings"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-semibold text-sm shadow-[0_0_25px_rgba(59,130,246,0.35)] hover:shadow-[0_0_35px_rgba(59,130,246,0.55)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Explore Open Roles</span>
            <Icon icon="solar:arrow-down-linear" className="text-lg" />
          </a>
          <a
            href="#apply-form"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-sm transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 backdrop-blur-sm"
          >
            <span>Quick Apply</span>
            <Icon icon="solar:paperplane-bold" className="text-lg text-blue-400" />
          </a>
        </motion.div>
      </section>

      {/* 2. LIVE OPEN JOB OPENINGS */}
      <section id="openings" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Icon icon="solar:fire-bold" />
              <span>{activeRoles.length} Positions Available</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Current Open Roles
            </h2>
            <p className="mt-2 text-slate-400 text-sm max-w-xl">
              Select any role to auto-fill your application below, or fill out the quick apply form directly.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none w-full md:w-auto">
            {[
              { label: "All Roles", value: "all" },
              { label: "Engineering", value: "engineering" },
              { label: "Cloud & DevOps", value: "cloud" },
              { label: "UI/UX Design", value: "design" },
              { label: "Applied AI", value: "ai" },
            ].map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat.value
                    ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                    : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Roles List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredRoles.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 sm:p-10 text-center"
              >
                <Icon
                  icon="solar:case-round-minimalistic-linear"
                  className="mx-auto text-4xl text-slate-500 mb-2.5"
                />
                <h3 className="text-base font-bold text-white">
                  No Open Positions in this Category Right Now
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Hiring for this category is currently paused. You are still welcome to submit a Fast-Track general application below!
                </p>
              </motion.div>
            ) : (
              filteredRoles.map((role) => {
                const roleKey = role._id || role.id || role.slug || role.title;
                const isExpanded = expandedRole === roleKey;
                return (
                  <motion.div
                    key={roleKey}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl bg-gradient-to-r from-slate-900/90 to-slate-900/60 border border-slate-800/90 hover:border-blue-500/40 transition-all duration-200 overflow-hidden"
                  >
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
                              {role.department}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs flex items-center gap-1">
                              <Icon icon="solar:map-point-linear" />
                              {role.location}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs flex items-center gap-1">
                              <Icon icon="solar:briefcase-linear" />
                              {role.experience}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 text-xs flex items-center gap-1">
                              <Icon icon="solar:clock-circle-linear" />
                              {role.type}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-xl font-bold text-white mb-1.5">
                            {role.title}
                          </h3>
                          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                            {role.description}
                          </p>

                          {/* Tech Tags */}
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {role.skills.map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-2 py-0.5 rounded-md bg-slate-800/70 border border-slate-700/60 text-slate-300 text-[11px] font-mono"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap sm:flex-nowrap items-stretch sm:items-center gap-2 lg:flex-col lg:items-end shrink-0 w-full sm:w-auto pt-3 lg:pt-0 border-t sm:border-t-0 border-slate-800/80">
                          <button
                            onClick={() => handleApplyClick(role)}
                            className="flex-1 sm:flex-none justify-center px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <span>Apply For This Role</span>
                            <Icon icon="solar:arrow-down-linear" />
                          </button>

                          {/* Visit LinkedIn Button */}
                          {role.linkedinUrl && (
                            <a
                              href={role.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 sm:flex-none justify-center px-3.5 py-2.5 rounded-xl bg-[#0a66c2]/20 hover:bg-[#0a66c2]/35 text-[#70b5f9] hover:text-white border border-[#0a66c2]/40 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm hover:shadow-[0_0_15px_rgba(10,102,194,0.4)] cursor-pointer whitespace-nowrap"
                              title="Visit hiring post on LinkedIn"
                            >
                              <Icon icon="mdi:linkedin" className="text-base text-[#0a66c2]" />
                              <span>Visit LinkedIn</span>
                              <Icon icon="solar:arrow-right-up-linear" className="text-xs" />
                            </a>
                          )}

                          <button
                            onClick={() =>
                              setExpandedRole(isExpanded ? null : roleKey)
                            }
                            className="w-full sm:w-auto justify-center px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
                          >
                            <span>{isExpanded ? "Hide Details" : "Responsibilities"}</span>
                            <Icon
                              icon={isExpanded ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Collapsible Details */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-slate-800"
                        >
                          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                            Key Responsibilities:
                          </h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-slate-300">
                            {role.responsibilities.map((resp, rIdx) => (
                              <li key={rIdx} className="flex items-start gap-1.5">
                                <Icon
                                  icon="solar:check-circle-bold"
                                  className="text-emerald-400 text-sm shrink-0 mt-0.5"
                                />
                                <span>{resp}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 3. COMPACT & HIGH-CONVERSION APPLICATION FORM */}
      <section
        id="apply-form"
        ref={formRef}
        className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-800/80"
      >
        <div className="relative rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-[0_15px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl p-6 sm:p-10 overflow-hidden">
          {/* Subtle Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Form Header */}
          <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
              <Icon icon="solar:mailbox-bold" className="text-sm" />
              <span>Official HR Desk: hr@appsica.com</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Fast-Track Application
            </h2>
            <p className="mt-1 text-slate-400 text-xs sm:text-sm">
              Quickly submit your profile, skills, and resume. Delivered directly to{" "}
              <span className="text-sky-400 font-medium">hr@appsica.com</span>.
            </p>
          </div>

          {/* Alerts */}
          {status.type === "success" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 flex items-start gap-3 text-xs sm:text-sm leading-relaxed"
            >
              <Icon icon="solar:check-circle-bold" className="text-xl text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-emerald-300">Application Sent!</strong>
                {status.message}
              </div>
            </motion.div>
          )}

          {status.type === "error" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 flex items-start gap-3 text-xs sm:text-sm leading-relaxed"
            >
              <Icon icon="solar:danger-triangle-bold" className="text-xl text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-rose-300">Notice</strong>
                {status.message}
              </div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Icon icon="solar:user-linear" className="text-base" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Icon icon="solar:letter-linear" className="text-base" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Phone & Target Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Phone / WhatsApp <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Icon icon="solar:phone-linear" className="text-base" />
                  </span>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>
                    Applying For Role <span className="text-rose-400">*</span>
                  </span>
                  {activeRoles.length > 0 && (
                    <span className="text-[11px] text-blue-400">
                      {activeRoles.length} Active Positions
                    </span>
                  )}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Icon icon="solar:briefcase-linear" className="text-base" />
                  </span>
                  <input
                    type="text"
                    required
                    list="active-roles-datalist"
                    placeholder="e.g. Senior Full-Stack Engineer / UI-UX Designer"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                  <datalist id="active-roles-datalist">
                    {activeRoles.map((r, rIdx) => (
                      <option key={rIdx} value={r.title} />
                    ))}
                    <option value="General Application / Other" />
                  </datalist>
                </div>
              </div>
            </div>

            {/* Row 3: Skills & Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Which Skills Do You Have? <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Icon icon="solar:code-square-linear" className="text-base" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Enter your skills (e.g. Next.js, Node.js, Python, AWS, PostgreSQL)"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Experience Level <span className="text-rose-400">*</span>
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="Fresher / Graduate (0 - 1 Yr)">Fresher (0 - 1 Yr)</option>
                  <option value="1 - 3 Years">Mid (1 - 3 Yrs)</option>
                  <option value="3 - 5 Years">Senior (3 - 5 Yrs)</option>
                  <option value="5+ Years">Lead / Principal (5+ Yrs)</option>
                </select>
              </div>
            </div>

            {/* Row 4: Resume Mode Switcher & Input */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90">
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Icon icon="solar:document-text-bold" className="text-blue-400 text-sm" />
                  <span>Resume Submission <span className="text-rose-400">*</span></span>
                </label>

                {/* Switcher tabs */}
                <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setResumeMode("file")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      resumeMode === "file"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeMode("link")}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      resumeMode === "link"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Paste Link
                  </button>
                </div>
              </div>

              {resumeMode === "file" ? (
                attachedFile ? (
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Icon icon="solar:check-circle-bold" className="text-emerald-400 text-lg shrink-0" />
                      <span className="text-xs font-semibold text-emerald-200 truncate">
                        {attachedFile.name}
                      </span>
                      <span className="text-[10px] text-emerald-400 shrink-0">
                        ({attachedFile.size})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeAttachedFile}
                      className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                      title="Remove file"
                    >
                      <Icon icon="solar:close-circle-bold" className="text-base" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="compact-resume-input"
                    />
                    <label
                      htmlFor="compact-resume-input"
                      className="cursor-pointer w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700/70 hover:border-blue-500/50 flex items-center justify-center gap-2 transition-all"
                    >
                      <Icon icon="solar:paperclip-2-bold" className="text-base text-blue-400" />
                      <span>Choose PDF / DOCX Resume (Max 5MB)</span>
                    </label>
                  </div>
                )
              ) : (
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Icon icon="solar:link-circle-linear" className="text-base" />
                  </span>
                  <input
                    type="url"
                    placeholder="Paste Google Drive, Dropbox, or Portfolio resume link..."
                    value={formData.resumeUrl}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-all font-mono"
                  />
                </div>
              )}
            </div>

            {/* Row 5: Message / Pitch */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Cover Message / Pitch <span className="text-rose-400">*</span>
              </label>
              <textarea
                required
                rows={2}
                placeholder="Briefly mention key projects you've built, links to GitHub/LinkedIn, or why you want to join Appsica..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Icon icon="solar:spinner-linear" className="animate-spin text-lg" />
                    <span>Transmitting to hr@appsica.com...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="solar:paperplane-bold" className="text-lg" />
                    <span>Submit Application Directly to hr@appsica.com</span>
                  </>
                )}
              </button>
            </div>

            {/* Compact Trust Line */}
            <div className="pt-1 flex flex-wrap items-center justify-center gap-5 text-[11px] text-slate-400 text-center">
              <span className="flex items-center gap-1">
                <Icon icon="solar:shield-check-bold" className="text-emerald-400" />
                100% Confidential
              </span>
              <span className="flex items-center gap-1">
                <Icon icon="solar:clock-circle-bold" className="text-blue-400" />
                24-48h Guaranteed Response
              </span>
              <span className="flex items-center gap-1">
                <Icon icon="solar:mailbox-bold" className="text-purple-400" />
                hr@appsica.com
              </span>
            </div>
          </form>
        </div>
      </section>

      {/* 4. PERKS & FACILITIES SECTION */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Icon icon="solar:gift-bold" />
            <span>World-Class Engineering Culture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything You Need to Do Your Best Work
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            We empower our engineers with premium tools, continuous learning, and total autonomy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {perksList.map((perk, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="group relative p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/90 hover:border-blue-500/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xl mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Icon icon={perk.icon} />
                </div>
                <div className="inline-block px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 text-[11px] font-medium mb-2 border border-slate-700/50">
                  {perk.tag}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  {perk.title}
                </h3>
                <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                  {perk.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. HOW WE HIRE (OUR PROCESS) */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80 bg-slate-950/50">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Icon icon="solar:route-bold" />
            <span>Fast & Transparent</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Our 4-Step Hiring Journey
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            We value your time. No 6-round marathons. We review, interview, and decide within days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {hiringSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="relative p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    {step.step}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-lg">
                    <Icon icon={step.icon} />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. OFFICE LOCATION & DIRECT REACH OUT */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="p-7 rounded-3xl bg-slate-900/40 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1.5">
              Walk-in & Inquiries
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
              Prefer direct email or visiting us in Indore?
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
              Our engineering headquarters is located at Ahinsha Tower F7, MG Road, Indore, Madhya Pradesh. Drop by for a coffee or reach out to our talent team directly at{" "}
              <a href="mailto:hr@appsica.com" className="text-blue-400 hover:underline">
                hr@appsica.com
              </a>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="mailto:hr@appsica.com?subject=Direct%20Career%20Inquiry%20-%20Appsica"
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Icon icon="solar:letter-bold" className="text-blue-400 text-base" />
              <span>Email hr@appsica.com</span>
            </a>
            <Link
              href="/contact"
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(59,130,246,0.3)] cursor-pointer"
            >
              <span>Contact Us</span>
              <Icon icon="solar:arrow-right-linear" className="text-base" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
