import { describe, expect, it, vi } from "vitest";
import { AtlasHttpClient } from "../src/http/httpClient";
import { AtlasHttpError } from "../src/http/errors";
import type { AtlasClientConfig } from "../src/types/http";

function createConfig(fetchFn: typeof fetch): AtlasClientConfig {
  return {
    projectId: "my-project",
    baseUrl: "https://api.example.com",
    apiKey: "default-token",
    fetchFn
  };
}

describe("AtlasHttpClient", () => {
  it("sends default bearer token and parses JSON", async () => {
    const fetchFn = vi.fn(async () => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }) as unknown as typeof fetch;

    const client = new AtlasHttpClient(createConfig(fetchFn));
    const result = await client.request<{ ok: boolean }>({
      method: "GET",
      url: "https://api.example.com/ping"
    });

    expect(result.ok).toBe(true);
    expect(fetchFn).toHaveBeenCalledTimes(1);
    const [, options] = vi.mocked(fetchFn).mock.calls[0];
    expect(new Headers(options?.headers).get("authorization")).toBe("Bearer default-token");
  });

  it("allows request-level apiKey override", async () => {
    const fetchFn = vi.fn(async () => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }) as unknown as typeof fetch;

    const client = new AtlasHttpClient(createConfig(fetchFn));
    await client.request<{ ok: boolean }>({
      method: "GET",
      url: "https://api.example.com/ping",
      apiKey: "override-token"
    });

    const [, options] = vi.mocked(fetchFn).mock.calls[0];
    expect(new Headers(options?.headers).get("authorization")).toBe("Bearer override-token");
  });

  it("sends FormData body without overriding content-type", async () => {
    const fetchFn = vi.fn(async () => {
      return new Response(JSON.stringify({ id: "x" }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }) as unknown as typeof fetch;

    const client = new AtlasHttpClient(createConfig(fetchFn));
    const form = new FormData();
    form.append("file", new Blob(["data"]), "file.txt");

    await client.request({ method: "POST", url: "https://api.example.com/upload", body: form });

    const [, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(options?.body).toBeInstanceOf(FormData);
    expect(new Headers(options?.headers).get("content-type")).toBeNull();
  });

  it("normalizes API errors", async () => {
    const fetchFn = vi.fn(async () => {
      return new Response(JSON.stringify({ message: "Invalid payload", code: "bad_request" }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }) as unknown as typeof fetch;

    const client = new AtlasHttpClient(createConfig(fetchFn));

    await expect(
      client.request({
        method: "GET",
        url: "https://api.example.com/fail"
      })
    ).rejects.toBeInstanceOf(AtlasHttpError);
  });
});
