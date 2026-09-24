"use client";
import { Icon } from "@iconify/react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { fetchWorkflow, fetchSiteSettings } from "@/lib/api";
import { IWorkflowStep, ISuccessProject } from "@/types";
import {
  defaultWorkflowSteps,
  defaultSuccessProjects,
  defaultSiteSettings,
} from "@/lib/defaultData";

const Workflow = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [workflowSteps, setWorkflowSteps] = useState<IWorkflowStep[]>(
    defaultWorkflowSteps as unknown as IWorkflowStep[]
  );
  const [successProjects, setSuccessProjects] = useState<ISuccessProject[]>(
    defaultSuccessProjects
  );
  const [sectionInfo, setSectionInfo] = useState({
    badge: defaultSiteSettings.workflowSection.badge,
    title: defaultSiteSettings.workflowSection.title,
    description: defaultSiteSettings.workflowSection.description,
  });

  useEffect(() => {
    const loadData = async () => {
      const [wfData, settingsData] = await Promise.all([
        fetchWorkflow(),
        fetchSiteSettings(),
      ]);
      setWorkflowSteps(wfData.steps);
      setSuccessProjects(wfData.successProjects);
      if (settingsData?.workflowSection) {
        setSectionInfo(settingsData.workflowSection as any);
      }
    };

    loadData();
  }, []);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedStep !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedStep]);

  return (
    <section className="bg-slate-950 py-24 relative overflow-hidden border-t border-white/5">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/3 left-10 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-pattern opacity-25 pointer-events-none" />

      <div ref={ref} className="container mx-auto px-4 lg:max-w-7xl relative z-10">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 text-sky-300 mb-4 border border-blue-500/30 shadow-[0_0_15px_rgba(0,82,204,0.25)]">
            <Icon icon="solar:diagram-up-bold" width="18" height="18" className="text-sky-400" />
            <span className="text-xs font-bold tracking-widest uppercase">{sectionInfo.badge || "Engineering Lifecycle"}</span>
          </div>
          <h2 className="md:text-5xl sm:text-4xl text-3xl font-extrabold text-white tracking-tight">
            {sectionInfo.title || "Agile Software Delivery Pipeline"}
          </h2>
          <p className="text-base sm:text-lg text-slate-400 mt-4 mx-auto max-w-2xl leading-relaxed">
            {sectionInfo.description || "From requirements engineering to automated CI/CD and production rollout."}
          </p>
        </motion.div>

        <div className="relative mt-12">
          {/* Desktop Grid Layout */}
          <div className="hidden lg:flex flex-col gap-8">
            <div className="grid grid-cols-4 gap-6">
              {workflowSteps.slice(0, 4).map((step, index) => (
                <WorkflowCard
                  key={step.number || index}
                  step={step}
                  index={index}
                  inView={inView}
                  onClick={() => setSelectedStep(index)}
                />
              ))}
            </div>
            <div className="flex justify-center gap-6">
              {workflowSteps.slice(4, 7).map((step, index) => (
                <div key={step.number || index} className="w-1/4">
                  <WorkflowCard
                    step={step}
                    index={index + 4}
                    inView={inView}
                    onClick={() => setSelectedStep(index + 4)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile & Tablet Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:hidden">
            {workflowSteps.map((step, index) => (
              <WorkflowCard
                key={step.number || index}
                step={step}
                index={index}
                inView={inView}
                mobile
                onClick={() => setSelectedStep(index)}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16 flex justify-center"
          >
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-[0_0_25px_rgba(0,82,204,0.4)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <span>Explore All Engineering Services</span>
              <Icon icon="solar:arrow-right-linear" width="20" height="20" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Modal / Popup for Details */}
      <AnimatePresence>
        {selectedStep !== null && workflowSteps[selectedStep] && (
          <Modal
            step={workflowSteps[selectedStep]}
            onClose={() => setSelectedStep(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

const WorkflowCard = ({
  step,
  index,
  inView,
  mobile = false,
  onClick,
}: {
  step: any;
  index: number;
  inView: boolean;
  mobile?: boolean;
  onClick: () => void;
}) => {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative h-full cursor-pointer"
      onClick={onClick}
    >
      <div className="h-full rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 shadow-2xl hover:border-sky-500/50 hover:shadow-[0_0_35px_rgba(56,189,248,0.2)] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
        {/* Subtle Ambient Glow on Hover */}
        <div className="absolute -top-10 -right-10 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-sky-400/20 transition-all pointer-events-none" />

        {/* Click Indicator */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-sky-500/20 text-sky-400 rounded-full p-2 border border-sky-500/30">
            <Icon icon="solar:arrow-right-up-linear" width="18" height="18" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-400/20 text-sky-400 group-hover:bg-primary group-hover:text-white group-hover:border-blue-400 group-hover:shadow-[0_0_20px_rgba(0,82,204,0.4)] flex items-center justify-center transition-all duration-300">
              <Icon icon={step.icon || "solar:code-file-bold"} width="24" height="24" />
            </div>
            <span className="text-slate-700 group-hover:text-sky-500/30 font-black text-3xl font-mono transition-colors duration-300">
              {step.number}
            </span>
          </div>

          <h4 className="text-lg font-bold text-white mb-1 group-hover:text-sky-300 transition-colors duration-300">
            {step.title}
          </h4>
          <p className="text-sky-400 font-bold text-xs mb-3 uppercase tracking-wider">
            {step.subtitle}
          </p>
          <p className="text-sm leading-relaxed text-slate-300">
            {step.description}
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs font-bold text-sky-400 group-hover:text-white transition-colors">
          <span>Explore Phase</span>
          <Icon icon="solar:arrow-right-linear" width="14" height="14" className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
};

const Modal = ({ step, onClose }: { step: any; onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Dark overlay with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm cursor-pointer"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100"
      >
        {/* Header section */}
        <div className="bg-slate-50/50 p-6 sm:p-8 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-start gap-5">
            <div className="h-16 w-16 rounded-2xl bg-blue-50 border border-blue-100 text-primary flex items-center justify-center shrink-0">
              <Icon icon={step.icon || "material-symbols:lightbulb-outline-rounded"} width="32" height="32" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-blue-200 font-extrabold text-3xl">{step.number}</span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800">{step.title}</h3>
              </div>
              <p className="text-primary font-bold text-sm uppercase tracking-wider">{step.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <Icon icon="material-symbols:close-rounded" width="24" height="24" />
          </button>
        </div>

        {/* Body section */}
        <div className="p-6 sm:p-8 bg-white">
          <p className="text-lg text-slate-600 mb-8 border-l-4 border-primary pl-4 font-medium">
            {step.description}
          </p>

          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Requirements & Deliverables</h4>

          <ul className="space-y-4">
            {(step.details || []).map((detail: string, i: number) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-4"
              >
                <span className="mt-1 flex-shrink-0 bg-blue-50 text-primary p-1 rounded-full">
                  <Icon icon="material-symbols:check-small-rounded" width="20" height="20" />
                </span>
                <span className="text-slate-700 font-medium text-base">
                  {detail}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export const SuccessModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Dark overlay with blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
        className="relative w-full max-w-6xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100 flex flex-col"
      >
        {/* Header section */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-primary p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="flex items-center gap-4 relative z-10">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center shrink-0">
              <Icon icon="material-symbols:trophy-outline-rounded" width="36" height="36" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
                100+ Projects Successfully Delivered
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  <Icon icon="material-symbols:star-rounded" width="20" height="20" />
                  <Icon icon="material-symbols:star-rounded" width="20" height="20" />
                  <Icon icon="material-symbols:star-rounded" width="20" height="20" />
                  <Icon icon="material-symbols:star-rounded" width="20" height="20" />
                  <Icon icon="material-symbols:star-half-rounded" width="20" height="20" />
                </div>
                <span className="text-blue-100 font-medium text-sm">Average Rating: 4.8/5</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10 cursor-pointer"
            aria-label="Close"
          >
            <Icon icon="material-symbols:close-rounded" width="24" height="24" />
          </button>
        </div>

        {/* Body section (Scrollable Grid) */}
        <div className="p-6 sm:p-8 bg-slate-50 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {defaultSuccessProjects.map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-40 w-full relative bg-slate-100">
                  <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Icon icon="material-symbols:star-rounded" className="text-yellow-400" width="16" height="16" />
                    <span className="text-sm font-bold text-slate-800">{project.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-bold text-slate-800 mb-1">{project.name}</h4>
                  <div className="flex items-start gap-1.5 mt-2">
                    <Icon icon="material-symbols:code-blocks-outline-rounded" className="text-primary shrink-0 mt-0.5" width="16" height="16" />
                    <span className="text-sm font-medium text-slate-500">{project.tech}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Workflow;
