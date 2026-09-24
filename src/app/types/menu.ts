export type SubmenuItem = {
    label: string;
    href: string;
  };

  export type MenuCTA = {
    label: string;
    href: string;
  };
  
  export type HeaderItem = {
    label: string;
    href: string;
    submenu?: SubmenuItem[];
    cta?: MenuCTA;
  };