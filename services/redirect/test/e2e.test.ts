import { expect, test, describe, beforeEach, mock } from "bun:test";

// Mock Redis before other imports
mock.module("../src/redis.js", () => {
  const store = new Map();
  return {
    redis: {
      get: async (key: string) => store.get(key) || null,
      set: async (key: string, value: string) => { store.set(key, value); },
      del: async (key: string) => { store.delete(key); },
      on: () => {},
    }
  };
});

let currentQueryCode = "";

// Mock DB raw client before other imports
mock.module("../src/db/index.js", () => {
  return {
    default: {
      query: async (sql: string, params: any[]) => {
        if (currentQueryCode === "db-code") {
          return {
            rows: [{ target: "https://db.example.com", expires_at: null }]
          };
        }
        return { rows: [] };
      }
    }
  };
});

import { app } from "../src/app.js";
import { redis } from "../src/redis.js";

describe("Redirect Service E2E", () => {
  beforeEach(async () => {
    await redis.del(`alias:db-code`);
    await redis.del(`alias:non-existent-code`);
  });

  test("GET /health should return 200", async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
  });

  test("GET /:code should return 404 for non-existent code", async () => {
    currentQueryCode = "non-existent-code";
    const res = await app.request('/non-existent-code');
    expect(res.status).toBe(404);
  });

  test("GET /:code should redirect to target from DB replica and then cache it", async () => {
    const dbCode = "db-code";
    currentQueryCode = dbCode;
    const dbTarget = "https://db.example.com";

    // Request - Cache miss -> DB Hit
    const res = await app.request(`/${dbCode}`);
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe(dbTarget);

    // Verify Redis cache
    const cached = await redis.get(`alias:${dbCode}`);
    expect(cached).toBe(dbTarget);

    // Second request - Cache hit
    const res2 = await app.request(`/${dbCode}`);
    expect(res2.status).toBe(302);
    expect(res2.headers.get('location')).toBe(dbTarget);
  });
});
