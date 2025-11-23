"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const heroStats = [
  { label: "Formats", value: "CSV + JSONL", accent: "bg-[#ffe76b]" },
  { label: "Walrus Ref", value: "Auto-generated", accent: "bg-[#7ef5dc]" },
  { label: "Sui Sign", value: "Demo wallet ready", accent: "bg-[#c4b5ff]" }
];

const featureHighlights = [
  "Drag & drop data. Schema snapped. No fragile manual mapping.",
  "Scorecards, metrics, receipts, and signatures live in one loud dashboard.",
  "Walrus storage + Sui signing bundled as a single proof-first workflow."
];

const modules = [
  {
    title: "Upload → Lock schema",
    description: "Drop CSV/JSONL, inspect columns instantly, and freeze the structure before any attestation."
  },
  {
    title: "Real-time scoring",
    description: "Tusk Engine streams missing rates, dupes, types, and privacy hits with pixel-grid visuals."
  },
  {
    title: "Attest + Sign",
    description: "Mint Walrus receipts, surface Sui digests, and sign straight from the Playground."
  }
];

const workflowHighlights = [
  "File recognition + schema hinting lives inside the Playground panel",
  "Single screen for Scorecards, Metrics, and Walrus receipts",
  "Sign digests directly to simulate on-chain confirmation"
];

