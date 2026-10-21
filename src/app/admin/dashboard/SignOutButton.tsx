"use client";

import { signOut } from "next-auth/react";

import { Icon } from "@iconify/react";

export default function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-300 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 cursor-pointer shadow-xs active:scale-[0.98]"
    >
      <Icon icon="solar:logout-2-bold" width={16} height={16} />
      <span>Sign out</span>
    </button>
  );
}
