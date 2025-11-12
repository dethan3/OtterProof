import { parse } from "csv-parse/sync";

import type {
  DatasetFormat,
  FieldStats,
  Issue,
  SchemaDefinition,
  ScoreBreakdown,
  ValidationMetrics,
  ValidationReport
} from "../types/validation";
import { getSchema } from "./schemas";

const MAX_ROWS = 2_000;
const MAX_ISSUES = 25;

type PrivacyPattern = {
  label: string;
  regex: RegExp;
  code: string;
};

const PRIVACY_PATTERNS: PrivacyPattern[] = [
  {
    label: "Email address",
    code: "privacy.email",
    regex: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
  },
  {
    label: "Phone number",
    code: "privacy.phone",
    regex: /\b(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/g
  },
  {
    label: "National id",
    code: "privacy.national_id",
    regex: /\b\d{6,}\b/g
  }
];

export class ValidationEngineError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "ValidationEngineError";
    this.statusCode = statusCode;
  }
}

export type ValidationInput = {
  datasetName: string;
  schemaId: string;
  format: DatasetFormat;
  content: string;
  walrusRef?: string;
};

export type ValidationResult = {
  schema: SchemaDefinition;
  report: ValidationReport;
};

type ParsedRow = Record<string, unknown>;

export function runValidation(input: ValidationInput): ValidationResult {
  const schema = getSchema(input.schemaId);
  if (!schema) {
    throw new ValidationEngineError(`Schema ${input.schemaId} not found`, 404);
  }

  if (!schema.format.includes(input.format)) {
    throw new ValidationEngineError(`Schema ${schema.id} does not support ${input.format} input`, 400);
  }

  const rows = parseRows(input.content, input.format);

  const {
    metrics,
    issues,
    recommendations,
    score,
    scoreBreakdown
  } = analyzeRows(rows, schema);

  const report: ValidationReport = {
    datasetName: input.datasetName,
    schemaId: schema.id,
    format: input.format,
    walrusRef: input.walrusRef,
    generatedAt: new Date().toISOString(),
    totalRows: metrics.rowCount,
    passed: score >= 70 && metrics.privacyFindings === 0,
    score,
    metrics,
    issues,
    scoreBreakdown,
    recommendations
  };

  return { schema, report };
}

function parseRows(content: string, format: DatasetFormat): ParsedRow[] {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new ValidationEngineError("Dataset content is empty");
  }

  if (trimmed.length > 750_000) {
    throw new ValidationEngineError("Dataset too large for Day2 demo (750KB limit)");
  }

  let rows: ParsedRow[];

  if (format === "csv") {
    rows = parse(trimmed, {
      bom: true,
      columns: true,
      skip_empty_lines: true,
      trim: true
    }) as ParsedRow[];
  } else {
    rows = trimmed
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => {
        try {
          return JSON.parse(line) as ParsedRow;
        } catch {
          throw new ValidationEngineError(`Invalid JSON on line ${index + 1}`);
        }
      });
  }

  if (!rows.length) {
    throw new ValidationEngineError("Dataset contains no rows");
  }

  if (rows.length > MAX_ROWS) {
    throw new ValidationEngineError(`Dataset exceeds ${MAX_ROWS} rows for Day2 demo`);
  }

  return rows;
}

