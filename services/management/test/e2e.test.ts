import { expect, test, describe, mock } from "bun:test";

let mockAliases: any[] = [];

mock.module("../src/db/index", () => {
  return {
    default: {
      insert: () => ({
        values: (data: any) => ({
          returning: () => {
            const newAlias = { ...data, created_at: new Date() };
            mockAliases.push(newAlias);
            return [newAlias];
          }
        })
      }),
      select: () => ({
        from: () => ({
          where: (condition: any) => {
            return {
              limit: () => {
                const code = JSON.stringify(condition).match(/"code":"(.*?)"/)?.[1];
                const alias = mockAliases.find(a => a.code === code);
                return alias ? [alias] : [];
              },
              then: (callback: any) => {
                // For select().from().where() which returns array
                const userId = JSON.stringify(condition).match(/"user_id":"(.*?)"/)?.[1];
                if (userId) {
                   return Promise.resolve(mockAliases.filter(a => a.user_id === userId));
                }
                return Promise.resolve(mockAliases);
              }
            };
          },
          then: (callback: any) => {
             return Promise.resolve(mockAliases);
          }
        })
      }),
      update: () => ({
        set: (data: any) => ({
          where: (condition: any) => ({
            returning: () => {
              const code = JSON.stringify(condition).match(/"code":"(.*?)"/)?.[1];
              const index = mockAliases.findIndex(a => a.code === code);
              if (index !== -1) {
                mockAliases[index] = { ...mockAliases[index], ...data };
                return [mockAliases[index]];
              }
              return [];
            }
          })
        })
      }),
      delete: () => ({
        where: (condition: any) => ({
          returning: () => {
            const code = JSON.stringify(condition).match(/"code":"(.*?)"/)?.[1];
            const index = mockAliases.findIndex(a => a.code === code);
            if (index !== -1) {
              const deleted = mockAliases.splice(index, 1);
              return deleted;
            }
            return [];
          }
        })
      }),
      execute: () => Promise.resolve([{ "1": 1 }])
    }
  };
});

import app from "../src/app";

describe("Management Service E2E CRUD", () => {
  const userId = "test-user-123";
  let createdCode: string;

  test("GET /health should return 200", async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
  });

  test("POST /aliases should create an alias", async () => {
    const payload = {
      target: "https://trae.ai",
      metadata: { priority: "high" }
    };

    const res = await app.request('/aliases', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      }
    });

    expect(res.status).toBe(201);
    const data = await res.json() as any;
    expect(data.target).toBe(payload.target);
    expect(data.user_id).toBe(userId);
    expect(data.code).toBeDefined();
    createdCode = data.code;
  });

  test("GET /aliases should list user's aliases", async () => {
    const res = await app.request('/aliases', {
      headers: { 'x-user-id': userId }
    });

    expect(res.status).toBe(200);
    const data = await res.json() as any[];
    expect(Array.isArray(data)).toBe(true);
    expect(data.some(a => a.code === createdCode)).toBe(true);
  });

  test("GET /aliases/:code should return the specific alias", async () => {
    const res = await app.request(`/aliases/${createdCode}`, {
      headers: { 'x-user-id': userId }
    });

    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.code).toBe(createdCode);
    expect(data.user_id).toBe(userId);
  });

  test("PATCH /aliases/:code should update the alias", async () => {
    const updatePayload = {
      target: "https://google.com",
      metadata: { priority: "low" }
    };

    const res = await app.request(`/aliases/${createdCode}`, {
      method: 'PATCH',
      body: JSON.stringify(updatePayload),
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': userId
      }
    });

    expect(res.status).toBe(200);
    const data = await res.json() as any;
    expect(data.target).toBe(updatePayload.target);
    expect(data.metadata).toMatchObject(updatePayload.metadata);
  });

  test("DELETE /aliases/:code should remove the alias", async () => {
    const res = await app.request(`/aliases/${createdCode}`, {
      method: 'DELETE',
      headers: { 'x-user-id': userId }
    });

    expect(res.status).toBe(200);
    
    // Verify it's gone
    const verifyRes = await app.request(`/aliases/${createdCode}`, {
      headers: { 'x-user-id': userId }
    });
    expect(verifyRes.status).toBe(404);
  });
});
