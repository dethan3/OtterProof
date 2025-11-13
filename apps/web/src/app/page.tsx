"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const heroStats = [
  { label: "实时校验", value: "CSV + JSONL" },
  { label: "Walrus 引用", value: "自动生成" },
  { label: "Sui 签名", value: "Demo 钱包" }
];

const productPillars = [
  "拖拽上传 CSV / JSONL，自动匹配 Schema",
  "评分卡、指标图表与 Walrus / Sui 回执同屏展示",
  "示例钱包连接与签名，串联验证 → 存证流程"
];

const modules = [
  {
    title: "上传数据",
    description: "拖拽 CSV/JSONL，系统自动识别结构并选择匹配的 Schema。"
  },
  {
    title: "实时校验",
    description: "Fastify 校验引擎流式分析缺失率、重复率与隐私风险。"
  },
  {
    title: "链上签名",
    description: "Walrus 回执 + Sui 摘要，示例钱包可直接签署摘要。"
  }
];

const workflowHighlights = [
  "文件上传与格式识别完全集成在 Playground",
  "评分卡、指标、Walrus / Sui 回执一体化展示",
  "Demo 钱包可直接签署摘要，模拟上链确认"
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
              OtterProof — 数据在上链前的第一层验证防线
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-base text-slate-300 md:text-lg">
              拖拽上传、实时校验、Walrus 存证与 Sui 签名串联在一个 Playground，帮助数据市场与 AI 团队快速证明数据质量与可信度。
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
                立即体验 Playground
              </Link>
              <a
                href="#workflow"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 hover:border-brand-light/60"
              >
                了解验证流程 →
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
            <h2 className="text-2xl font-semibold">产品亮点</h2>
            <p className="mt-2 text-sm text-slate-300">围绕“验证 → 存证 → 签名”打造可直接演示的闭环体验。</p>
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
              <h3 className="text-2xl font-semibold">核心流程 · 3 步完成上链前验证</h3>
            </div>
            <Link href="/playground" className="text-sm text-brand-light hover:underline">
              进入 Playground →
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
              <p className="text-sm uppercase tracking-[0.4em] text-brand-light">能力一览</p>
              <h2 className="mt-2 text-2xl font-semibold">上传 · 报告 · 签名一体化</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                {workflowHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 text-brand-light">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-slate-400">
                Playground 串联 Fastify API 与 Walrus / Sui 存证：上传文件 → 校验评分 → 查看摘要 → 连接钱包模拟签名。
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">评分模型 (v0)</p>
              <ul className="mt-3 space-y-2">
                <li>· 缺失率 45% 权重 — 必填字段缺失直接触发警告</li>
                <li>· 类型错误 35% 权重 — 统一数值/布尔/时间格式</li>
                <li>· 重复率 20% 权重 — 主键组合冲突即扣分</li>
                <li>· 隐私命中 3 分/条 — 邮箱/手机号/ID 立即阻断上链</li>
              </ul>
              <p className="mt-3 text-xs text-slate-500">
                得分 ≥ 70 且无隐私命中即可上链，否则给出整改建议。
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
    { label: "缺失率", value: "1.2%" },
    { label: "类型错误", value: "0.8%" },
    { label: "重复率", value: "0.3%" },
    { label: "隐私命中", value: "0 条" }
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
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Walrus 报告</p>
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
          <p className="uppercase tracking-[0.4em] text-slate-500">链上引用</p>
          <p className="mt-2 font-mono text-sm text-brand-light">walrus://0x94af...dd10</p>
          <p className="text-xs text-slate-400">Sui 摘要 · 0xd4e9...71c3</p>
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
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500">Demo 钱包</p>
        <p className="font-mono text-sm text-white">0x8a4c…f207</p>
      </div>
      <span className="ml-auto rounded-full bg-brand-light/20 px-3 py-1 text-[10px] uppercase tracking-[0.4em] text-brand-light">Ready</span>
    </motion.div>
  );
}
