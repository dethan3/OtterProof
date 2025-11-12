import { ValidationPlayground } from "./_components/validation-playground";

const heroStats = [
  { label: "Day4 交付", value: "UI + Wallet Ready" },
  { label: "Walrus 引用", value: "实时生成" },
  { label: "Sui 签名", value: "Demo 钱包" }
];

const dayFourGoals = [
  "拖拽上传 CSV / JSONL，一键注入校验引擎",
  "指标图表 + 存证回执可视化，便于分享",
  "示例钱包连接与签名，串联 Walrus → Sui 流程"
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

const dayFourHighlights = [
  "新增文件上传控件，自动检测格式并注入 Playground",
  "评分卡 + 指标图表 + Walrus / Sui 回执在同一视图展示",
  "Demo 钱包接入，可模拟 Sui 签名确认上链摘要"
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 py-12 text-slate-100">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <header className="space-y-6 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-brand-light">
            Day 3 → Day 4 · UI + Wallet Loop
          </p>
          <h1 className="text-4xl font-semibold md:text-5xl">OtterProof — 数据在上链前的第一层验证防线</h1>
          <p className="text-base text-slate-300 md:text-lg">
            Day 4 对准“可演示体验”：拖拽上传、指标图表、Walrus / Sui 回执以及示例钱包签名，完整体现验证→存证闭环。
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
            <h2 className="text-2xl font-semibold">Day 4 Focus</h2>
            <p className="mt-2 text-sm text-slate-400">
              UI / 交互升级，补齐文件上传、可视指标与钱包签名体验。
            </p>
          </div>
          <ul className="space-y-3 text-sm text-slate-200">
            {dayFourGoals.map((goal) => (
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
              <p className="text-sm uppercase tracking-[0.4em] text-brand-light">Day 4 Deliverables</p>
              <h2 className="mt-2 text-2xl font-semibold">上传 · 报告 · 签名一体化</h2>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                {dayFourHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 text-brand-light">◆</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-slate-400">
                下方 Playground 直接串联 Fastify API 与 Walrus/Sui 存证演示：上传文件 → 校验评分 → 查看摘要 → 连接钱包模拟签名。
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
