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

const passingCsv = [
  "record_id,user_handle,comment,language,sentiment_score,created_at,contains_pii",
  '100,user_delta,"All systems go",en,0.82,2024-06-01T09:10:34.000Z,false',
  '101,user_echo,"Ship to Walrus storage",en,0.65,2024-06-02T10:00:00.000Z,false',
  '102,user_foxtrot,"Ready for Sui anchoring",en,0.9,2024-06-03T11:15:00.000Z,false'
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

  it("publishes Walrus + Sui receipts when report passes", async () => {
    server = await buildServer();
    const response = await server.inject({
      method: "POST",
      url: "/api/validate",
      payload: {
        datasetName: "publishable_dataset",
        schemaId: "news_comments_v1",
        format: "csv",
        content: passingCsv,
        publish: true
      }
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();

    expect(body.publishRequested).toBe(true);
    expect(body.report.passed).toBe(true);
    expect(body.notarization).toBeDefined();
    expect(body.report.walrusRef).toBe(body.notarization.walrus.reference);
    expect(body.notarization.sui.digest).toMatch(/^0x[0-9a-f]+/);
    expect(body.steps).toHaveLength(4);
    expect(body.steps[3]).toContain("Walrus");
  });

  it("skips notarization when publish is requested but validation fails", async () => {
    server = await buildServer();
    const response = await server.inject({
      method: "POST",
      url: "/api/validate",
      payload: {
        datasetName: "privacy_hit_dataset",
        schemaId: "news_comments_v1",
        format: "csv",
        content: sampleCsv,
        publish: true
      }
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();

    expect(body.report.passed).toBe(false);
    expect(body.notarization).toBeUndefined();
    expect(body.steps).toHaveLength(3);
    expect(body.steps[2]).toContain("Walrus + Sui");
  });
});
