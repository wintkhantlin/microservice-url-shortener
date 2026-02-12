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

// Mock Management Client
mock.module("../src/managementClient.ts", () => {
  return {
    fetchAliasFromManagement: async (code: string) => {
      if (code === "test-redirect-code") {
        return "https://example.com/target";
      }
      return null;
    }
  };
});

import { app } from "../src/app.js";
import { redis } from "../src/redis.js";

describe("Redirect Service E2E (No DB)", () => {
  const testCode = "test-redirect-code";
  const testTarget = "https://example.com/target";

  beforeEach(async () => {
    // Clear Redis cache for this code
    await redis.del(`alias:${testCode}`);
  });

  test("GET /health should return 200", async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
  });

  test("GET /:code should redirect to target from management service and then cache it", async () => {
    // First request - Cache miss (will fetch from mocked management client)
    const res = await app.request(`/${testCode}`);
    expect(res.status).toBe(302);
    expect(res.headers.get('location')).toBe(testTarget);

    // Verify it's cached in Redis
    const cachedValue = await redis.get(`alias:${testCode}`);
    expect(cachedValue).toBe(testTarget);

    // Second request - Cache hit
    const res2 = await app.request(`/${testCode}`);
    expect(res2.status).toBe(302);
    expect(res2.headers.get('location')).toBe(testTarget);
  });

  test("GET /:code should return 404 for non-existent code", async () => {
    const res = await app.request('/non-existent-code');
    expect(res.status).toBe(404);
  });
});
