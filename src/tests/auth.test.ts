import { afterEach, describe, expect, it, vi } from "vitest";

async function withAuthKey(key: string | undefined, fn: () => Promise<void>) {
  const prev = process.env.AUTH_KEY;
  if (key === undefined) delete process.env.AUTH_KEY;
  else process.env.AUTH_KEY = key;
  vi.resetModules();
  try {
    await fn();
  } finally {
    if (prev === undefined) delete process.env.AUTH_KEY;
    else process.env.AUTH_KEY = prev;
    vi.resetModules();
  }
}

describe("server auth", () => {
  afterEach(() => vi.resetModules());

  it("allows /health without a key when AUTH_KEY is unset", async () => {
    await withAuthKey(undefined, async () => {
      const { buildServer } = await import("../server.js");
      const app = buildServer();
      const res = await app.inject({ method: "GET", url: "/health" });
      expect(res.statusCode).toBe(200);
      await app.close();
    });
  });

  it("rejects /chat without X-ZRA-KEY when AUTH_KEY is set", async () => {
    await withAuthKey("s3cret", async () => {
      const { buildServer } = await import("../server.js");
      const app = buildServer();
      const res = await app.inject({
        method: "POST",
        url: "/chat",
        payload: { input: "hello" },
      });
      expect(res.statusCode).toBe(401);
      await app.close();
    });
  });

  it("accepts /chat with matching X-ZRA-KEY", async () => {
    await withAuthKey("s3cret", async () => {
      const { buildServer } = await import("../server.js");
      const app = buildServer();
      const res = await app.inject({
        method: "POST",
        url: "/chat",
        headers: { "x-zra-key": "s3cret" },
        payload: { input: "/pricing", context: { pricing: { weight: 1, unit: "g", karat: 14, spotPricePerTroyOz: 2000 } } },
      });
      expect(res.statusCode).toBe(200);
      await app.close();
    });
  });

  it("leaves /health unauthenticated even when AUTH_KEY is set", async () => {
    await withAuthKey("s3cret", async () => {
      const { buildServer } = await import("../server.js");
      const app = buildServer();
      const res = await app.inject({ method: "GET", url: "/health" });
      expect(res.statusCode).toBe(200);
      await app.close();
    });
  });
});
