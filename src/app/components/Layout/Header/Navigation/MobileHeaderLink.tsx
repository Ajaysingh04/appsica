import { useState } from "react";
import Link from "next/link";
import { HeaderItem } from "../../../../types/menu";
import { usePathname } from "next/navigation";

const MobileHeaderLink: React.FC<{ item: HeaderItem; closeMenu: () => void }> = ({ item, closeMenu }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const handleToggle = () => {
    setSubmenuOpen(!submenuOpen);
  };
  const path = usePathname();

  return (
    <div className="relative w-full">
      <Link
        href={item.href}
        onClick={(event) => {
          if (item.submenu) {
            event.preventDefault();
            handleToggle();
          } else {
            closeMenu();
          }
        }}
        className={`flex items-center justify-between w-full px-4 py-3.5 mb-1 rounded-xl font-semibold focus:outline-none transition-all duration-300 ${ item.href === path ? "bg-blue-50 text-primary shadow-sm" : "text-slate-700 hover:bg-slate-50 hover:text-primary" } `}
      >
        {item.label}
        {item.submenu && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m7 10l5 5l5-5"
            />
          </svg>
        )}
      </Link>
      {submenuOpen && item.submenu && (
        <div className="bg-slate-50 p-2 mt-2 w-full rounded-lg shadow-inner max-h-[260px] overflow-y-auto">
          {item.submenu.map((subItem, index) => (
            <Link
              key={index}
              href={subItem.href}
              onClick={() => closeMenu()}
              className="block py-2.5 px-4 rounded-md text-slate-800 font-medium hover:bg-white hover:text-primary transition-colors hover:shadow-sm"
            >
              {subItem.label}
            </Link>
          ))}
          {item.cta && (
            <Link
              href={item.cta.href}
              onClick={() => closeMenu()}
              className="block mt-2 py-2 px-3 rounded-lg bg-primary text-white text-center hover:bg-blue-700 duration-300 font-semibold"
            >
              {item.cta.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default MobileHeaderLink;
