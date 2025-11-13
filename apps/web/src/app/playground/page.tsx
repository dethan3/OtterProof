import Link from "next/link";

import { ValidationPlayground } from "../_components/validation-playground";

export default function PlaygroundPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 pb-16 pt-28 text-slate-100">
      <div className="pointer-events-none absolute left-0 top-10 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
      <section className="relative mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="space-y-4 text-center md:text-left">
          <p className="text-sm uppercase tracking-[0.4em] text-brand-light">Playground</p>
          <h1 className="text-4xl font-semibold md:text-5xl">实时数据校验 + 存证演示</h1>
          <p className="text-base text-slate-300 md:text-lg">
            上传 CSV / JSONL，查看评分、Walrus 引用与 Sui 摘要回执，并使用示例钱包完成签名流程。
          </p>
          <div className="text-sm text-slate-400">
            <Link href="/" className="text-brand-light hover:underline">
              返回产品首页
            </Link>
          </div>
        </header>

        <ValidationPlayground />
      </section>
    </main>
  );
}
