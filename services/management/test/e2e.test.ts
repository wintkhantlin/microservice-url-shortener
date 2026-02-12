import { expect, test, describe } from "bun:test";
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
