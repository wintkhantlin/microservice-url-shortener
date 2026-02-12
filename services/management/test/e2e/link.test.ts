import { expect, test, describe } from "bun:test";
import app from "../../src/index";

describe("Core Service E2E", () => {
  const baseUrl = "http://localhost:8000";

  test("GET /health should return 200", async () => {
    const res = await app.fetch(new Request(`${baseUrl}/health`));
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Core Service is healthy");
  });

  test("POST /shorten should create a short URL", async () => {
    const payload = { url: "https://trae.ai" };
    const res = await app.fetch(new Request(`${baseUrl}/shorten`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    }));

    expect(res.status).toBe(200);
    const data = await res.json() as { shortCode: string; shortUrl: string };
    expect(data).toHaveProperty("shortCode");
    expect(data.shortUrl).toContain(data.shortCode);
  });

  test("GET /:shortCode should redirect to original URL", async () => {
    const targetUrl = "https://github.com/oven-sh/bun";
    const createRes = await app.fetch(new Request(`${baseUrl}/shorten`, {
      method: "POST",
      body: JSON.stringify({ url: targetUrl }),
      headers: { "Content-Type": "application/json" }
    }));
    const { shortCode } = await createRes.json() as { shortCode: string };

    // Then, test the redirect
    const res = await app.fetch(new Request(`${baseUrl}/${shortCode}`, {
      redirect: "manual"
    }));
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(targetUrl);
  });

  test("GET /nonexistent should return 404", async () => {
    const res = await app.fetch(new Request(`${baseUrl}/invalidcode`));
    expect(res.status).toBe(404);
  });
});
