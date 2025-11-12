"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  walrusRef?: string;
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

type NotarizationReceipt = {
  issuedAt: string;
  walrus: {
    reference: string;
    endpoint: string;
    contentHash: string;
    datasetName: string;
    schemaId: string;
    payloadSize: number;
    requestId: string;
  };
  sui: {
    digest: string;
    objectId: string;
    payloadHash: string;
    rpcUrl: string;
    description: string;
  };
};

type ValidationResponse = {
  schema: SchemaOption;
  report: ValidationReport;
  steps: string[];
  notarization?: NotarizationReceipt;
  publishRequested: boolean;
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
  publish: boolean;
};

type UploadInfo = {
  fileName: string;
  size: number;
  format: FormState["format"];
  lastUpdated: string;
};

type DemoWallet = {
  address: string | null;
  signature: string | null;
  signing: boolean;
  connect: () => void;
  disconnect: () => void;
  resetSignature: () => void;
  signMessage: (message: string) => Promise<string>;
};

export function ValidationPlayground() {
  const [schemas, setSchemas] = useState<SchemaOption[]>([]);
  const [form, setForm] = useState<FormState>({
    datasetName: "news_comments_demo",
    schemaId: "",
    format: "csv",
    content: SAMPLE_DATA.csv,
    publish: false
  });
  const [loading, setLoading] = useState(false);
  const [schemaLoading, setSchemaLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ValidationResponse | null>(null);
  const [uploadInfo, setUploadInfo] = useState<UploadInfo | null>(null);
  const [uploading, setUploading] = useState(false);
  const wallet = useDemoWallet();
  const { resetSignature, signMessage } = wallet;

  const updateForm = useCallback((partial: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  }, []);

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

  const publishState = result ? result.publishRequested : form.publish;

  const signaturePayload = useMemo(() => {
    if (!result?.notarization) {
      return null;
    }

    return JSON.stringify(
      {
        dataset: result.report.datasetName,
        score: result.report.score,
        walrusRef: result.notarization.walrus.reference,
        suiDigest: result.notarization.sui.digest,
        issuedAt: result.notarization.issuedAt
      },
      null,
      2
    );
  }, [result]);

  useEffect(() => {
    if (!result?.report.generatedAt) {
      return;
    }
    resetSignature();
  }, [resetSignature, result?.report.generatedAt]);

  const handleFileSelection = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        const inferredFormat: FormState["format"] = file.name.toLowerCase().endsWith(".jsonl") ? "jsonl" : "csv";
        const content = await file.text();
        const datasetFromFile = file.name.replace(/\.[^.]+$/, "");
        const shouldReplaceName =
          !form.datasetName.length ||
          form.datasetName === "news_comments_demo" ||
          form.datasetName === uploadInfo?.fileName?.replace(/\.[^.]+$/, "");

        updateForm({
          content,
          format: inferredFormat,
          datasetName: shouldReplaceName ? datasetFromFile : form.datasetName
        });

        setUploadInfo({
          fileName: file.name,
          size: file.size,
          format: inferredFormat,
          lastUpdated: new Date().toISOString()
        });
        setResult(null);
        resetSignature();
        setError(null);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "读取数据文件失败");
      } finally {
        setUploading(false);
      }
    },
    [form.datasetName, resetSignature, updateForm, uploadInfo?.fileName]
  );

  const handleSign = useCallback(async () => {
    if (!signaturePayload) {
      return;
    }
    try {
      await signMessage(signaturePayload);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "签名失败，请重试");
    }
  }, [signMessage, signaturePayload]);

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

  function applySampleData() {
    updateForm({ content: SAMPLE_DATA[form.format] });
    setUploadInfo(null);
    setResult(null);
    resetSignature();
    setError(null);
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

          <UploadDropzone
            format={form.format}
            uploading={uploading}
            uploadInfo={uploadInfo}
            onFileSelected={handleFileSelection}
          />

          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-slate-200">Walrus + Sui 存证</p>
                <p className="text-xs text-slate-500">
                  通过校验后将报告推送至 Walrus，并生成 Sui 摘要引用。
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.publish}
                className={`flex h-6 w-11 items-center rounded-full border border-slate-700 transition ${
                  form.publish ? "bg-brand-light/90" : "bg-slate-800"
                }`}
                onClick={() => updateForm({ publish: !form.publish })}
              >
                <span
                  className={`h-5 w-5 rounded-full bg-slate-950 shadow transition ${
                    form.publish ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
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
              Playground 限制 2,000 行 / 750KB；也可直接粘贴 CSV / JSONL 文本。
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
                <div className="flex flex-wrap items-center gap-6">
                  <ScoreGauge score={result.report.score} />
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-4">
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
                    <p className="text-sm text-slate-400">
                      得分 ≥ 70 且无隐私命中即可触发 Walrus 上传与 Sui 存证。
                    </p>
                  </div>
                </div>

                {metrics && (
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
                    <MetricTile label="缺失率" value={formatPercent(metrics.missingRate)} />
                    <MetricTile label="类型错误" value={formatPercent(metrics.invalidRate)} />
                    <MetricTile label="重复率" value={formatPercent(metrics.duplicateRate)} />
                    <MetricTile label="隐私命中" value={`${metrics.privacyFindings} 条`} />
                  </div>
                )}

                {metrics ? <MetricsChart metrics={metrics} /> : null}

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

                <NotarizationDetails
                  receipt={result.notarization}
                  publishRequested={publishState}
                  reportPassed={result.report.passed}
                />

                <WalletPanel
                  wallet={wallet}
                  publishRequested={publishState}
                  reportPassed={result.report.passed}
                  signaturePayload={signaturePayload}
                  digest={result.notarization?.sui.digest}
                  onSign={handleSign}
                />
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

type ScoreGaugeProps = {
  score: number;
};

function ScoreGauge({ score }: ScoreGaugeProps) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative h-32 w-32">
      <svg viewBox="0 0 140 140" className="h-full w-full">
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="rgba(100,116,139,0.4)"
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="url(#score-gradient)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
        />
        <defs>
          <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9dffef" />
            <stop offset="100%" stopColor="#66ffe0" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-3xl font-semibold text-brand-light">{clamped}</p>
        <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Score</p>
      </div>
    </div>
  );
}

type MetricsChartProps = {
  metrics: ValidationReport["metrics"];
};

function MetricsChart({ metrics }: MetricsChartProps) {
  const chartRows = [
    { label: "缺失率", value: metrics.missingRate, display: `${(metrics.missingRate * 100).toFixed(1)}%` },
    { label: "类型错误", value: metrics.invalidRate, display: `${(metrics.invalidRate * 100).toFixed(1)}%` },
    { label: "重复率", value: metrics.duplicateRate, display: `${(metrics.duplicateRate * 100).toFixed(1)}%` },
    { label: "隐私命中", value: Math.min(1, metrics.privacyFindings / 5), display: `${metrics.privacyFindings} 条` }
  ];

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-4 text-xs text-slate-300">
      <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">指标图表</p>
      <div className="mt-3 space-y-3">
        {chartRows.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.3em] text-slate-500">
              <span>{row.label}</span>
              <span className="text-slate-300">{row.display}</span>
            </div>
            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-light/40 via-brand-light/60 to-brand-light"
                style={{ width: `${Math.min(100, row.value * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type UploadDropzoneProps = {
  format: FormState["format"];
  uploading: boolean;
  uploadInfo: UploadInfo | null;
  onFileSelected: (file: File) => Promise<void>;
};

function UploadDropzone({ format, uploading, uploadInfo, onFileSelected }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files?: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    await onFileSelected(file);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = async (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.dataTransfer?.files?.length) {
      await handleFiles(event.dataTransfer.files);
    }
  };

  return (
    <label
      className="flex cursor-pointer flex-col gap-2 rounded-2xl border border-dashed border-slate-800 bg-slate-950/30 px-4 py-5 text-sm text-slate-300 hover:border-brand-light/40"
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept=".csv,.jsonl,.txt"
        onChange={(event) => {
          void handleFiles(event.target.files ?? undefined);
        }}
      />
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">数据上传</p>
      <p className="text-slate-200">
        {uploading ? "读取数据中..." : "拖拽 CSV / JSONL 或点击选择文件"}
      </p>
      <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-slate-500">
        <span>当前格式 · {format.toUpperCase()}</span>
        {uploadInfo ? (
          <span className="text-slate-300">
            {uploadInfo.fileName} · {formatBytes(uploadInfo.size)}
          </span>
        ) : (
          <span className="text-slate-500">尚未上传</span>
        )}
      </div>
    </label>
  );
}

type WalletPanelProps = {
  wallet: DemoWallet;
  publishRequested: boolean;
  reportPassed: boolean;
  signaturePayload?: string | null;
  digest?: string | null;
  onSign: () => void;
};

function WalletPanel({ wallet, publishRequested, reportPassed, signaturePayload, digest, onSign }: WalletPanelProps) {
  if (!publishRequested) {
    return (
      <div className="rounded-2xl border border-slate-800/70 bg-slate-900/30 px-4 py-3 text-sm text-slate-400">
        启用 Walrus + Sui 存证后即可连接示例钱包并签名摘要。
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-4 text-sm text-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-500">示例钱包</p>
          <p className="text-base font-semibold text-slate-100">{wallet.address ? "已连接" : "未连接"}</p>
        </div>
        <button
          type="button"
          className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300 hover:border-brand-light/60"
          onClick={wallet.address ? wallet.disconnect : wallet.connect}
        >
          {wallet.address ? "断开" : "连接"}
        </button>
      </div>

      {wallet.address ? (
        <>
          <p className="mt-3 font-mono text-xs text-brand-light">{shortenMiddle(wallet.address, 12, 8)}</p>
          {!reportPassed ? (
            <p className="mt-2 text-slate-400">需通过质量门禁后才可签署链上摘要。</p>
          ) : !signaturePayload ? (
            <p className="mt-2 text-slate-400">等待 Walrus 回执，生成可签名的 Sui 摘要...</p>
          ) : (
            <>
              {digest ? (
                <p className="mt-2 text-xs text-slate-400">
                  摘要 {shortenMiddle(digest, 12, 8)}
                </p>
              ) : null}
              <button
                type="button"
                onClick={onSign}
                disabled={wallet.signing || !signaturePayload}
                className="mt-3 w-full rounded-2xl border border-brand-light/50 bg-brand-light/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-light transition hover:bg-brand-light/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {wallet.signing ? "签名中..." : wallet.signature ? "重新签名" : "签署 Sui 摘要"}
              </button>
            </>
          )}
        </>
      ) : (
        <p className="mt-3 text-slate-400">
          连接钱包即可针对 Walrus 引用 + Sui 摘要进行签名确认，模拟链上提交。
        </p>
      )}

      {wallet.signature ? (
        <div className="mt-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-mono text-emerald-200">
          签名 {shortenMiddle(wallet.signature, 14, 10)}
        </div>
      ) : null}
    </div>
  );
}

type NotarizationDetailsProps = {
  receipt?: NotarizationReceipt;
  publishRequested: boolean;
  reportPassed: boolean;
};

function NotarizationDetails({ receipt, publishRequested, reportPassed }: NotarizationDetailsProps) {
  if (!publishRequested) {
    return null;
  }

  if (!receipt) {
    return (
      <div className="rounded-2xl border border-slate-800/70 bg-slate-900/30 px-4 py-3 text-sm text-slate-300">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Walrus + Sui</p>
        <p className="mt-2 text-slate-400">
          {reportPassed ? "等待 Fastify API 完成 Walrus 上传与 Sui 摘要提交..." : "数据未通过质量门禁，已自动跳过存证。"}
        </p>
      </div>
    );
  }

  const issuedAt = new Date(receipt.issuedAt).toLocaleString();

  return (
    <div className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span className="uppercase tracking-[0.4em]">Walrus + Sui</span>
        <span>{issuedAt}</span>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3">
          <p className="text-sm font-semibold text-brand-light">Walrus 存证</p>
          <DetailLine label="Reference" value={receipt.walrus.reference} />
          <DetailLine label="Content Hash" value={receipt.walrus.contentHash} />
          <DetailLine label="Endpoint" value={receipt.walrus.endpoint} mono={false} />
          <DetailLine label="Payload Size" value={formatBytes(receipt.walrus.payloadSize)} mono={false} />
        </div>
        <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3">
          <p className="text-sm font-semibold text-brand-light">Sui 摘要</p>
          <DetailLine label="Digest" value={receipt.sui.digest} />
          <DetailLine label="Object ID" value={receipt.sui.objectId} />
          <DetailLine label="Payload Hash" value={receipt.sui.payloadHash} />
          <DetailLine label="RPC" value={receipt.sui.rpcUrl} mono={false} />
          <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-slate-500">{receipt.sui.description}</p>
        </div>
      </div>
    </div>
  );
}

type DetailLineProps = {
  label: string;
  value: string;
  mono?: boolean;
};

function DetailLine({ label, value, mono = true }: DetailLineProps) {
  return (
    <div className="mt-2">
      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className={`text-xs text-slate-200 ${mono ? "font-mono" : ""} break-all`}>
        {mono ? shortenMiddle(value) : value}
      </p>
    </div>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const units = ["KB", "MB", "GB"];
  let size = bytes / 1024;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function shortenMiddle(value: string, prefix = 10, suffix = 6) {
  if (!value || value.length <= prefix + suffix + 3) {
    return value;
  }
  return `${value.slice(0, prefix)}…${value.slice(-suffix)}`;
}

function useDemoWallet(): DemoWallet {
  const [address, setAddress] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);

  const connect = useCallback(() => {
    if (address) return;
    const randomBytes = new Uint8Array(20);
    const cryptoApi = typeof window !== "undefined" ? window.crypto : undefined;
    if (cryptoApi?.getRandomValues) {
      cryptoApi.getRandomValues(randomBytes);
    } else {
      for (let i = 0; i < randomBytes.length; i += 1) {
        randomBytes[i] = Math.floor(Math.random() * 256);
      }
    }
    const pseudoAddress = `0x${Array.from(randomBytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")}`;
    setAddress(pseudoAddress);
  }, [address]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setSignature(null);
  }, []);

  const resetSignature = useCallback(() => {
    setSignature(null);
  }, []);

  const signMessage = useCallback(
    async (message: string) => {
      if (!address) {
        throw new Error("请先连接钱包");
      }
      const cryptoApi = typeof window !== "undefined" ? window.crypto : undefined;
      if (!cryptoApi?.subtle) {
        throw new Error("当前环境不支持 WebCrypto，无法签名");
      }

      setSigning(true);
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hashBuffer = await cryptoApi.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const signatureHex = hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("");
        const finalSignature = `0x${signatureHex}`;
        setSignature(finalSignature);
        return finalSignature;
      } finally {
        setSigning(false);
      }
    },
    [address]
  );

  return {
    address,
    signature,
    signing,
    connect,
    disconnect,
    resetSignature,
    signMessage
  };
}
