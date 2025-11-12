"use client";

import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api";

type SchemaField = {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  example?: string;
};

type SchemaOption = {
  id: string;
  title: string;
  description: string;
  format: string[];
  fields: SchemaField[];
};

type Issue = {
  code: string;
  level: "error" | "warn";
  message: string;
  field?: string;
  row?: number;
};

type ValidationReport = {
  datasetName: string;
  schemaId: string;
  format: string;
  totalRows: number;
  score: number;
  passed: boolean;
  generatedAt: string;
  metrics: {
    rowCount: number;
    missingRate: number;
    invalidRate: number;
    duplicateRate: number;
    privacyFindings: number;
    fieldStats: Record<string, { missing: number; invalid: number }>;
  };
  issues: Issue[];
  scoreBreakdown: { label: string; deduction: number; reason: string }[];
  recommendations: string[];
};

type ValidationResponse = {
  schema: SchemaOption;
  report: ValidationReport;
  steps: string[];
};

const SAMPLE_DATA: Record<"csv" | "jsonl", string> = {
  csv: `record_id,user_handle,comment,language,sentiment_score,created_at,contains_pii
1,user_alpha,"The walrus is awesome",en,0.92,2024-06-01T09:10:34.000Z,false
2,user_beta,"Data validation keeps us safe",en,0.44,2024-06-01T10:00:00.000Z,false
3,user_gamma,"Email me at founder@otterproof.io",en,0.12,2024-06-01T11:05:00.000Z,false`,
  jsonl: `{"record_id":"prompt_001","prompt_text":"Summarize this article","category":"news","toxicity_score":0.11,"source":"community","last_used_at":"2024-06-03T10:00:00.000Z"}
{"record_id":"prompt_002","prompt_text":"Classify sentiment","category":"analysis","toxicity_score":0.05,"source":"lab","last_used_at":"2024-06-02T11:00:00.000Z"}
{"record_id":"prompt_003","prompt_text":"Contact me at 18800000000","category":"other","toxicity_score":0.77,"source":"unknown","last_used_at":"2024-06-01T08:30:00.000Z"}`
};

type FormState = {
  datasetName: string;
  schemaId: string;
  format: "csv" | "jsonl";
  content: string;
};

