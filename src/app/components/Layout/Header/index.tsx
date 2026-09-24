"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getHeaderData } from "./Navigation/menuData";
import Logo from "./Logo";
import HeaderLink from "./Navigation/HeaderLink";
import MobileHeaderLink from "./Navigation/MobileHeaderLink";
import "./header.css";

type NavService = {
  title: string;
  slug: string;
};

const Header: React.FC = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [services, setServices] = useState<NavService[]>([]);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const handleScroll = () => {
    setSticky(window.scrollY >= 80);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/service");
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServices((data.ServicesData || []).map((item: NavService) => ({ title: item.title, slug: item.slug })));
      } catch (error) {
        console.error("Error fetching navbar services:", error);
      }
    };

    fetchServices();
  }, []);

  const headerData = getHeaderData(services);

  useEffect(() => {
    if (navbarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [navbarOpen]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <header
        className={`header overflow-visible fixed top-0 z-50 w-full transition-all duration-300 ${
          sticky
            ? "backdrop-blur-2xl bg-white/90 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] border-b border-slate-200/80 py-2.5"
            : "backdrop-blur-xl bg-white/85 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border-b border-slate-200/60 py-3.5"
        }`}
      >
        <div className="container mx-auto lg:max-w-7xl flex items-center justify-between gap-6 px-4 sm:px-6 transition-all duration-300">
          <Logo />
          <ul className="hidden lg:flex items-center justify-center gap-8 xl:gap-10">
            {headerData.map((item, index) => (
              <HeaderLink key={index} item={item} className="header-link" />
            ))}
          </ul>
          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 text-white font-semibold text-xs tracking-wide uppercase shadow-[0_4px_16px_rgba(0,82,204,0.3)] hover:shadow-[0_6px_24px_rgba(0,82,204,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 group"
            >
              <span>Let's Talk</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:translate-x-0.5 transition-transform"
              >
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </Link>
            <button
              ref={hamburgerRef}
              onClick={() => setNavbarOpen(!navbarOpen)}
              className="block lg:hidden p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-primary/50 transition-all focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <span className="block w-6 h-[2.5px] bg-slate-900 rounded-full"></span>
              <span className="block w-6 h-[2.5px] bg-slate-900 rounded-full mt-1.5"></span>
              <span className="block w-6 h-[2.5px] bg-slate-900 rounded-full mt-1.5"></span>
            </button>
          </div>
        </div>
      </header>
      {navbarOpen && (
        <div 
          onClick={() => setNavbarOpen(false)}
          className="lg:hidden fixed top-0 left-0 w-full h-full bg-black/50 z-40 transition-opacity duration-300" 
        />
      )}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed top-24 right-4 left-4 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,82,204,0.15)] transform transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-50 border border-slate-100 max-h-[80vh] overflow-y-auto ${navbarOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-8 scale-95 pointer-events-none"}`}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100/80 bg-slate-50/50">
          <Logo className="logo-3d" />
          <div className="flex items-center gap-4">
            <button
            onClick={() => setNavbarOpen(false)}
            aria-label="Close mobile menu"
            className="p-2 rounded-full bg-white shadow-sm border border-slate-100 text-slate-500 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          </div>
        </div>
        <nav className="flex flex-col p-3 bg-white">
          {headerData.map((item, index) => (
            <MobileHeaderLink key={index} item={item} closeMenu={() => setNavbarOpen(false)} />
          ))}
        </nav>
      </div>
    </>
  );
};

export default Header;
