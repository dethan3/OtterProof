"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/playground", label: "Playground" }
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 px-4 pb-3 pt-4">
      <div className="mx-auto w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-slate-950/80 via-slate-900/80 to-slate-950/80 px-6 py-4 shadow-[0_20px_50px_rgba(2,6,23,0.7)] backdrop-blur-xl">
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-cyan-400/20 via-emerald-400/10 to-transparent blur-3xl" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3 text-lg font-semibold text-white">
              {/* <OtterMark /> */}
              <span>🦦</span>
              <span>OtterProof</span>
            </Link>
            <nav className="flex flex-1 flex-wrap items-center justify-center gap-3 text-sm text-slate-300 md:justify-center">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-full px-4 py-1.5 transition ${
                      isActive
                        ? "bg-white/10 text-brand-light shadow-[0_10px_30px_rgba(148,255,239,0.3)]"
                        : "text-slate-300 hover:text-brand-light"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200 shadow-inner shadow-white/10 transition hover:border-brand-light/60 hover:bg-brand-light/10"
              disabled
            >
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-brand-light" />
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function OtterMark() {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-teal-300/40 via-cyan-400/60 to-emerald-400/60 shadow-inner shadow-white/20">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="otter-fur" x1="8" y1="4" x2="24" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#e9fff7" stopOpacity="0.95" />
            <stop offset="1" stopColor="#a5ffe7" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="otter-muzzle" x1="11" y1="12" x2="21" y2="20" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fdf5e7" />
            <stop offset="1" stopColor="#ffe4c7" />
          </linearGradient>
          <linearGradient id="otter-orb" x1="13" y1="18" x2="19" y2="25" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#8bffe6" />
            <stop offset="1" stopColor="#4edfd0" />
          </linearGradient>
        </defs>
        <path
          d="M16 4.5c-4.9 0-8.9 4-8.9 8.9v1.2c0 5.6 3.7 10.8 8.9 13.7 5.2-2.9 8.9-8.1 8.9-13.7v-1.2c0-4.9-4-8.9-8.9-8.9z"
          fill="url(#otter-fur)"
          opacity="0.95"
        />
        <path
          d="M16 11c-3 0-5.4 2.3-5.4 5.2 0 2.7 2.3 4.9 5.4 4.9s5.4-2.2 5.4-4.9c0-2.9-2.4-5.2-5.4-5.2z"
          fill="url(#otter-muzzle)"
        />
        <circle cx="12.5" cy="12.5" r="1" fill="#0f172a" />
        <circle cx="19.5" cy="12.5" r="1" fill="#0f172a" />
        <path
          d="M14 15.6h4c.5 0 .9.4.9.9v.4c0 1.2-1 2.2-2.2 2.2h-.4c-1.2 0-2.2-1-2.2-2.2v-.4c0-.5.4-.9.9-.9z"
          fill="#0f172a"
        />
        <path d="M8.8 15.2h3.5" stroke="#0f172a" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M23.2 15.2H19.7" stroke="#0f172a" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="16" cy="21.5" r="3.3" fill="url(#otter-orb)" opacity="0.9" />
        <path
          d="M11.5 19.8c1.1 1.8 2.4 3 4.5 3s3.4-1.2 4.5-3"
          stroke="#0f172a"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <path
          d="M14.3 6.8c0 1.1-.9 2-2 2s-2-.9-2-2"
          stroke="#0f172a"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M21.7 6.8c0 1.1-.9 2-2 2s-2-.9-2-2"
          stroke="#0f172a"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
      <div className="absolute inset-0 rounded-2xl border border-white/35" />
    </div>
  );
}
