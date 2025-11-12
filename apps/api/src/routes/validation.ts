import type { FastifyInstance } from "fastify";
import { z } from "zod";

import { runValidation, ValidationEngineError } from "../validation/engine";
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
  walrusRef: z.string().url().optional()
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
      const { schema, report } = runValidation(parsed.data);
      return {
        schema: sanitizeSchema(schema),
        report,
        steps: buildReportSteps(report)
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

function buildReportSteps(report: ReturnType<typeof runValidation>["report"]) {
  return [
    `✅ 解析 ${report.totalRows} 条样本并完成 Schema 映射`,
    `📊 计算缺失/类型/重复等指标，得到 ${report.score} 分`,
    report.passed ? "🧾 生成可上链报告，准备 Walrus + Sui 存证" : "⚠️ 生成整改建议，待修复后再上传"
  ];
}
