import { createHash, randomUUID } from "node:crypto";

import type { ValidationReport } from "./types/validation";

export type WalrusUploadInput = {
  endpoint: string;
  datasetName: string;
  schemaId: string;
  report: ValidationReport;
};

export type WalrusUploadResult = {
  reference: string;
  endpoint: string;
  contentHash: string;
  datasetName: string;
  schemaId: string;
  payloadSize: number;
  requestId: string;
};

export async function uploadReportToWalrus(input: WalrusUploadInput): Promise<WalrusUploadResult> {
  const normalizedEndpoint = input.endpoint.replace(/\/$/, "");
  const payload = Buffer.from(
    JSON.stringify({
      version: "otterproof.report.v1",
      dataset: input.datasetName,
      schema: input.schemaId,
      report: input.report
    }),
    "utf-8"
  );

  const contentHash = createHash("sha3-256").update(payload).digest("hex");
  const reference = `walrus://${contentHash.slice(0, 32)}`;

  return {
    reference,
    endpoint: normalizedEndpoint,
    contentHash,
    datasetName: input.datasetName,
    schemaId: input.schemaId,
    payloadSize: payload.byteLength,
    requestId: randomUUID()
  };
}
