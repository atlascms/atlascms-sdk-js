import type { AtlasRequestOptions } from "../types/http";
import type { Content, PagedResult } from "../types/entities";
import type { AtlasHttpClient } from "../http/httpClient";
import { appendQuery, joinPath, type QueryInput } from "./internal";

export interface CreateContentInput<TAttributes extends Record<string, unknown> = Record<string, unknown>> {
  locale?: string;
  type: string;
  attributes?: TAttributes;
}

export interface UpdateContentInput<TAttributes extends Record<string, unknown> = Record<string, unknown>> {
  locale?: string;
  type: string;
  attributes?: TAttributes;
}

export interface ContentsApi {
  list<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
    type: string,
    query?: QueryInput,
    options?: AtlasRequestOptions
  ): Promise<PagedResult<Content<TAttributes>>>;

  getById<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
    type: string,
    id: string,
    query?: QueryInput,
    options?: AtlasRequestOptions
  ): Promise<Content<TAttributes>>;

  getSingle<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
    type: string,
    query?: QueryInput,
    options?: AtlasRequestOptions
  ): Promise<Content<TAttributes>>;

  count(type: string, query?: QueryInput, options?: AtlasRequestOptions): Promise<number>;

  create<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
    type: string,
    payload: CreateContentInput<TAttributes>,
    options?: AtlasRequestOptions
  ): Promise<{ id: string }>;

  update<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
    type: string,
    id: string,
    payload: UpdateContentInput<TAttributes>,
    options?: AtlasRequestOptions
  ): Promise<void>;

  remove(type: string, id: string, options?: AtlasRequestOptions): Promise<void>;

  changeStatus(
    type: string,
    id: string,
    status: "published" | "unpublished",
    options?: AtlasRequestOptions
  ): Promise<void>;

  createTranslation(
    type: string,
    id: string,
    locale?: string,
    options?: AtlasRequestOptions
  ): Promise<{ id: string }>;

  duplicate(
    type: string,
    id: string,
    locales?: boolean,
    options?: AtlasRequestOptions
  ): Promise<{ id: string }>;
}

export function createContentsApi(http: AtlasHttpClient, restBaseUrl: string, project: string): ContentsApi {
  const encodedProject = encode(project);

  return {
    async list<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
      type: string,
      query?: QueryInput,
      options?: AtlasRequestOptions
    ) {
      const path = `/${encodedProject}/contents/${encode(type)}`;
      const url = appendQuery(joinPath(restBaseUrl, path), query);
      return http.request<PagedResult<Content<TAttributes>>>({
        url,
        method: "GET",
        ...options
      });
    },

    async getById<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
      type: string,
      id: string,
      query?: QueryInput,
      options?: AtlasRequestOptions
    ) {
      const path = `/${encodedProject}/contents/${encode(type)}/${encode(id)}`;
      const url = appendQuery(joinPath(restBaseUrl, path), query);
      return http.request<Content<TAttributes>>({
        url,
        method: "GET",
        ...options
      });
    },

    async getSingle<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
      type: string,
      query?: QueryInput,
      options?: AtlasRequestOptions
    ) {
      const path = `/${encodedProject}/contents/${encode(type)}/single`;
      const url = appendQuery(joinPath(restBaseUrl, path), query);
      return http.request<Content<TAttributes>>({
        url,
        method: "GET",
        ...options
      });
    },

    async count(type, query, options) {
      const path = `/${encodedProject}/contents/${encode(type)}/count`;
      const url = appendQuery(joinPath(restBaseUrl, path), query);
      const result = await http.request<{ value?: number; key?: number }>({
        url,
        method: "GET",
        ...options
      });
      return typeof result?.value === "number" ? result.value : Number(result?.key ?? 0);
    },

    async create(type, payload, options) {
      const path = `/${encodedProject}/contents/${encode(type)}`;
      const url = joinPath(restBaseUrl, path);
      const result = await http.request<{ value?: string; key?: string }>({
        url,
        method: "POST",
        body: payload,
        ...options
      });
      return { id: String(result?.value ?? result?.key ?? "") };
    },

    async update(type, id, payload, options) {
      const path = `/${encodedProject}/contents/${encode(type)}/${encode(id)}`;
      const url = joinPath(restBaseUrl, path);
      await http.request<void>({
        url,
        method: "PUT",
        body: payload,
        ...options
      });
    },

    async remove(type, id, options) {
      const path = `/${encodedProject}/contents/${encode(type)}/${encode(id)}`;
      const url = joinPath(restBaseUrl, path);
      await http.request<void>({
        url,
        method: "DELETE",
        ...options
      });
    },

    async changeStatus(type, id, status, options) {
      const path = `/${encodedProject}/contents/${encode(type)}/${encode(id)}/status`;
      const url = joinPath(restBaseUrl, path);
      await http.request<void>({
        url,
        method: "POST",
        body: { status },
        ...options
      });
    },

    async createTranslation(type, id, locale, options) {
      const path = `/${encodedProject}/contents/${encode(type)}/${encode(id)}/create-translation`;
      const url = joinPath(restBaseUrl, path);
      const result = await http.request<{ value?: string; key?: string }>({
        url,
        method: "POST",
        body: { locale },
        ...options
      });
      return { id: String(result?.value ?? result?.key ?? "") };
    },

    async duplicate(type, id, locales, options) {
      const path = `/${encodedProject}/contents/${encode(type)}/${encode(id)}/duplicate`;
      const url = joinPath(restBaseUrl, path);
      const result = await http.request<{ value?: string; key?: string }>({
        url,
        method: "POST",
        body: { locales },
        ...options
      });
      return { id: String(result?.value ?? result?.key ?? "") };
    }
  };
}

function encode(value: string): string {
  return encodeURIComponent(value);
}