export function ValidationPlayground() {
  const [schemas, setSchemas] = useState<SchemaOption[]>([]);
  const [form, setForm] = useState<FormState>({
    datasetName: "news_comments_demo",
    schemaId: "",
    format: "csv",
    content: SAMPLE_DATA.csv
  });
  const [loading, setLoading] = useState(false);
  const [schemaLoading, setSchemaLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ValidationResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchSchemas() {
      setSchemaLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/schemas`);
        if (!res.ok) {
          throw new Error("Failed to load schemas");
        }
        const body = (await res.json()) as SchemaOption[];
        if (cancelled) return;
        setSchemas(body);
        setForm((prev) => ({
          ...prev,
          schemaId: prev.schemaId || body[0]?.id || "",
          format: (body[0]?.format?.[0] as FormState["format"]) || prev.format
        }));
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("无法加载 Schema 列表，请确认 Fastify API 已启动。");
        }
      } finally {
        if (!cancelled) {
          setSchemaLoading(false);
        }
      }
    }
    fetchSchemas();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedSchema = useMemo(
    () => schemas.find((schema) => schema.id === form.schemaId),
    [schemas, form.schemaId]
  );

  const metrics = result?.report.metrics;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? body.errors?.[0]?.message ?? "校验失败");
      }

      const payload = (await response.json()) as ValidationResponse;
      setResult(payload);
    } catch (err) {
      console.error(err);
      setResult(null);
      setError(err instanceof Error ? err.message : "提交校验失败");
    } finally {
      setLoading(false);
    }
  }

  function updateForm(partial: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...partial }));
  }

  function applySampleData() {
    updateForm({ content: SAMPLE_DATA[form.format] });
  }

  function formatPercent(value: number) {
    return `${(value * 100).toFixed(1)}%`;
  }

  return (
    <div className="rounded-3xl border border-slate-800/70 bg-slate-900/40 p-6 shadow-2xl shadow-slate-950/60">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-brand-light/80">Day 2</p>
          <h2 className="text-2xl font-semibold">校验引擎 · CSV / JSONL</h2>
          <p className="text-sm text-slate-400">
            将数据集内容直接粘贴在下方，一键生成评分、指标与整改建议。
          </p>
        </div>
        <button
          type="button"
          className="rounded-full border border-brand-light px-4 py-2 text-sm text-brand-light hover:bg-brand-light/10"
          onClick={applySampleData}
        >
          使用示例数据
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400">数据集名称</label>
            <input
              className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 focus:border-brand-light focus:outline-none"
              value={form.datasetName}
              onChange={(event) => updateForm({ datasetName: event.target.value })}
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">Schema 模板</label>
            <select
              disabled={schemaLoading || !schemas.length}
              className="mt-1 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 focus:border-brand-light focus:outline-none disabled:opacity-40"
              value={form.schemaId}
              onChange={(event) => updateForm({ schemaId: event.target.value })}
            >
              {schemas.map((schema) => (
                <option key={schema.id} value={schema.id}>
                  {schema.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="text-sm text-slate-400">数据格式</p>
            <div className="mt-2 flex gap-3">
              {(["csv", "jsonl"] as const).map((format) => (
                <label
                  key={format}
                  className={`cursor-pointer rounded-2xl border px-4 py-2 text-sm uppercase tracking-wide ${
                    form.format === format
                      ? "border-brand-light bg-brand-light/20 text-brand-light"
                      : "border-slate-800 text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name="dataset-format"
                    value={format}
                    checked={form.format === format}
                    onChange={() => updateForm({ format, content: SAMPLE_DATA[format] })}
                  />
                  {format}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-400">数据内容</label>
            <textarea
              className="mt-1 h-56 w-full rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-2 text-sm text-slate-100 focus:border-brand-light focus:outline-none"
              value={form.content}
              onChange={(event) => updateForm({ content: event.target.value })}
              spellCheck={false}
            />
            <p className="mt-2 text-xs text-slate-500">
              Day 2 Demo 限制 2,000 行/750KB；可直接复制 CSV 或 JSONL。
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-brand-light/80 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 transition hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "校验中..." : "运行校验 + 打分"}
          </button>
        </form>

        <div className="space-y-4">
          <section className="rounded-3xl border border-slate-800/70 bg-slate-950/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Schema</p>
                <h3 className="text-lg font-semibold text-slate-100">
                  {selectedSchema?.title ?? "加载中..."}
                </h3>
                <p className="text-sm text-slate-400">{selectedSchema?.description}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {selectedSchema?.fields.map((field) => (
                <div
                  key={field.name}
                  className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/40 px-4 py-2 text-xs text-slate-300"
                >
                  <div>
                    <p className="font-semibold text-slate-100">{field.name}</p>
                    <p className="text-[11px] text-slate-500">{field.description}</p>
                  </div>
                  <div className="text-right text-[11px] uppercase tracking-widest text-slate-400">
                    {field.type} {field.required ? "· 必填" : ""}
                  </div>
                </div>
              )) ?? (
                <p className="text-sm text-slate-500">等待加载 Schema...</p>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800/70 bg-slate-950/30 p-4">
            {result ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Score</p>
                    <p className="text-5xl font-bold text-brand-light">{result.report.score}</p>
                  </div>
                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      result.report.passed
                        ? "bg-emerald-500/20 text-emerald-200"
                        : "bg-amber-500/20 text-amber-200"
                    }`}
                  >
                    {result.report.passed ? "可上链" : "需整改"}
                  </span>
                </div>

                {metrics && (
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
                    <MetricTile label="缺失率" value={formatPercent(metrics.missingRate)} />
                    <MetricTile label="类型错误" value={formatPercent(metrics.invalidRate)} />
                    <MetricTile label="重复率" value={formatPercent(metrics.duplicateRate)} />
                    <MetricTile label="隐私命中" value={`${metrics.privacyFindings} 条`} />
                  </div>
                )}

                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Score Breakdown</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-300">
                    {result.report.scoreBreakdown.length ? (
                      result.report.scoreBreakdown.map((item) => (
                        <li key={item.label} className="flex items-center justify-between rounded-2xl border border-slate-800/70 bg-slate-900/40 px-3 py-2">
                          <span>{item.label}</span>
                          <span className="text-slate-400">
                            -{item.deduction} · {item.reason}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">暂无扣分因素</li>
                    )}
                  </ul>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Issues</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-300">
                    {result.report.issues.length ? (
                      result.report.issues.slice(0, 6).map((issue, index) => (
                        <li
                          key={`${issue.code}-${index}`}
                          className="rounded-2xl border border-slate-800/70 bg-slate-900/40 px-3 py-2"
                        >
                          <span className="font-semibold text-brand-light">{issue.level.toUpperCase()}</span>{" "}
                          {issue.message}
                          {issue.field ? <span className="text-slate-500"> · {issue.field}</span> : null}
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500">未发现阻断问题</li>
                    )}
                  </ul>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-500">建议</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                    {result.report.recommendations.length ? (
                      result.report.recommendations.map((suggestion) => (
                        <li key={suggestion}>{suggestion}</li>
                      ))
                    ) : (
                      <li className="text-slate-500">数据质量达标，可直接生成报告。</li>
                    )}
                  </ul>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-slate-500">流程</p>
                  <ol className="mt-2 space-y-2 text-sm text-slate-300">
                    {result.steps.map((step) => (
                      <li key={step} className="rounded-2xl border border-slate-800/70 bg-slate-900/40 px-3 py-2">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-slate-400">
                <p>提交数据后，系统会展示：</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>整体评分与通过状态</li>
                  <li>缺失率 / 重复率 / 隐私命中</li>
                  <li>主要问题 & 整改建议</li>
                  <li>Walrus + Sui 上链步骤</li>
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

type MetricTileProps = {
  label: string;
  value: string;
};

function MetricTile({ label, value }: MetricTileProps) {
  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-900/40 px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="text-lg font-semibold text-slate-100">{value}</p>
    </div>
  );
}
