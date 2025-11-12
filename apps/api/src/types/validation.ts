export type Issue = {
  code: string;
  level: "error" | "warn";
  message: string;
  field?: string;
};

export type ValidationSummary = {
  datasetName: string;
  schemaId: string;
  score: number;
  estimatedRowCount: number;
  issues: Issue[];
  walrusRef?: string;
};
