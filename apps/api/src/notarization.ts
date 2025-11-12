import type { ValidationReport } from "./types/validation";
import { anchorReportOnSui, type SuiAnchorResult } from "./sui";
import { uploadReportToWalrus, type WalrusUploadResult } from "./walrus";

export type NotarizationInput = {
  datasetName: string;
  schemaId: string;
  report: ValidationReport;
  walrusEndpoint: string;
  suiRpc: string;
};

export type NotarizationReceipt = {
  walrus: WalrusUploadResult;
  sui: SuiAnchorResult;
  issuedAt: string;
};

export async function notarizeReport(input: NotarizationInput): Promise<NotarizationReceipt> {
  const walrus = await uploadReportToWalrus({
    endpoint: input.walrusEndpoint,
    datasetName: input.datasetName,
    schemaId: input.schemaId,
    report: input.report
  });

  const sui = await anchorReportOnSui({
    rpcUrl: input.suiRpc,
    datasetName: input.datasetName,
    schemaId: input.schemaId,
    walrusReference: walrus.reference,
    walrusHash: walrus.contentHash
  });

  return {
    walrus,
    sui,
    issuedAt: new Date().toISOString()
  };
}
