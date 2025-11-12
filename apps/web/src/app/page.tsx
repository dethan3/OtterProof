import { ValidationPlayground } from "./_components/validation-playground";

const heroStats = [
  { label: "验证吞吐", value: "5GB/min" },
  { label: "精度评分", value: "> 92" },
  { label: "Walrus 引用", value: "链上可追溯" }
];

const dayOneGoals = [
  "初始化 Monorepo 与工具链",
  "搭建 Next.js 前端框架",
  "预留与 Fastify API 的集成通道"
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
    title: "生成报告",
    description: "报告通过 Walrus 永久存储，哈希摘要提交至 Sui。"
  }
];

const dayTwoHighlights = [
  "流式解析 CSV / JSONL，控制在 2k 行以内快速反馈",
  "Schema 级缺失率、类型错误、重复率的指标与扣分模型",
  "隐私命中（邮箱/手机号/ID）实时阻断 + Rectify 建议"
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-slate-100">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-brand-light">
            Day 1 → Day 2 · Engine Online
          </p>
          <h1 className="text-4xl font-semibold md:text-5xl">
            OtterProof — 数据在上链前的第一层验证防线
          </h1>
          <p className="text-base text-slate-300 md:text-lg">
            第一天完成 Monorepo 骨架后，Day 2 聚焦 CSV/JSONL 校验引擎与评分模型，输出可直接上链的报告。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {heroStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-800/80 bg-slate-900/60 px-6 py-4">
                <p className="text-2xl font-bold text-brand-light">{stat.value}</p>
                <p className="text-xs uppercase tracking-widest text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="grid gap-6 rounded-3xl border border-slate-800/60 bg-slate-900/30 p-6 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">今日目标</h2>
            <p className="mt-2 text-sm text-slate-400">
              完成本地开发环境与 UI 骨架，并逐步扩展到真实校验逻辑与报告。
            </p>
          </div>
          <ul className="space-y-3 text-sm text-slate-200">
            {dayOneGoals.map((goal) => (
              <li key={goal} className="flex items-center gap-2">
                <span className="text-brand-light">◆</span>
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-slate-800/60 bg-slate-900/30 p-6">
          <h3 className="text-lg font-semibold uppercase tracking-[0.3em] text-slate-400">核心流程</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {modules.map((module) => (
              <div key={module.title} className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4">
                <p className="text-sm font-semibold text-brand-light">{module.title}</p>
                <p className="mt-2 text-sm text-slate-300">{module.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800/60 bg-slate-900/30 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-brand-light">Day 2 Deliverables</p>
              <h2 className="mt-2 text-2xl font-semibold">CSV / JSONL 校验 + 可视化评分</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                {dayTwoHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 text-brand-light">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-slate-400">
                下方 Playground 直接调用 Fastify API，展示缺失率、类型错误、隐私命中以及打分结构，便于 Day
                3 接入 Walrus + Sui。
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800/70 bg-slate-900/50 p-4 text-sm text-slate-300">
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
          <div className="mt-6">
            <ValidationPlayground />
          </div>
        </section>
      </section>
    </main>
  );
}
