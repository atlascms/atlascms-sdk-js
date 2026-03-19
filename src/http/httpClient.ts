import { AtlasHttpError, AtlasNetworkError, AtlasTimeoutError, normalizeApiError } from "./errors";
import type { AtlasClientConfig, AtlasRequestOptions } from "../types/http";

interface HttpRequestConfig extends AtlasRequestOptions {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown | FormData;
}

export class AtlasHttpClient {
  private readonly fetchFn: typeof fetch | undefined;
  private readonly defaultHeaders: HeadersInit | undefined;
  private readonly defaultApiKey: string;

  public constructor(config: AtlasClientConfig) {
    this.fetchFn = config.fetchFn;
    this.defaultHeaders = config.defaultHeaders;
    this.defaultApiKey = config.apiKey;
  }

  private resolveFetch(): typeof fetch {
    if (this.fetchFn) return this.fetchFn;
    const globalFetch = (globalThis as Record<string, unknown>).fetch;
    if (typeof globalFetch === "function") {
      return (globalFetch as typeof fetch).bind(globalThis);
    }
    throw new Error(
      "fetch is not available in this environment. " +
        "Pass a fetchFn in the client config (e.g. from 'node-fetch' or 'undici')."
    );
  }

  public async request<TResponse>(request: HttpRequestConfig): Promise<TResponse> {
    const fetchFn = this.resolveFetch();
    const controller = request.timeoutMs ? new AbortController() : undefined;
    const timeoutId = request.timeoutMs
      ? setTimeout(() => {
          controller?.abort(new AtlasTimeoutError(request.timeoutMs!));
        }, request.timeoutMs)
      : undefined;

    const signal = request.signal ?? controller?.signal;
    const headers = this.createHeaders(request.apiKey, request.headers, request.body);

    try {
      const response = await fetchFn(request.url, {
        method: request.method,
        headers,
        body: request.body === undefined ? undefined : request.body instanceof FormData ? request.body : JSON.stringify(request.body),
        signal
      });

      const requestId = response.headers.get("x-request-id") ?? undefined;
      const payload = await parseBody(response);

      if (!response.ok) {
        throw normalizeApiError(response.status, payload, `Request failed with status ${response.status}`, requestId);
      }

      return payload as TResponse;
    } catch (error) {
      if (error instanceof AtlasTimeoutError) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new AtlasTimeoutError(request.timeoutMs ?? 0);
      }

      if (error instanceof AtlasHttpError) {
        throw error;
      }

      throw new AtlasNetworkError("Unable to reach Atlas CMS API", error);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  private createHeaders(apiKey?: string, customHeaders?: HeadersInit, body?: unknown): Headers {
    const headers = new Headers(this.defaultHeaders);
    if (body !== undefined && !(body instanceof FormData)) {
      headers.set("content-type", "application/json");
    }

    const token = apiKey ?? this.defaultApiKey;
    headers.set("authorization", `Bearer ${token}`);

    if (customHeaders) {
      const additional = new Headers(customHeaders);
      additional.forEach((value, key) => headers.set(key, value));
    }

    return headers;
  }
}

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json") || contentType.includes("text/json")) {
    return response.json();
  }

  const text = await response.text();
  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
