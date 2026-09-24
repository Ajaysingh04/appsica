"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("admin-credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/admin/dashboard",
      });
      if (res?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
      window.location.href = "/admin/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-sky-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 tech-grid-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Top Brand Tag */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-sky-400 tracking-wider uppercase backdrop-blur-md mb-4 shadow-[0_0_15px_rgba(0,82,204,0.25)]">
            <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
            <span>Appsica Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Admin Sign In
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Authorized admin credentials required to access the console.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-7 sm:p-8 shadow-2xl backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-medium text-red-300">
                <Icon icon="solar:danger-circle-bold" className="text-red-400 shrink-0" width={18} height={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Admin Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Icon icon="solar:letter-linear" width={18} height={18} />
                </div>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@appsica.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 outline-none transition duration-200 focus:border-blue-500 focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Icon icon="solar:lock-password-linear" width={18} height={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-800/80 py-3 pl-11 pr-11 text-sm text-white placeholder-slate-500 outline-none transition duration-200 focus:border-blue-500 focus:bg-slate-800 focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-white transition cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  <Icon
                    icon={showPassword ? "solar:eye-closed-linear" : "solar:eye-linear"}
                    width={18}
                    height={18}
                  />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 py-3 px-4 text-sm font-bold text-white shadow-[0_0_20px_rgba(0,82,204,0.4)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,82,204,0.6)] hover:brightness-110 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Icon icon="line-md:loading-loop" width={18} height={18} />
                  <span>Verifying credentials…</span>
                </>
              ) : (
                <>
                  <span>Sign In to Console</span>
                  <Icon icon="solar:arrow-right-linear" width={18} height={18} />
                </>
              )}
            </button>
          </form>

          {/* Bottom Links */}
          <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-slate-400">
            <Link
              href="/admin/setup"
              className="font-medium text-sky-400 transition hover:text-sky-300 hover:underline"
            >
              First-time setup
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1 font-medium text-slate-400 transition hover:text-white"
            >
              <Icon icon="solar:arrow-left-linear" width={14} height={14} />
              <span>Back to website</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
