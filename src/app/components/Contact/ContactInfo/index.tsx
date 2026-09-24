"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { fetchSiteSettings, submitContactForm } from "@/lib/api";
import { ISiteSettings } from "@/types";
import { defaultSiteSettings } from "@/lib/defaultData";

const ContactInfo = () => {
  const [settings, setSettings] = useState<ISiteSettings>(defaultSiteSettings as ISiteSettings);
  const [formData, setFormData] = useState({
    Fname: "",
    Phone: "",
    Mail: "",
    Message: "",
  });

  const [loader, setLoader] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const data = await fetchSiteSettings();
      setSettings(data);
    };

    loadSettings();
  }, []);

  useEffect(() => {
    const isValid = Object.values(formData).every((value) => value.trim() !== "");
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const reset = () => {
    setFormData({
      Fname: "",
      Phone: "",
      Mail: "",
      Message: "",
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    setErrorMessage("");
    try {
      await submitContactForm({
        name: formData.Fname,
        phone: formData.Phone,
        email: formData.Mail,
        message: formData.Message,
        source: "contact-page",
      });

      setShowThanks(true);
      reset();

      setTimeout(() => {
        setShowThanks(false);
      }, 5000);
    } catch (error: any) {
      setErrorMessage(error?.message || "Failed to submit form. Please try again later.");
    } finally {
      setLoader(false);
    }
  };

  const phone = settings?.phone || "+91 9691847671";
  const emails = settings?.emails || ["contact@appsica.com", "hr@appsica.com"];
  const address =
    settings?.address ||
    "F7, Second Floor, Ahinsa Tower, MG Road Indore, Madhya Pradesh 452001";

  return (
    <section id="get-in-touch" className="bg-slate-950 py-24 sm:py-32 relative overflow-hidden border-t border-white/10">
      {/* Ambient background glows & grid pattern */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 -left-32 w-96 h-96 bg-sky-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-pattern opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 lg:max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-blue-500/30 text-sky-300 mb-4 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(0,82,204,0.3)]">
            <Icon icon="solar:chat-round-dots-bold" width="18" height="18" className="text-sky-400" />
            Communication Channels
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">
            Initiate a Discussion with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Appsica Engineering
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Reach out through our direct verified channels or submit your system specifications below. A principal engineer will respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: Contact Cards & Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col gap-6"
          >
            {/* Direct Channel Cards */}
            <div className="space-y-4">
              
              {/* WhatsApp Card */}
              <div className="group rounded-3xl bg-slate-900/70 border border-white/10 hover:border-emerald-500/40 p-6 backdrop-blur-xl shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <Icon icon="ic:baseline-whatsapp" width="28" height="28" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-base font-bold text-white">Instant WhatsApp</h4>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2.5">
                      Direct connection with our technical consultation desk.
                    </p>
                    <Link
                      href={`https://wa.me/${(settings?.whatsapp || phone).replace(/[^\d]/g, "")}?text=${encodeURIComponent("Hi Appsica Team, I would like to inquire about your software development services.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      <span>Launch WhatsApp Chat ({settings?.whatsapp || phone})</span>
                      <Icon icon="solar:arrow-right-up-linear" width="14" height="14" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="group rounded-3xl bg-slate-900/70 border border-white/10 hover:border-sky-500/40 p-6 backdrop-blur-xl shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-blue-500/10 border border-blue-400/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-[0_0_15px_rgba(0,82,204,0.2)]">
                    <Icon icon="solar:letter-bold" width="26" height="26" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Official Emails</h4>
                    <p className="text-xs text-slate-400 mb-2">
                      Send RFPs, technical specifications, or career inquiries.
                    </p>
                    <div className="space-y-1">
                      {emails.map((email: string, idx: number) => (
                        <Link
                          key={idx}
                          href={`mailto:${email}`}
                          className="text-xs font-mono font-medium text-sky-400 hover:text-white transition-colors block"
                        >
                          {email}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="group rounded-3xl bg-slate-900/70 border border-white/10 hover:border-sky-500/40 p-6 backdrop-blur-xl shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-blue-500/10 border border-blue-400/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-[0_0_15px_rgba(0,82,204,0.2)]">
                    <Icon icon="solar:phone-calling-bold" width="26" height="26" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Direct Call</h4>
                    <p className="text-xs text-slate-400 mb-2">
                      Available Mon-Fri, 9:00 AM - 7:00 PM IST.
                    </p>
                    <Link
                      href={`tel:${phone.replace(/\s+/g, "")}`}
                      className="text-xs font-mono font-bold text-slate-200 hover:text-sky-300 transition-colors"
                    >
                      {phone}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Office Address Card */}
              <div className="group rounded-3xl bg-slate-900/70 border border-white/10 hover:border-sky-500/40 p-6 backdrop-blur-xl shadow-xl transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-13 h-13 rounded-2xl bg-blue-500/10 border border-blue-400/20 text-sky-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-[0_0_15px_rgba(0,82,204,0.2)]">
                    <Icon icon="solar:point-on-map-bold" width="26" height="26" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white mb-1">Corporate HQ</h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {address}
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Google Maps Frame */}
            <div className="rounded-3xl p-1 bg-gradient-to-br from-blue-500/20 via-white/5 to-sky-500/20 shadow-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7676.584113049854!2d75.8725201084897!3d22.722287190256964!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd3ed09e7c7d%3A0xe96e66700ea1fe97!2sAhinsa%20Tower!5e1!3m2!1sen!2sin!4v1783232049142!5m2!1sen!2sin"
                className="w-full h-[240px] rounded-[22px] border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </motion.div>

          {/* RIGHT COLUMN: Interactive Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-7 rounded-3xl bg-slate-900/80 border border-white/10 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
          >
            {/* Subtle corner light */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="mb-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sky-400 text-xs font-mono mb-3">
                <span>RFP / Consultation Submission</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
                Submit Project Brief
              </h3>
              <p className="text-sm text-slate-400">
                Provide high-level requirements and our technical team will reach out with architecture options.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="Fname" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="Fname"
                    id="Fname"
                    required
                    value={formData.Fname}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    className="px-5 py-4 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-400/60 transition-all text-sm shadow-inner"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="Phone" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Phone / Mobile *
                  </label>
                  <input
                    type="tel"
                    name="Phone"
                    id="Phone"
                    required
                    value={formData.Phone}
                    onChange={handleChange}
                    placeholder="+91 ..."
                    className="px-5 py-4 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-400/60 transition-all text-sm shadow-inner"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="Mail" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Work Email Address *
                </label>
                <input
                  type="email"
                  name="Mail"
                  id="Mail"
                  required
                  value={formData.Mail}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="px-5 py-4 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-400/60 transition-all text-sm shadow-inner"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="Message" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Project Scope & Specifications *
                </label>
                <textarea
                  id="Message"
                  name="Message"
                  required
                  value={formData.Message}
                  onChange={handleChange}
                  placeholder="Describe your system requirements, timeline, target platform, or tech stack preference..."
                  rows={4}
                  className="px-5 py-4 rounded-xl bg-slate-950/80 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-sky-400/60 transition-all text-sm shadow-inner resize-none leading-relaxed"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={!isFormValid || loader}
                className={`w-full py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2.5 transition-all duration-300 ${
                  !isFormValid || loader
                    ? "bg-slate-800/80 text-slate-500 border border-white/5 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_25px_rgba(0,82,204,0.4)] hover:-translate-y-0.5 cursor-pointer"
                }`}
              >
                {loader ? (
                  <Icon icon="eos-icons:loading" width="22" height="22" className="animate-spin text-sky-300" />
                ) : (
                  <>
                    <span>Submit Architecture Brief</span>
                    <Icon icon="solar:arrow-right-linear" width="18" height="18" />
                  </>
                )}
              </button>

              {showThanks && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-xs sm:text-sm font-semibold"
                >
                  <div className="bg-emerald-500/20 p-1.5 rounded-full shrink-0 text-emerald-400">
                    <Icon icon="solar:check-circle-bold" width="20" height="20" />
                  </div>
                  Your message has been received! A senior solutions architect will contact you shortly.
                </motion.div>
              )}

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-xs sm:text-sm font-semibold"
                >
                  <div className="bg-rose-500/20 p-1.5 rounded-full shrink-0 text-rose-400">
                    <Icon icon="solar:danger-triangle-bold" width="20" height="20" />
                  </div>
                  {errorMessage}
                </motion.div>
              )}
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
