import Link from "next/link";

import { ValidationPlayground } from "../_components/validation-playground";

export default function PlaygroundPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] px-6 pb-16 pt-12 text-[#0c0b16]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(126,245,220,0.35),transparent_30%),radial-gradient(circle_at_75%_10%,rgba(255,231,107,0.45),transparent_25%),radial-gradient(circle_at_70%_70%,rgba(196,181,255,0.35),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(12,11,22,0.05),transparent_40%,rgba(12,11,22,0.08))]" />
      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="space-y-4 rounded-3xl border-2 border-[#0c0b16] bg-white px-6 py-6 shadow-[12px_12px_0_#0c0b16]">
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#0c0b16] bg-[#d9f9ff] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] shadow-[6px_6px_0_#0c0b16]">
            Playground · Walrus + Sui
            <span className="h-2 w-2 rounded-full bg-[#ff6b6b] ring-2 ring-[#0c0b16]" />
          </div>
          <h1 className="text-4xl font-black leading-[1.05] md:text-5xl">Real-time data validation and attestation playground</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-[#1f2937] md:text-xl">
            Upload CSV / JSONL datasets, inspect validation metrics, Walrus blob references, and Sui transaction digests,
            then complete the signing flow with a demo wallet. This is a thin, opinionated UI built directly on top of
            the Tusk SDK and the underlying Walrus + Sui rails.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em]">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#0c0b16] bg-[#ffe76b] px-4 py-2 text-[#0c0b16] shadow-[6px_6px_0_#0c0b16] transition hover:-translate-y-0.5"
            >
              Back to home ↗
            </Link>
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#0c0b16] bg-[#7ef5dc] px-4 py-2 text-[#0c0b16] shadow-[6px_6px_0_#0c0b16]">
              Data formats: CSV / JSONL
            </span>
          </div>
        </header>

        <ValidationPlayground />
      </section>
    </main>
  );
}
