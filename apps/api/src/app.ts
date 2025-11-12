import cors from "@fastify/cors";
import fastify from "fastify";

import { env } from "./env";
import { healthRoutes } from "./routes/health";
import { validationRoutes } from "./routes/validation";

export async function buildServer() {
  const app = fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport: env.LOG_LEVEL === "debug" ? { target: "pino-pretty" } : undefined
    }
  });

  await app.register(cors, {
    origin: true
  });

  await app.register(healthRoutes, { prefix: "/api" });
  await app.register(validationRoutes, { prefix: "/api" });

  return app;
}
