import { afterEach, describe, expect, it } from "vitest";

import { buildServer } from "../src/app";

let server: Awaited<ReturnType<typeof buildServer>> | null = null;

afterEach(async () => {
  if (server) {
    await server.close();
    server = null;
  }
});

describe("health endpoint", () => {
  it("returns basic readiness payload", async () => {
    server = await buildServer();
    const response = await server.inject({
      method: "GET",
      url: "/api/health"
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body).toMatchObject({ status: "ok" });
    expect(body.timestamp).toBeDefined();
  });
});
