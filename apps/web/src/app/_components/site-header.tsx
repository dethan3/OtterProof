"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@mysten/dapp-kit";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/playground", label: "Playground" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [showTicker, setShowTicker] = useState(true);

  return (
    <header className="sticky top-0 z-30 px-4 pb-4 pt-4">
      <div className="mx-auto w-full max-w-6xl space-y-3">
        {showTicker && (
          <div className="flex items-center gap-3 rounded-xl border-2 border-[#0c0b16] bg-[linear-gradient(90deg,#d9f9ff,#f7f3e8,#e2ffb1)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0c0b16] shadow-[6px_6px_0_#0c0b16]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b] ring-2 ring-[#0c0b16]" />
            Proof-ready · Walrus + Sui · CSV/JSONL
            <button
              type="button"
              onClick={() => setShowTicker(false)}
              className="ml-auto grid h-6 w-6 place-items-center rounded-lg border-2 border-[#0c0b16] bg-white text-[12px] font-black leading-none shadow-[3px_3px_0_#0c0b16] transition hover:-translate-y-0.5"
              aria-label="Close banner"
            >
              ✕
            </button>
          </div>
        )}
        <div className="relative flex flex-wrap items-center justify-between gap-3 rounded-3xl border-2 border-[#0c0b16] bg-white px-5 py-4 shadow-[10px_10px_0_#0c0b16]">
          <div className="absolute -right-6 -top-4 rotate-2 rounded-full border-2 border-[#0c0b16] bg-[#ffe76b] px-3 py-1 text-[11px] font-bold uppercase shadow-[4px_4px_0_#0c0b16]">
            Beta
          </div>
          <Link href="/" className="flex items-center gap-3 text-lg font-black tracking-tight text-[#0c0b16]">
            <span className="grid h-10 w-10 place-items-center rounded-2xl border-2 border-[#0c0b16] bg-[#7ef5dc] text-2xl shadow-[4px_4px_0_#0c0b16]">
              🦦
            </span>
            <span className="leading-none">
              OtterProof
              <span className="ml-2 inline-flex rounded-full border border-[#0c0b16] bg-[#d9f9ff] px-2 py-[3px] text-[10px] font-semibold uppercase tracking-[0.24em] align-middle shadow-[3px_3px_0_#0c0b16]">
                Data Proofs
              </span>
            </span>
          </Link>
          <nav className="flex flex-1 flex-wrap items-center justify-center gap-2 text-sm font-semibold md:justify-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 rounded-full border-2 border-[#0c0b16] px-4 py-2 uppercase tracking-[0.16em] shadow-[4px_4px_0_#0c0b16] transition ${
                    isActive ? "bg-[#7ef5dc] text-[#0c0b16]" : "bg-white text-[#0c0b16] hover:bg-[#ffe76b]"
                  }`}
                >
                  <span className="grid h-4 w-4 place-items-center rounded-[6px] border border-[#0c0b16] bg-white text-[10px]">
                    {isActive ? "■" : "□"}
                  </span>
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3 rounded-2xl border-2 border-[#0c0b16] bg-[#7ef5dc] px-3 py-2 text-[#0c0b16] shadow-[5px_5px_0_#0c0b16]">
            <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0c0b16]">
              Connect
            </span>
            <ConnectButton />
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
