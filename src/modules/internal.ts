import type { QueryBuilderResult } from "../types/http";

export type QueryInput = QueryBuilderResult | URLSearchParams | string | undefined;

export function joinPath(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export function appendQuery(url: string, query?: QueryInput): string {
  if (!query) {
    return url;
  }

  const queryString = normalizeQuery(query);
  if (!queryString) {
    return url;
  }

  return `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
}

function normalizeQuery(query: QueryBuilderResult | URLSearchParams | string): string {
  if (typeof query === "string") {
    return query.startsWith("?") ? query.slice(1) : query;
  }
  if (query instanceof URLSearchParams) {
    return query.toString();
  }
  return query.queryString;
}
