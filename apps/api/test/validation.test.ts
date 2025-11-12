import { describe, expect, it } from "vitest";

import { buildServer } from "../src/app";

describe("validation endpoint", () => {
  it("returns a placeholder summary", async () => {
    const app = await buildServer();
    const response = await app.inject({
      method: "POST",
      url: "/api/validate",
      payload: {
        datasetName: "news_comments",
        schemaId: "news_v1",
        sampleSize: 1200
      }
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.summary).toMatchObject({
      datasetName: "news_comments",
      schemaId: "news_v1"
    });
    expect(body.steps).toHaveLength(3);

    await app.close();
  });
});