const badgeTicker = ["Proof-first mindset", "Neo-brutal interface", "Walrus + Sui native", "Privacy hits blocked"];

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
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)] px-6 pb-20 pt-10 text-[#0c0b16]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(126,245,220,0.35),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(255,231,107,0.45),transparent_25%),radial-gradient(circle_at_70%_60%,rgba(196,181,255,0.35),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(12,11,22,0.05),transparent_40%,rgba(12,11,22,0.08))]" />
      <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-12">
        <motion.header
          className="grid items-start gap-10 lg:grid-cols-[1.05fr_0.95fr]"
          variants={heroContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="space-y-7 text-left" variants={fadeInUp}>
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#0c0b16] bg-[#d9f9ff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] shadow-[6px_6px_0_#0c0b16]"
            >
              Neo-Brutal Data Proofs
              <span className="h-2 w-2 rounded-full bg-[#ff6b6b] ring-2 ring-[#0c0b16]" />
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl font-black leading-[1.05] tracking-tight md:text-5xl lg:text-6xl"
            >
              为 AI 市场
              <br />
              输出可信的 <span className="underline decoration-[12px] decoration-[#ffe76b]">数据证明</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="max-w-2xl text-lg leading-relaxed text-[#1f2937] md:text-xl">
              Upload CSV/JSONL, auto-score quality, anchor receipts on Walrus, and sign with Sui — all inside a playful,
              high-contrast Playground built for teams shipping data markets.
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link
                href="/playground"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#0c0b16] bg-[#0c0b16] px-7 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white shadow-[8px_8px_0_#0c0b16] transition hover:-translate-y-1 hover:shadow-[12px_12px_0_#0c0b16]"
              >
                Launch Playground
              </Link>
              <a
                href="#workflow"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#0c0b16] bg-[#ffe76b] px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-[#0c0b16] shadow-[6px_6px_0_#0c0b16] transition hover:-translate-y-1"
              >
                查看流程 →
              </a>
            </motion.div>
            <motion.div variants={fadeInUp} className="grid gap-3 sm:grid-cols-3">
              {heroStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className={`rounded-2xl border-2 border-[#0c0b16] ${stat.accent} px-4 py-4 text-left shadow-[8px_8px_0_#0c0b16]`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5, ease: "easeOut" }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em]">{stat.label}</p>
                  <p className="mt-2 text-2xl font-black leading-tight text-[#0c0b16]">{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border-2 border-dashed border-[#0c0b16] bg-white/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.22em] shadow-[6px_6px_0_#0c0b16]">
              {badgeTicker.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 rounded-full border border-[#0c0b16] bg-[#f7f3e8] px-3 py-[6px] text-[#0c0b16]"
                >
                  <span className="grid h-2.5 w-2.5 place-items-center rounded-full bg-[#7ef5dc] border border-[#0c0b16]" />
                  {item}
                </span>
              ))}
            </div>
          </motion.div>
          <HeroStickerBoard />
        </motion.header>

        <motion.section
          className="grid gap-6 rounded-3xl border-2 border-[#0c0b16] bg-white p-6 shadow-[12px_12px_0_#0c0b16] lg:grid-cols-[1fr_1.1fr]"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#0c0b16]">Product Highlights</p>
            <h2 className="text-3xl font-black leading-tight text-[#0c0b16]">Loud, playful, but strict on data.</h2>
            <p className="text-sm text-[#1f2937]">
              Every card carries a thick outline because every step is auditable. Upload → Validate → Attest → Sign,
              without leaving the Playground.
            </p>
          </div>
          <ul className="space-y-4 text-sm text-[#0c0b16]">
            {featureHighlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border-2 border-[#0c0b16] bg-[#d9f9ff] px-4 py-3 font-semibold leading-relaxed shadow-[8px_8px_0_#0c0b16]"
              >
                <span className="mt-1 grid h-5 w-5 place-items-center rounded-md border border-[#0c0b16] bg-white text-[12px] font-black">
                  ☑
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section
          id="workflow"
          className="rounded-3xl border-2 border-[#0c0b16] bg-[#0c0b16] p-6 text-white shadow-[12px_12px_0_#0c0b16]"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7ef5dc]">Workflow</p>
              <h3 className="mt-2 text-3xl font-black leading-tight text-[#ffe76b]">验证 → 存储 → 签名</h3>
              <p className="mt-2 max-w-2xl text-sm text-slate-200">
                Built to feel like a sticker sheet but wired for rigorous data control. Follow the steps, ship proofs.
              </p>
            </div>
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 rounded-full border-2 border-white bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-[#0c0b16] shadow-[6px_6px_0_#7ef5dc]"
            >
              Enter Playground ↗
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {modules.map((module, index) => (
              <motion.div
                key={module.title}
                className="relative rounded-2xl border-2 border-white/70 bg-white/10 p-5 shadow-[8px_8px_0_rgba(255,255,255,0.2)]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              >
                <span className="absolute -left-3 -top-3 grid h-8 w-8 place-items-center rounded-full border-2 border-[#0c0b16] bg-[#ffe76b] text-base font-black text-[#0c0b16] shadow-[5px_5px_0_#0c0b16]">
                  {index + 1}
                </span>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[#7ef5dc]">{module.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-100">{module.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="rounded-3xl border-2 border-[#0c0b16] bg-white p-6 shadow-[12px_12px_0_#0c0b16]"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0c0b16]">Capabilities</p>
              <h2 className="text-3xl font-black leading-tight text-[#0c0b16]">Upload · Report · Sign，一张桌面完成</h2>
              <ul className="space-y-3 text-sm text-[#0c0b16]">
                {workflowHighlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border-2 border-[#0c0b16] bg-[#c4b5ff]/40 px-4 py-3 font-semibold leading-relaxed shadow-[8px_8px_0_#0c0b16]"
                  >
                    <span className="mt-1 text-lg font-black text-[#0c0b16]">✱</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-[#1f2937]">
                Playground 把 Tusk API、Walrus 存储以及 Sui 签名塞进同一流中。上传文件 → 评分 → 查看 Walrus 引用 →
                用钱包签名，整个链路一次完成。
              </p>
            </div>
            <div className="relative space-y-4 rounded-2xl border-2 border-[#0c0b16] bg-[#f7f3e8] p-5 shadow-[10px_10px_0_#0c0b16]">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0c0b16]">Scoring Model (v0)</p>
              <ul className="space-y-2 text-sm text-[#0c0b16]">
                <li className="flex items-center gap-2 font-semibold">
                  <span className="grid h-3 w-3 place-items-center rounded-[6px] border border-[#0c0b16] bg-[#ffe76b]" />
                  Missing Rate 45% — required fields trigger direct warnings
                </li>
                <li className="flex items-center gap-2 font-semibold">
                  <span className="grid h-3 w-3 place-items-center rounded-[6px] border border-[#0c0b16] bg-[#7ef5dc]" />
                  Type Error 35% — enforce numeric / bool / date formats
                </li>
                <li className="flex items-center gap-2 font-semibold">
                  <span className="grid h-3 w-3 place-items-center rounded-[6px] border border-[#0c0b16] bg-[#c4b5ff]" />
                  Duplication 20% — penalize primary-key collisions
                </li>
                <li className="flex items-center gap-2 font-semibold">
                  <span className="grid h-3 w-3 place-items-center rounded-[6px] border border-[#0c0b16] bg-[#ffb4d3]" />
                  Privacy Hits 3 pts/item — phone / email / ID block attestation
                </li>
              </ul>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#0c0b16]">
                Score ≥ 70 且无隐私命中方可出链。
              </p>
            </div>
          </div>
        </motion.section>
      </section>
    </main>
  );
}

function HeroStickerBoard() {
  const previewMetrics = [
    { label: "Missing", value: "1.2%", tone: "bg-[#ffe76b]" },
    { label: "Type Err", value: "0.8%", tone: "bg-[#7ef5dc]" },
    { label: "Dup Rate", value: "0.3%", tone: "bg-[#c4b5ff]" },
    { label: "Privacy", value: "0 Hits", tone: "bg-[#ffb4d3]" }
  ];

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
    >
      <div className="absolute -left-8 -top-8 rotate-[-4deg] rounded-2xl border-2 border-[#0c0b16] bg-[#ffe76b] px-4 py-2 text-xs font-black uppercase tracking-[0.3em] text-[#0c0b16] shadow-[8px_8px_0_#0c0b16]">
        Walrus Ready
      </div>
      <div className="absolute -right-6 top-20 rotate-3 rounded-xl border-2 border-[#0c0b16] bg-[#7ef5dc] px-3 py-1 text-[11px] font-black uppercase tracking-[0.3em] text-[#0c0b16] shadow-[6px_6px_0_#0c0b16]">
        Live score
      </div>
      <div className="relative space-y-5 rounded-[30px] border-2 border-[#0c0b16] bg-white p-6 shadow-[14px_14px_0_#0c0b16]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#0c0b16]/80">Walrus Report</p>
            <p className="text-lg font-black text-[#0c0b16]">news_comments_demo</p>
          </div>
          <span className="rounded-full border-2 border-[#0c0b16] bg-[#7ef5dc] px-3 py-1 text-xs font-black uppercase tracking-[0.24em] text-[#0c0b16] shadow-[4px_4px_0_#0c0b16]">
            Score 92
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-[#0c0b16]">
          {previewMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className={`rounded-2xl border-2 border-[#0c0b16] ${metric.tone} px-4 py-3 shadow-[6px_6px_0_#0c0b16]`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.08, duration: 0.45, ease: "easeOut" }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#0c0b16]">{metric.label}</p>
              <p className="mt-1 text-lg font-black text-[#0c0b16]">{metric.value}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="rounded-2xl border-2 border-[#0c0b16] bg-[#f7f3e8] p-4 text-xs text-[#0c0b16] shadow-[8px_8px_0_#0c0b16]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.45, ease: "easeOut" }}
        >
          <p className="font-semibold uppercase tracking-[0.3em] text-[#0c0b16]">On-Chain Ref</p>
          <p className="mt-2 font-mono text-sm text-[#0c0b16]">walrus://0x94af...dd10</p>
          <p className="text-xs text-[#0c0b16]/70">Sui Digest · 0xd4e9...71c3</p>
        </motion.div>
        <HeroWalletChip />
      </div>
    </motion.div>
  );
}

function HeroWalletChip() {
  return (
    <motion.div
      className="relative -mb-2 flex items-center gap-3 rounded-2xl border-2 border-[#0c0b16] bg-[#0c0b16] px-4 py-3 text-xs text-white shadow-[10px_10px_0_#0c0b16]"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.85, duration: 0.45, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="grid h-9 w-9 place-items-center rounded-xl border-2 border-white bg-[#7ef5dc] text-lg font-black text-[#0c0b16]">
        ₿
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#7ef5dc]">Demo Wallet</p>
        <p className="font-mono text-sm font-semibold text-white">0x8a4c…f207</p>
      </div>
      <span className="ml-auto rounded-full border-2 border-white bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-[#0c0b16] shadow-[4px_4px_0_#7ef5dc]">
        Ready
      </span>
    </motion.div>
  );
}
