import { describe, expect, it, vi } from "vitest";
import { contentsQuery, createAtlasCmsClient, mediaQuery, usersQuery } from "../src";

function makeJsonFetch(body: unknown, status = 200): typeof fetch {
  return vi.fn(async () => {
    return new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" }
    });
  }) as unknown as typeof fetch;
}

function makeEmptyFetch(status = 200): typeof fetch {
  return vi.fn(async () => new Response(null, { status })) as unknown as typeof fetch;
}

function makeClient(fetchFn: typeof fetch) {
  return createAtlasCmsClient({
    projectId: "my-project",
    baseUrl: "https://api.example.com",
    apiKey: "base-token",
    fetchFn
  });
}

const pagedResponse = {
  data: [],
  metadata: {
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: 10,
    hasPreviousPage: false,
    hasNextPage: false
  }
};

// ─── Contents ────────────────────────────────────────────────────────────────

describe("contents", () => {
  it("list — builds correct URL with query builder", async () => {
    const fetchFn = makeJsonFetch(pagedResponse);
    const client = makeClient(fetchFn);

    await client.contents.list("pages", contentsQuery().status("published").filter("id", "eq", "abc").build());

    const [url] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/contents/pages");
    expect(String(url)).toContain("filter%5Bid%5D%5Beq%5D=abc");
    expect(String(url)).toContain("status=published");
  });

  it("getById — builds correct URL", async () => {
    const fetchFn = makeJsonFetch({ id: "abc", modelKey: "pages" });
    const client = makeClient(fetchFn);

    await client.contents.getById("pages", "abc");

    const [url] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/contents/pages/abc");
  });

  it("getSingle — hits /single suffix", async () => {
    const fetchFn = makeJsonFetch({ id: "abc", modelKey: "settings" });
    const client = makeClient(fetchFn);

    await client.contents.getSingle("settings");

    const [url] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/contents/settings/single");
  });

  it("count — returns number value", async () => {
    const fetchFn = makeJsonFetch({ value: 42 });
    const client = makeClient(fetchFn);

    const result = await client.contents.count("pages");

    expect(result).toBe(42);
    const [url] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/contents/pages/count");
  });

  it("create — POSTs body and returns id", async () => {
    const fetchFn = makeJsonFetch({ value: "new-id" });
    const client = makeClient(fetchFn);

    const result = await client.contents.create("pages", { type: "pages", attributes: { title: "Hello" } });

    expect(result.id).toBe("new-id");
    const [url, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/contents/pages");
    expect(options?.method).toBe("POST");
  });

  it("update — sends PUT with body", async () => {
    const fetchFn = makeEmptyFetch();
    const client = makeClient(fetchFn);

    await client.contents.update("pages", "abc", { type: "pages", attributes: { title: "Updated" } });

    const [url, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/contents/pages/abc");
    expect(options?.method).toBe("PUT");
  });

  it("remove — sends DELETE", async () => {
    const fetchFn = makeEmptyFetch();
    const client = makeClient(fetchFn);

    await client.contents.remove("pages", "abc");

    const [url, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/contents/pages/abc");
    expect(options?.method).toBe("DELETE");
  });

  it("changeStatus — POSTs to /status with status payload", async () => {
    const fetchFn = makeEmptyFetch();
    const client = makeClient(fetchFn);

    await client.contents.changeStatus("pages", "abc", "published");

    const [url, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/contents/pages/abc/status");
    expect(options?.method).toBe("POST");
    expect(JSON.parse(options?.body as string)).toEqual({ status: "published" });
  });

  it("createTranslation — POSTs to /create-translation with locale", async () => {
    const fetchFn = makeJsonFetch({ value: "translated-id" });
    const client = makeClient(fetchFn);

    const result = await client.contents.createTranslation("pages", "abc", "it-IT");

    expect(result.id).toBe("translated-id");
    const [url, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/contents/pages/abc/create-translation");
    expect(options?.method).toBe("POST");
    expect(JSON.parse(options?.body as string)).toEqual({ locale: "it-IT" });
  });

  it("duplicate — POSTs to /duplicate with locales flag", async () => {
    const fetchFn = makeJsonFetch({ value: "dup-id" });
    const client = makeClient(fetchFn);

    const result = await client.contents.duplicate("pages", "abc", true);

    expect(result.id).toBe("dup-id");
    const [url, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/contents/pages/abc/duplicate");
    expect(options?.method).toBe("POST");
    expect(JSON.parse(options?.body as string)).toEqual({ locales: true });
  });
});

// ─── Media ───────────────────────────────────────────────────────────────────

describe("media", () => {
  it("list — supports query builder and token override", async () => {
    const fetchFn = makeJsonFetch(pagedResponse);
    const client = makeClient(fetchFn);

    await client.media.list(mediaQuery().page(1).size(25).build(), { apiKey: "custom-token" });

    const [, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(new Headers(options?.headers).get("authorization")).toBe("Bearer custom-token");
  });

  it("upload — sends multipart/form-data, no content-type override", async () => {
    const fetchFn = makeJsonFetch({ id: "media-id", name: "photo.jpg" });
    const client = makeClient(fetchFn);

    const file = new File(["binary"], "photo.jpg", { type: "image/jpeg" });
    await client.media.upload({ file, folder: "images" });

    const [url, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/media-library/media/upload");
    expect(options?.method).toBe("POST");
    expect(options?.body).toBeInstanceOf(FormData);
    // fetch must set boundary automatically — no explicit content-type
    expect(new Headers(options?.headers).get("content-type")).toBeNull();
  });

  it("upload with id — sends id field for replacement", async () => {
    const fetchFn = makeJsonFetch({ id: "existing-id", name: "photo.jpg" });
    const client = makeClient(fetchFn);

    const file = new Blob(["binary"], { type: "image/jpeg" });
    await client.media.upload({ file, id: "existing-id", fileName: "photo.jpg" });

    const [, options] = vi.mocked(fetchFn).mock.calls[0]!;
    const form = options?.body as FormData;
    expect(form.get("id")).toBe("existing-id");
    expect(form.get("fileName")).toBe("photo.jpg");
  });

  it("remove — sends DELETE", async () => {
    const fetchFn = makeEmptyFetch();
    const client = makeClient(fetchFn);

    await client.media.remove("media-id");

    const [url, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/media-library/media/media-id");
    expect(options?.method).toBe("DELETE");
  });

  it("setTags — POSTs tags array", async () => {
    const fetchFn = makeEmptyFetch();
    const client = makeClient(fetchFn);

    await client.media.setTags("media-id", ["hero", "featured"]);

    const [url, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/media-library/media/media-id/tags");
    expect(JSON.parse(options?.body as string)).toEqual({ tags: ["hero", "featured"] });
  });
});

// ─── Users ───────────────────────────────────────────────────────────────────

describe("users", () => {
  it("list — hits /users (not /admin/memberships) and returns paged result", async () => {
    const fetchFn = makeJsonFetch(pagedResponse);
    const client = makeClient(fetchFn);

    const result = await client.users.list();

    const [url] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/users");
    expect(String(url)).not.toContain("memberships");
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("metadata");
  });

  it("list — applies query builder filters", async () => {
    const fetchFn = makeJsonFetch(pagedResponse);
    const client = makeClient(fetchFn);

    await client.users.list(usersQuery().email("john@acme.com").isActive(true).page(2).build());

    const [url] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("filter%5Bemail%5D%5Beq%5D=john%40acme.com");
    expect(String(url)).toContain("filter%5BisActive%5D%5Beq%5D=true");
    expect(String(url)).toContain("page=2");
  });

  it("count — returns number", async () => {
    const fetchFn = makeJsonFetch({ value: 7 });
    const client = makeClient(fetchFn);

    const result = await client.users.count();

    expect(result).toBe(7);
    const [url] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/users/count");
  });

  it("getById — builds correct URL", async () => {
    const fetchFn = makeJsonFetch({ id: "user-1", email: "john@acme.com" });
    const client = makeClient(fetchFn);

    await client.users.getById("user-1");

    const [url] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/users/user-1");
  });

  it("create — POSTs to /register and returns id", async () => {
    const fetchFn = makeJsonFetch({ value: "new-user-id" });
    const client = makeClient(fetchFn);

    const result = await client.users.create({
      email: "jane@acme.com",
      firstName: "Jane",
      password: "secret",
      roles: ["editor"]
    });

    expect(result.id).toBe("new-user-id");
    const [url, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/users/register");
    expect(options?.method).toBe("POST");
    const body = JSON.parse(options?.body as string);
    expect(body.email).toBe("jane@acme.com");
    expect(body.roles).toEqual(["editor"]);
  });

  it("update — sends PUT with body", async () => {
    const fetchFn = makeEmptyFetch();
    const client = makeClient(fetchFn);

    await client.users.update("user-1", { firstName: "Jane", notes: "VIP" });

    const [url, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/users/user-1");
    expect(options?.method).toBe("PUT");
    const body = JSON.parse(options?.body as string);
    expect(body.firstName).toBe("Jane");
    expect(body.notes).toBe("VIP");
  });

  it("remove — sends DELETE", async () => {
    const fetchFn = makeEmptyFetch();
    const client = makeClient(fetchFn);

    await client.users.remove("user-1");

    const [url, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/users/user-1");
    expect(options?.method).toBe("DELETE");
  });

  it("changeStatus — POSTs isActive flag", async () => {
    const fetchFn = makeEmptyFetch();
    const client = makeClient(fetchFn);

    await client.users.changeStatus("user-1", false);

    const [url, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/users/user-1/status");
    expect(JSON.parse(options?.body as string)).toEqual({ isActive: false });
  });

  it("changePassword — POSTs new password", async () => {
    const fetchFn = makeEmptyFetch();
    const client = makeClient(fetchFn);

    await client.users.changePassword("user-1", "newSecret123");

    const [url, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/users/user-1/change-password");
    expect(JSON.parse(options?.body as string)).toEqual({ password: "newSecret123" });
  });

  it("supports dynamic attribute types via generics", async () => {
    const fetchFn = makeJsonFetch({
      ...pagedResponse,
      data: [{ id: "u1", attributes: { department: "engineering", level: 3 } }]
    });
    const client = makeClient(fetchFn);

    type UserAttrs = { department: string; level: number };
    const result = await client.users.list<UserAttrs>();

    expect(result.data[0]?.attributes?.department).toBe("engineering");
    expect(result.data[0]?.attributes?.level).toBe(3);
  });
});

// ─── Roles ───────────────────────────────────────────────────────────────────

describe("roles", () => {
  it("list — GETs /users/roles", async () => {
    const fetchFn = makeJsonFetch([{ id: "r1", name: "editor", system: false, permissions: ["content.read"] }]);
    const client = makeClient(fetchFn);

    const result = await client.roles.list();

    expect(result).toHaveLength(1);
    expect(result[0]?.name).toBe("editor");
    const [url] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/users/roles");
  });

  it("create — POSTs and returns id", async () => {
    const fetchFn = makeJsonFetch({ value: "role-id" });
    const client = makeClient(fetchFn);

    const result = await client.roles.create({ name: "editor", permissions: ["content.read", "content.write"] });

    expect(result.id).toBe("role-id");
    const [url, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/users/roles");
    expect(options?.method).toBe("POST");
    const body = JSON.parse(options?.body as string);
    expect(body.name).toBe("editor");
    expect(body.permissions).toEqual(["content.read", "content.write"]);
  });

  it("update — sends PUT with id in path", async () => {
    const fetchFn = makeEmptyFetch();
    const client = makeClient(fetchFn);

    await client.roles.update("role-id", { name: "senior-editor", permissions: ["content.read"] });

    const [url, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/users/roles/role-id");
    expect(options?.method).toBe("PUT");
    expect(JSON.parse(options?.body as string).name).toBe("senior-editor");
  });

  it("remove — sends DELETE", async () => {
    const fetchFn = makeEmptyFetch();
    const client = makeClient(fetchFn);

    await client.roles.remove("role-id");

    const [url, options] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/users/roles/role-id");
    expect(options?.method).toBe("DELETE");
  });

  it("getPermissions — GETs /users/roles/permissions", async () => {
    const fetchFn = makeJsonFetch([
      { group: "content", type: "cms", key: "content.read", sections: [] }
    ]);
    const client = makeClient(fetchFn);

    const result = await client.roles.getPermissions();

    expect(result).toHaveLength(1);
    expect(result[0]?.group).toBe("content");
    const [url] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toContain("/my-project/users/roles/permissions");
  });
});

// ─── GraphQL ─────────────────────────────────────────────────────────────────

describe("graphql", () => {
  it("POSTs to graphql endpoint and returns data", async () => {
    const fetchFn = makeJsonFetch({ data: { ping: "pong" } });
    const client = makeClient(fetchFn);

    const response = await client.graphql.execute<{ ping: string }>({
      query: "query Ping { ping }"
    });

    expect(response.data?.ping).toBe("pong");
    const [url] = vi.mocked(fetchFn).mock.calls[0]!;
    expect(String(url)).toBe("https://api.example.com/my-project/graphql");
  });
});
