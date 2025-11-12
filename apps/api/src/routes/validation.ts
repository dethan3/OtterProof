import type { FastifyInstance } from "fastify";
import { z } from "zod";

import type { Issue, ValidationSummary } from "../types/validation";

const PayloadSchema = z.object({
  datasetName: z.string({ required_error: "datasetName is required" }).min(3),
  schemaId: z.string({ required_error: "schemaId is required" }).min(1),
  walrusRef: z.string().url().optional(),
  sampleSize: z.number().int().positive().max(1_000_000).optional(),
  notes: z.string().max(280).optional()
});

type Payload = z.infer<typeof PayloadSchema>;

export async function validationRoutes(app: FastifyInstance) {
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

    const payload = parsed.data;
    const summary = buildPlaceholderSummary(payload);

    return {
      summary,
      steps: [
        "上传文件到 Walrus 并记录 CID",
        "提交哈希到 Sui Move 合约",
        "在前端展示校验报告"
      ]
    };
  });
}

function buildPlaceholderSummary(payload: Payload): ValidationSummary {
  const issues: Issue[] = [
    {
      code: "schema.missing_field",
      level: "warn",
      field: "publisher",
      message: "示例：字段缺失率 8%，建议补全"
    },
    {
      code: "privacy.regex_hit",
      level: "error",
      field: "comment",
      message: "检测到 3 条潜在邮箱地址"
    }
  ];

  const baseScore = 95;
  const penalty = issues.reduce((acc, issue) => acc + (issue.level === "error" ? 10 : 3), 0);

  return {
    datasetName: payload.datasetName,
    schemaId: payload.schemaId,
    walrusRef: payload.walrusRef,
    estimatedRowCount: payload.sampleSize ?? 0,
    score: Math.max(40, baseScore - penalty),
    issues
  };
}
