import type { AtlasRequestOptions } from "../types/http";
import type { Content, PagedResult } from "../types/entities";
import type { ContentSeo } from "../types/seo";
import type { AtlasHttpClient } from "../http/httpClient";
import { appendQuery, joinPath, type QueryInput } from "./internal";

export interface CreateContentInput<TAttributes extends Record<string, unknown> = Record<string, unknown>> {
  locale?: string;
  type: string;
  attributes?: TAttributes;
  seo?: ContentSeo | null;
}

export interface UpdateContentInput<TAttributes extends Record<string, unknown> = Record<string, unknown>> {
  locale?: string;
  type: string;
  attributes?: TAttributes;
  seo?: ContentSeo | null;
}

export interface UpdateContentSeoInput {
  seo: ContentSeo | null;
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

  updateSeo(
    type: string,
    id: string,
    payload: UpdateContentSeoInput,
    options?: AtlasRequestOptions
  ): Promise<void>;
}

export function createContentsApi(http: AtlasHttpClient, restBaseUrl: string): ContentsApi {
  return {
    async list<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
      type: string,
      query?: QueryInput,
      options?: AtlasRequestOptions
    ) {
      const url = appendQuery(joinPath(restBaseUrl, `/contents/${encode(type)}`), query);
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
      const url = appendQuery(joinPath(restBaseUrl, `/contents/${encode(type)}/${encode(id)}`), query);
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
      const url = appendQuery(joinPath(restBaseUrl, `/contents/${encode(type)}/single`), query);
      return http.request<Content<TAttributes>>({
        url,
        method: "GET",
        ...options
      });
    },

    async count(type, query, options) {
      const url = appendQuery(joinPath(restBaseUrl, `/contents/${encode(type)}/count`), query);
      const result = await http.request<{ value?: number; key?: number }>({
        url,
        method: "GET",
        ...options
      });
      return typeof result?.value === "number" ? result.value : Number(result?.key ?? 0);
    },

    async create(type, payload, options) {
      const url = joinPath(restBaseUrl, `/contents/${encode(type)}`);
      const result = await http.request<{ value?: string; key?: string }>({
        url,
        method: "POST",
        body: payload,
        ...options
      });
      return { id: String(result?.value ?? result?.key ?? "") };
    },

    async update(type, id, payload, options) {
      const url = joinPath(restBaseUrl, `/contents/${encode(type)}/${encode(id)}`);
      await http.request<void>({
        url,
        method: "PUT",
        body: payload,
        ...options
      });
    },

    async remove(type, id, options) {
      const url = joinPath(restBaseUrl, `/contents/${encode(type)}/${encode(id)}`);
      await http.request<void>({
        url,
        method: "DELETE",
        ...options
      });
    },

    async changeStatus(type, id, status, options) {
      const url = joinPath(restBaseUrl, `/contents/${encode(type)}/${encode(id)}/status`);
      await http.request<void>({
        url,
        method: "POST",
        body: { status },
        ...options
      });
    },

    async createTranslation(type, id, locale, options) {
      const url = joinPath(restBaseUrl, `/contents/${encode(type)}/${encode(id)}/create-translation`);
      const result = await http.request<{ value?: string; key?: string }>({
        url,
        method: "POST",
        body: { locale },
        ...options
      });
      return { id: String(result?.value ?? result?.key ?? "") };
    },

    async duplicate(type, id, locales, options) {
      const url = joinPath(restBaseUrl, `/contents/${encode(type)}/${encode(id)}/duplicate`);
      const result = await http.request<{ value?: string; key?: string }>({
        url,
        method: "POST",
        body: { locales },
        ...options
      });
      return { id: String(result?.value ?? result?.key ?? "") };
    },

    async updateSeo(type, id, payload, options) {
      const url = joinPath(restBaseUrl, `/contents/${encode(type)}/${encode(id)}/seo`);
      await http.request<void>({
        url,
        method: "POST",
        body: payload,
        ...options
      });
    }
  };
}

function encode(value: string): string {
  return encodeURIComponent(value);
}
