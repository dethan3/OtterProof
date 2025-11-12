import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { env } from "../env";
import { notarizeReport, type NotarizationReceipt } from "../notarization";
import { runValidation, type ValidationInput, ValidationEngineError } from "../validation/engine";
import { listSchemas } from "../validation/schemas";

const DatasetFormatEnum = z.enum(["csv", "jsonl"]);

const PayloadSchema = z.object({
  datasetName: z.string({ required_error: "datasetName is required" }).min(3),
  schemaId: z.string({ required_error: "schemaId is required" }).min(1),
  format: DatasetFormatEnum,
  content: z
    .string({ required_error: "content is required" })
    .min(10, "dataset too small")
    .max(750_000, "dataset too large for Day2 demo"),
  walrusRef: z.string().url().optional(),
  publish: z.boolean().default(false)
});

export async function validationRoutes(app: FastifyInstance) {
  app.get("/schemas", async () => listSchemas().map(sanitizeSchema));

  app.post("/validate", async (request, reply) => {
    const parsed = PayloadSchema.safeParse(request.body);

    if (!parsed.success) {
      return reply.status(400).send({
        errors: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message
        }))
      });
    }

    try {
      const validationInput: ValidationInput = {
        datasetName: parsed.data.datasetName,
        schemaId: parsed.data.schemaId,
        format: parsed.data.format,
        content: parsed.data.content,
        walrusRef: parsed.data.walrusRef
      };

      const { schema, report } = runValidation(validationInput);
      let notarization: NotarizationReceipt | undefined;

      if (parsed.data.publish && report.passed) {
        notarization = await notarizeReport({
          datasetName: validationInput.datasetName,
          schemaId: schema.id,
          report,
          walrusEndpoint: env.WALRUS_ENDPOINT,
          suiRpc: env.SUI_RPC
        });
        report.walrusRef = notarization.walrus.reference;
      }

      return {
        schema: sanitizeSchema(schema),
        report,
        steps: buildReportSteps(report, {
          publishRequested: parsed.data.publish,
          notarization
        }),
        notarization,
        publishRequested: parsed.data.publish
      };
    } catch (error) {
      if (error instanceof ValidationEngineError) {
        return reply.status(error.statusCode).send({ error: error.message });
      }

      app.log.error(error, "Validation engine failed");
      return reply.status(500).send({ error: "Validation engine failed" });
    }
  });
}

function sanitizeSchema(schema: ReturnType<typeof listSchemas>[number]) {
  return {
    id: schema.id,
    title: schema.title,
    description: schema.description,
    format: schema.format,
    fields: schema.fields.map((field) => ({
      name: field.name,
      type: field.type,
      required: Boolean(field.required),
      description: field.description,
      example: field.example
    }))
  };
}

function buildReportSteps(
  report: ReturnType<typeof runValidation>["report"],
  options: { publishRequested: boolean; notarization?: NotarizationReceipt }
) {
  const steps = [
    `✅ 解析 ${report.totalRows} 条样本并完成 Schema 映射`,
    `📊 计算缺失/类型/重复等指标，得到 ${report.score} 分`
  ];

  if (report.passed) {
    steps.push("🧾 生成可上链报告，准备 Walrus + Sui 存证");

    if (options.publishRequested) {
      steps.push(
        options.notarization
          ? `🔐 Walrus 引用 ${shorten(options.notarization.walrus.reference)} · Sui 摘要 ${shorten(options.notarization.sui.digest)}`
          : "⏳ 等待 Walrus 上传与 Sui 存证完成"
      );
    }
  } else {
    steps.push(
      options.publishRequested
        ? "⛔ 质量未通过，Walrus + Sui 存证已跳过"
        : "⚠️ 生成整改建议，待修复后再上传"
    );
  }

  return steps;
}

function shorten(value: string) {
  const normalized = value ?? "";
  if (normalized.length <= 18) {
    return normalized;
  }
  return `${normalized.slice(0, 10)}…${normalized.slice(-4)}`;
}
