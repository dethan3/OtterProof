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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-slate-100">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-brand-light">Day 1 · Framework Ready</p>
          <h1 className="text-4xl font-semibold md:text-5xl">
            OtterProof — 数据在上链前的第一层验证防线
          </h1>
          <p className="text-base text-slate-300 md:text-lg">
            现阶段聚焦搭建 Next.js + Tailwind 的前端骨架，为后续与 Fastify 校验服务以及
            Sui Move 合约的联动打下基础。
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
              完成本地开发环境与 UI 骨架后，Day 2 可以直接接入真实校验逻辑。
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
      </section>
    </main>
  );
}
