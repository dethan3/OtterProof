"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const heroStats = [
  { label: "Real-time", value: "CSV + JSONL" },
  { label: "Walrus Ref", value: "Auto-gen" },
  { label: "Sui Sign", value: "Demo Wallet" }
];

const productPillars = [
  "Drag & Drop upload for CSV / JSONL with auto-schema matching",
  "Unified dashboard for Scorecards, Metrics, and Walrus/Sui receipts",
  "Connect wallet to sign & mint attestations in one flow"
];

const modules = [
  {
    title: "Upload Data",
    description: "Drag CSV/JSONL files. System automatically identifies structure and matches schema."
  },
  {
    title: "Real-time Validation",
    description: "Tusk Engine streams analysis for missing rates, duplicates, and privacy risks."
  },
  {
    title: "On-chain Attestation",
    description: "Generate Walrus receipts + Sui digests. Sign directly with your wallet."
  }
];

const workflowHighlights = [
  "File upload & format recognition integrated in Playground",
  "Unified view for Scorecards, Metrics, and Receipts",
  "Sign digests directly to simulate on-chain confirmation"
];

const heroContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 pb-16 pt-28 text-slate-100">
      <div className="pointer-events-none absolute -left-10 top-12 h-60 w-60 rounded-full bg-cyan-500/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
      <section className="relative mx-auto flex w-full max-w-5xl flex-col gap-12">
        <motion.header
          className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_420px]"
          variants={heroContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="space-y-6 text-left" variants={fadeInUp}>
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.4em] text-brand-light"
            >
              Data Validation Layer · Sui + Walrus
            </motion.span>
            <motion.h1 variants={fadeInUp} className="text-4xl font-semibold leading-tight md:text-5xl">
              OtterProof — The First Line of Defense for On-Chain Data
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-base text-slate-300 md:text-lg">
              Upload, Validate, Store on Walrus, and Sign with Sui — all in one Playground. Helping data markets and AI teams prove data quality and trust.
            </motion.p>
            <motion.div variants={fadeInUp} className="grid gap-3 sm:grid-cols-3">
              {heroStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center shadow-inner shadow-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5, ease: "easeOut" }}
                >
                  <p className="text-2xl font-bold text-brand-light">{stat.value}</p>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link
                href="/playground"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-light px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-[0_20px_45px_rgba(148,255,239,0.35)] transition hover:bg-brand-light/90"
              >
                Try Playground
              </Link>
              <a
                href="#workflow"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 hover:border-brand-light/60"
              >
                How it works &rarr;
              </a>
            </motion.div>
          </motion.div>
          <HeroReportPreview />
        </motion.header>

        <motion.section
          className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_50px_rgba(2,6,23,0.6)] md:grid-cols-2"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div>
            <h2 className="text-2xl font-semibold">Product Highlights</h2>
            <p className="mt-2 text-sm text-slate-300">A complete closed-loop experience: Validate &rarr; Attest &rarr; Sign.</p>
          </div>
          <ul className="space-y-3 text-sm text-slate-200">
            {productPillars.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-brand-light">◆</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          id="workflow"
          className="rounded-3xl border border-white/10 bg-slate-950/50 p-6 shadow-[0_20px_50px_rgba(2,6,23,0.6)]"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Workflow</p>
              <h3 className="text-2xl font-semibold">Core Process · Verify before on-chain in 3 steps</h3>
            </div>
            <Link href="/playground" className="text-sm text-brand-light hover:underline">
              Enter Playground &rarr;
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {modules.map((module, index) => (
              <motion.div
                key={module.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              >
                <p className="text-sm font-semibold text-brand-light">{module.title}</p>
                <p className="mt-2 text-sm text-slate-300">{module.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="rounded-3xl border border-white/10 bg-slate-950/50 p-6 shadow-[0_20px_50px_rgba(2,6,23,0.6)]"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-brand-light">Capabilities</p>
              <h2 className="mt-2 text-2xl font-semibold">Upload · Report · Sign Integrated</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                {workflowHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 text-brand-light">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-slate-400">
                The Playground connects Tusk API with Walrus / Sui attestation: Upload File &rarr; Score Data &rarr; View Receipt &rarr; Sign with Wallet.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Scoring Model (v0)</p>
              <ul className="mt-3 space-y-2">
                <li>· Missing Rate 45% Weight — Direct warning for required fields</li>
                <li>· Type Error 35% Weight — Enforce numeric/bool/date formats</li>
                <li>· Duplication 20% Weight — Penalize key collisions</li>
                <li>· Privacy Hits 3 pts/item — Phone/Email/ID blocks attestation</li>
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                Score &ge; 70 with no privacy hits required for attestation.
              </p>
            </div>
          </div>
        </motion.section>
      </section>
    </main>
  );
}

function HeroReportPreview() {
  const previewMetrics = [
    { label: "Missing", value: "1.2%" },
    { label: "Type Err", value: "0.8%" },
    { label: "Dup Rate", value: "0.3%" },
    { label: "Privacy", value: "0 Hits" }
  ];

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute -inset-4 -z-10 rounded-[32px] bg-gradient-to-br from-cyan-400/30 via-emerald-400/20 to-transparent blur-3xl" />
      <div className="relative space-y-5 rounded-[32px] border border-white/15 bg-slate-950/70 p-6 shadow-[0_20px_60px_rgba(2,6,23,0.8)] backdrop-blur-2xl">
        <motion.div className="flex items-center justify-between" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Walrus Report</p>
            <p className="text-lg font-semibold text-white">news_comments_demo</p>
          </div>
          <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-200">Score 92</span>
        </motion.div>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
          {previewMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.08, duration: 0.45, ease: "easeOut" }}
            >
              <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">{metric.label}</p>
              <p className="text-lg font-semibold text-white">{metric.value}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.45, ease: "easeOut" }}
        >
          <p className="uppercase tracking-[0.4em] text-slate-500">On-Chain Ref</p>
          <p className="mt-2 font-mono text-sm text-brand-light">walrus://0x94af...dd10</p>
          <p className="text-xs text-slate-400">Sui Digest · 0xd4e9...71c3</p>
        </motion.div>
        <HeroWalletChip />
      </div>
    </motion.div>
  );
}

function HeroWalletChip() {
  return (
    <motion.div
      className="relative -mb-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/90 to-slate-900/50 px-4 py-3 text-xs text-slate-200 shadow-[0_10px_30px_rgba(2,6,23,0.7)]"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.85, duration: 0.45, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="h-8 w-8 rounded-full bg-brand-light/30" />
      <div>
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Demo Wallet</p>
        <p className="font-mono text-sm text-white">0x8a4c…f207</p>
      </div>
      <span className="ml-auto rounded-full bg-brand-light/20 px-3 py-1 text-[10px] uppercase tracking-[0.4em] text-brand-light">Ready</span>
    </motion.div>
  );
}
