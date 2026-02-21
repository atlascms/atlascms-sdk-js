import { describe, expect, it } from "vitest";
import { contentsQuery, mediaQuery, usersQuery } from "../src";

describe("Query builders", () => {
  it("serializes content filters with DSL syntax", () => {
    const built = contentsQuery()
      .page(2)
      .size(20)
      .status("published")
      .locale("it-IT")
      .search("home")
      .resolve(["media", "mediagallery", "relations"])
      .filter("createdAt", "gte", "2026-01-01T00:00:00.000Z")
      .filter("address.country", "eq", "italy")
      .filter("status", "eq", "published")
      .sort("createdAt", "desc")
      .build();

    expect(built.queryString).toContain("page=2");
    expect(built.queryString).toContain("size=20");
    expect(built.queryString).toContain("status=published");
    expect(built.queryString).toContain("locale=it-IT");
    expect(built.queryString).toContain("search=home");
    expect(built.queryString).toContain("resolve=media%2Cmediagallery%2Crelations");
    expect(built.queryString).toContain("filter%5BcreatedAt%5D%5Bgte%5D=2026-01-01T00%3A00%3A00.000Z");
    expect(built.queryString).toContain("filter%5Baddress.country%5D%5Beq%5D=italy");
    expect(built.queryString).toContain("filter%5Bstatus%5D%5Beq%5D=published");
    expect(built.queryString).toContain("sort=createdAt%3Adesc");
  });

  it("supports repeated filter values for media arrays", () => {
    const built = mediaQuery().filter("tags", "any", ["hero", "homepage"]).build();
    const values = built.searchParams.getAll("filter[tags][any]");
    expect(values).toEqual(["hero", "homepage"]);
  });

  it("supports dynamic raw filters for users", () => {
    const built = usersQuery()
      .email("john@acme.com")
      .username("john")
      .mobilePhone("+39123456789")
      .firstName("John")
      .lastName("Doe")
      .isActive(true)
      .roles(["editor", "admin"])
      .filterRaw("attributes.department", "eq", "sales")
      .build();

    expect(built.searchParams.get("filter[email][eq]")).toBe("john@acme.com");
    expect(built.searchParams.get("filter[username][eq]")).toBe("john");
    expect(built.searchParams.get("filter[mobilePhone][eq]")).toBe("+39123456789");
    expect(built.searchParams.get("filter[firstName][eq]")).toBe("John");
    expect(built.searchParams.get("filter[lastName][eq]")).toBe("Doe");
    expect(built.searchParams.get("filter[isActive][eq]")).toBe("true");
    expect(built.searchParams.getAll("filter[roles][any]")).toEqual(["editor", "admin"]);
    expect(built.searchParams.get("filter[attributes.department][eq]")).toBe("sales");
  });
});
