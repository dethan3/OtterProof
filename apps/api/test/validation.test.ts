import { afterEach, describe, expect, it } from "vitest";

import { buildServer } from "../src/app";

let server: Awaited<ReturnType<typeof buildServer>> | null = null;

afterEach(async () => {
  if (server) {
    await server.close();
    server = null;
  }
});

const sampleCsv = [
  "record_id,user_handle,comment,language,sentiment_score,created_at,contains_pii",
  '1,user_alpha,"Email me at sample@example.com",en,0.82,2024-06-01T09:10:34.000Z,false',
  "2,user_beta,All clear,en,0.12,2024-06-02T10:00:00.000Z,false"
].join("\n");

describe("validation endpoint", () => {
  it("runs the Day2 validation pipeline for CSV payloads", async () => {
    server = await buildServer();
    const response = await server.inject({
      method: "POST",
      url: "/api/validate",
      payload: {
        datasetName: "demo_news",
        schemaId: "news_comments_v1",
        format: "csv",
        content: sampleCsv
      }
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();
    expect(body.schema.id).toBe("news_comments_v1");
    expect(body.report.datasetName).toBe("demo_news");
    expect(body.report.metrics.rowCount).toBe(2);
    expect(body.report.metrics.privacyFindings).toBeGreaterThan(0);
    expect(body.report.passed).toBe(false);
    expect(Array.isArray(body.steps)).toBe(true);
    expect(body.steps).toHaveLength(3);
  });

  it("rejects malformed payloads", async () => {
    server = await buildServer();
    const response = await server.inject({
      method: "POST",
      url: "/api/validate",
      payload: {
        datasetName: "invalid",
        schemaId: "news_comments_v1",
        format: "csv"
      }
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();
    expect(body.errors).toBeDefined();
  });
});
