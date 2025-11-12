import type { SchemaDefinition } from "../types/validation";

const BASE_FORMATS: SchemaDefinition["format"] = ["csv", "jsonl"];

export const schemaRegistry: Record<string, SchemaDefinition> = {
  news_comments_v1: {
    id: "news_comments_v1",
    title: "News Comments v1",
    description: "Structured comments dataset with sentiment and privacy flags.",
    format: BASE_FORMATS,
    minRows: 25,
    recommendedRows: 200,
    duplicateKeys: ["record_id"],
    fields: [
      {
        name: "record_id",
        type: "string",
        required: true,
        description: "Deterministic id per comment",
        example: "comment_98421",
        maxMissingRate: 0
      },
      {
        name: "user_handle",
        type: "string",
        required: true,
        description: "Hashed or masked handle",
        example: "user_87a3",
        maxMissingRate: 0.05
      },
      {
        name: "comment",
        type: "string",
        required: true,
        description: "Raw comment text",
        example: "AI moderation is the future",
        maxMissingRate: 0.02
      },
      {
        name: "language",
        type: "string",
        description: "BCP-47 language tag",
        example: "en"
      },
      {
        name: "sentiment_score",
        type: "number",
        description: "Range -1 ... 1",
        example: "0.82",
        maxInvalidRate: 0.05
      },
      {
        name: "created_at",
        type: "timestamp",
        required: true,
        description: "ISO8601 timestamp",
        example: "2024-05-21T09:10:34.000Z",
        maxMissingRate: 0.02
      },
      {
        name: "contains_pii",
        type: "boolean",
        description: "Uploader provided privacy flag"
      }
    ]
  },
  ai_prompts_v1: {
    id: "ai_prompts_v1",
    title: "AI Prompts v1",
    description: "Text prompts dataset with taxonomy + toxicity scoring.",
    format: BASE_FORMATS,
    minRows: 10,
    recommendedRows: 100,
    duplicateKeys: ["prompt_id", "prompt_text"],
    fields: [
      {
        name: "prompt_id",
        type: "string",
        required: true,
        description: "Stable id for prompt variant",
        example: "prompt_001"
      },
      {
        name: "prompt_text",
        type: "string",
        required: true,
        description: "Full prompt body",
        example: "Summarise the news article..."
      },
      {
        name: "category",
        type: "string",
        description: "High-level taxonomy label",
        example: "news"
      },
      {
        name: "toxicity_score",
        type: "number",
        description: "0-1 probability from classifier",
        example: "0.12",
        maxInvalidRate: 0.05
      },
      {
        name: "source",
        type: "string",
        description: "Originating dataset or user",
        example: "community"
      },
      {
        name: "last_used_at",
        type: "timestamp",
        description: "Last validation run timestamp",
        example: "2024-06-01T12:00:00.000Z"
      }
    ]
  }
};

export function getSchema(schemaId: string) {
  return schemaRegistry[schemaId];
}

export function listSchemas() {
  return Object.values(schemaRegistry);
}
