export type DatasetFormat = "csv" | "jsonl";

export type FieldDataType = "string" | "number" | "boolean" | "timestamp";

export type SchemaField = {
  name: string;
  type: FieldDataType;
  required?: boolean;
  description?: string;
  example?: string;
  maxMissingRate?: number;
  maxInvalidRate?: number;
};

export type SchemaDefinition = {
  id: string;
  title: string;
  description: string;
  format: DatasetFormat[];
  fields: SchemaField[];
  duplicateKeys?: string[];
  minRows?: number;
  recommendedRows?: number;
};

export type Issue = {
  code: string;
  level: "error" | "warn";
  message: string;
  field?: string;
  row?: number;
};

export type FieldStats = Record<
  string,
  {
    missing: number;
    invalid: number;
  }
>;

export type ValidationMetrics = {
  rowCount: number;
  missingRate: number;
  invalidRate: number;
  duplicateRate: number;
  privacyFindings: number;
  fieldStats: FieldStats;
};

export type ScoreBreakdown = {
  label: string;
  deduction: number;
  reason: string;
};

export type ValidationReport = {
  datasetName: string;
  schemaId: string;
  format: DatasetFormat;
  walrusRef?: string;
  generatedAt: string;
  totalRows: number;
  passed: boolean;
  score: number;
  metrics: ValidationMetrics;
  issues: Issue[];
  scoreBreakdown: ScoreBreakdown[];
  recommendations: string[];
};
