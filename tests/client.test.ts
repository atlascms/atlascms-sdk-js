import { describe, expect, it, vi } from "vitest";
import { contentsQuery, createAtlasCmsClient, mediaQuery } from "../src";

describe("AtlasCmsClient modules", () => {
  it("calls contents list with query builder", async () => {
    const fetchFn = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          data: [],
          metadata: {
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
            pageSize: 10,
            hasPreviousPage: false,
            hasNextPage: false
          }
        }),
        { status: 200, headers: { "content-type": "application/json" } }
      );
    }) as unknown as typeof fetch;

    const client = createAtlasCmsClient({
      project: "my-project",
      restBaseUrl: "https://api.example.com",
      graphqlBaseUrl: "https://graphql.example.com",
      apiKey: "base-token",
      fetchFn
    });

    await client.contents.list("pages", contentsQuery().status("published").filter("id", "eq", "abc").build());

    const [url] = vi.mocked(fetchFn).mock.calls[0];
    expect(String(url)).toContain("/my-project/contents/pages");
    expect(String(url)).toContain("filter%5Bid%5D%5Beq%5D=abc");
  });

  it("calls media list and supports token override", async () => {
    const fetchFn = vi.fn(async () => {
      return new Response(JSON.stringify({ data: [], metadata: {} }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }) as unknown as typeof fetch;

    const client = createAtlasCmsClient({
      project: "my-project",
      restBaseUrl: "https://api.example.com",
      graphqlBaseUrl: "https://graphql.example.com",
      apiKey: "base-token",
      fetchFn
    });

    await client.media.list(mediaQuery().page(1).size(25).build(), {
      apiKey: "custom-token"
    });

    const [, options] = vi.mocked(fetchFn).mock.calls[0];
    expect(new Headers(options?.headers).get("authorization")).toBe("Bearer custom-token");
  });

  it("calls graphql endpoint", async () => {
    const fetchFn = vi.fn(async () => {
      return new Response(JSON.stringify({ data: { ping: "pong" } }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }) as unknown as typeof fetch;

    const client = createAtlasCmsClient({
      project: "my-project",
      restBaseUrl: "https://api.example.com",
      graphqlBaseUrl: "https://graphql.example.com/graphql",
      apiKey: "base-token",
      fetchFn
    });

    const response = await client.graphql.execute<{ ping: string }>({
      query: "query Ping { ping }"
    });

    expect(response.data?.ping).toBe("pong");
    const [url] = vi.mocked(fetchFn).mock.calls[0];
    expect(String(url)).toBe("https://graphql.example.com/graphql");
  });
});
