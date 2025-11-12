import { createHash } from "node:crypto";

export type SuiAnchorInput = {
  rpcUrl: string;
  datasetName: string;
  schemaId: string;
  walrusReference: string;
  walrusHash: string;
};

export type SuiAnchorResult = {
  digest: string;
  objectId: string;
  payloadHash: string;
  rpcUrl: string;
  description: string;
};

export async function anchorReportOnSui(input: SuiAnchorInput): Promise<SuiAnchorResult> {
  const payload = JSON.stringify(
    {
      dataset: input.datasetName,
      schema: input.schemaId,
      walrusRef: input.walrusReference,
      walrusHash: input.walrusHash
    },
    null,
    2
  );

  const payloadHash = createHash("sha3-256").update(payload).digest("hex");
  const digest = `0x${payloadHash.slice(0, 64)}`;
  const objectId = `0x${payloadHash.slice(64, 96).padEnd(32, "0")}`;

  return {
    digest,
    objectId,
    payloadHash: `0x${payloadHash}`,
    rpcUrl: input.rpcUrl,
    description: "otterproof::report_registry::submit_report"
  };
}