function analyzeRows(rows: ParsedRow[], schema: SchemaDefinition) {
  const issues: Issue[] = [];
  const recommendations: string[] = [];
  const fieldStats: FieldStats = {};

  schema.fields.forEach((field) => {
    fieldStats[field.name] = { missing: 0, invalid: 0 };
  });

  let privacyFindings = 0;
  let duplicateCount = 0;
  const duplicateTracker = new Map<string, number>();

  const pushIssue = (issue: Issue) => {
    if (issues.length < MAX_ISSUES) {
      issues.push(issue);
    }
  };

  rows.forEach((row, index) => {
    schema.fields.forEach((field) => {
      const value = row[field.name];

      if (isMissing(value)) {
        fieldStats[field.name].missing += 1;
        if (field.required && issues.length < MAX_ISSUES) {
          pushIssue({
            code: "schema.missing_field",
            level: "warn",
            field: field.name,
            row: index + 1,
            message: `Missing value for required field "${field.name}"`
          });
        }
        return;
      }

      const validity = validateValue(value, field.type);
      if (!validity.valid) {
        fieldStats[field.name].invalid += 1;
        pushIssue({
          code: "schema.invalid_type",
          level: "warn",
          field: field.name,
          row: index + 1,
          message: `Value "${String(value)}" does not match ${field.type}`
        });
        return;
      }

      if (typeof validity.value === "string") {
        detectPrivacy(validity.value, field.name, index + 1, pushIssue, () => {
          privacyFindings += 1;
        });
      }
    });

    if (schema.duplicateKeys?.length) {
      const key = schema.duplicateKeys
        .map((fieldName) => String(row[fieldName] ?? "").trim().toLowerCase())
        .join("::");

      if (key.length) {
        const seen = duplicateTracker.get(key) ?? 0;
        if (seen > 0) {
          duplicateCount += 1;
          pushIssue({
            code: "schema.duplicate_row",
            level: "warn",
            message: `Duplicate key detected for ${schema.duplicateKeys.join("+")}`,
            row: index + 1
          });
        }
        duplicateTracker.set(key, seen + 1);
      }
    }
  });

  const totalCells = rows.length * schema.fields.length;
  const totalMissing = Object.values(fieldStats).reduce((acc, stats) => acc + stats.missing, 0);
  const totalInvalid = Object.values(fieldStats).reduce((acc, stats) => acc + stats.invalid, 0);

  const metrics: ValidationMetrics = {
    rowCount: rows.length,
    missingRate: totalCells ? totalMissing / totalCells : 0,
    invalidRate: totalCells ? totalInvalid / totalCells : 0,
    duplicateRate: rows.length ? duplicateCount / rows.length : 0,
    privacyFindings,
    fieldStats
  };

  schema.fields.forEach((field) => {
    const stats = fieldStats[field.name];
    const missingRate = stats.missing / rows.length;
    const invalidRate = stats.invalid / rows.length;

    if (field.maxMissingRate !== undefined && missingRate > field.maxMissingRate) {
      pushIssue({
        code: "schema.missing_threshold",
        level: "warn",
        field: field.name,
        message: `Missing rate ${(missingRate * 100).toFixed(1)}% exceeds threshold ${(field.maxMissingRate * 100).toFixed(1)}%`
      });
    }

    if (field.maxInvalidRate !== undefined && invalidRate > field.maxInvalidRate) {
      pushIssue({
        code: "schema.invalid_threshold",
        level: "warn",
        field: field.name,
        message: `Invalid rate ${(invalidRate * 100).toFixed(1)}% exceeds threshold ${(field.maxInvalidRate * 100).toFixed(1)}%`
      });
    }
  });

  if (schema.minRows && rows.length < schema.minRows) {
    pushIssue({
      code: "schema.too_few_rows",
      level: "warn",
      message: `Dataset only has ${rows.length} rows. Recommended minimum is ${schema.minRows}.`
    });
  }

  if (privacyFindings > 0) {
    pushIssue({
      code: "privacy.regex_hit",
      level: "error",
      message: `Detected ${privacyFindings} potential privacy leaks`
    });
  }

  const { score, scoreBreakdown } = computeScore(metrics);

  if (metrics.missingRate > 0.05) {
    recommendations.push("补充缺失字段或为稀疏字段提供默认值，以减少缺失率。");
  }

  if (metrics.invalidRate > 0.05) {
    recommendations.push("统一字段类型，例如将字符串数字转换为浮点数，避免校验失败。");
  }

  if (metrics.duplicateRate > 0.02) {
    recommendations.push("清理重复记录，或在上传前去重关键主键组合。");
  }

  if (privacyFindings > 0) {
    recommendations.push("移除或脱敏邮箱、电话等隐私信息后再上链。");
  }

  if (schema.recommendedRows && rows.length < schema.recommendedRows) {
    recommendations.push(`建议至少提供 ${schema.recommendedRows} 条样本以获得稳定评分。`);
  }

  return {
    metrics,
    issues,
    recommendations,
    score,
    scoreBreakdown
  };
}

function isMissing(value: unknown) {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === "string") {
    return value.trim().length === 0;
  }
  return false;
}

function validateValue(value: unknown, type: SchemaDefinition["fields"][number]["type"]) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "") {
      return { valid: false as const, value: trimmed };
    }
    value = trimmed;
  }

  switch (type) {
    case "number": {
      const numeric = typeof value === "number" ? value : Number(value);
      return { valid: Number.isFinite(numeric), value: numeric };
    }
    case "boolean": {
      if (typeof value === "boolean") {
        return { valid: true, value };
      }
      if (typeof value === "string") {
        const normalized = value.toLowerCase();
        if (["true", "false", "0", "1", "yes", "no"].includes(normalized)) {
          return { valid: true, value: ["true", "1", "yes"].includes(normalized) };
        }
      }
      return { valid: false as const, value };
    }
    case "timestamp": {
      const dateValue = typeof value === "number" ? new Date(value) : new Date(String(value));
      return { valid: !Number.isNaN(dateValue.getTime()), value: dateValue.toISOString() };
    }
    default:
      return { valid: typeof value === "string" || typeof value === "number", value: value ?? "" };
  }
}

function detectPrivacy(
  value: string,
  fieldName: string,
  row: number,
  pushIssue: (issue: Issue) => void,
  onHit: () => void
) {
  PRIVACY_PATTERNS.forEach((pattern) => {
    const match = value.match(pattern.regex);
    if (match && match.length) {
      match.forEach(() => onHit());
      pushIssue({
        code: pattern.code,
        level: "error",
        field: fieldName,
        row,
        message: `Detected ${pattern.label}: ${match[0]}`
      });
    }
  });
}

function computeScore(metrics: ValidationMetrics) {
  let score = 100;
  const breakdown: ScoreBreakdown[] = [];

  const applyPenalty = (label: string, deduction: number, reason: string) => {
    if (deduction <= 0) return;
    score -= deduction;
    breakdown.push({ label, deduction, reason });
  };

  applyPenalty("缺失字段", Math.round(metrics.missingRate * 45), `平均缺失率 ${(metrics.missingRate * 100).toFixed(1)}%`);
  applyPenalty("字段类型错误", Math.round(metrics.invalidRate * 35), `平均类型错误率 ${(metrics.invalidRate * 100).toFixed(1)}%`);
  applyPenalty("重复记录", Math.round(metrics.duplicateRate * 20), `重复率 ${(metrics.duplicateRate * 100).toFixed(1)}%`);
  applyPenalty(
    "隐私风险",
    Math.min(30, metrics.privacyFindings * 3),
    `${metrics.privacyFindings} 条潜在隐私命中`
  );

  score = Math.max(0, Math.min(100, score));

  return { score, scoreBreakdown: breakdown };
}
