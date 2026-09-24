"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderItem } from "../../../../types/menu";

const HeaderLink: React.FC<{ item: HeaderItem; className?: string }> = ({ item, className = "" }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const handleMouseEnter = () => {
    if (item.submenu) {
      setSubmenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setSubmenuOpen(false);
  };

  const path = usePathname();

  return (
    <li
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href}
        className={`text-[15px] flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-full transition-all duration-200 ${
          item.href === path || (path.startsWith(`/${item.label.toLowerCase()}`) && item.href !== "/")
            ? "text-blue-600 bg-blue-50/80 font-bold"
            : "text-slate-700 hover:text-blue-600 hover:bg-slate-100/70"
        }`}
      >
        <span>{item.label}</span>
        {item.submenu && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            className="transition-transform duration-200 group-hover:rotate-180 text-slate-400"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
              d="m6 9l6 6l6-6"
            />
          </svg>
        )}
      </Link>
      {submenuOpen && (
        <ul className="absolute py-3 left-0 mt-2 w-72 max-h-96 overflow-y-auto bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-xl border border-slate-100 transition-all duration-300 z-50">
          {item.submenu?.map((subItem, index) => (
            <li key={index}>
              <Link
                href={subItem.href}
                className="block px-6 py-2.5 text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
              >
                {subItem.label}
              </Link>
            </li>
          ))}
          {item.cta && (
            <li className="px-4 pt-2 pb-2">
              <Link
                href={item.cta.href}
                className="block text-center px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-700 duration-300 font-semibold"
              >
                {item.cta.label}
              </Link>
            </li>
          )}
        </ul>
      )}
    </li>
  );
};

export default HeaderLink;
