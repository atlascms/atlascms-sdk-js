import type { AtlasRequestOptions } from "../types/http";
import type { Content, KeyResult, PagedResult } from "../types/entities";
import type { ContentSeo } from "../types/seo";
import type { AtlasHttpClient } from "../http/httpClient";
import { appendQuery, joinPath, type QueryInput } from "./internal";

export interface CreateContentInput<TAttributes extends Record<string, unknown> = Record<string, unknown>> {
  // Swagger: optional `locale`, required `type` is provided by the path + body wrapper.
  locale?: string;
  // Swagger: `attributes` is an object (nullable). We keep it optional here.
  attributes?: TAttributes;
}

export interface UpdateContentInput<TAttributes extends Record<string, unknown> = Record<string, unknown>> {
  // Swagger: only `attributes` and `seo` are allowed in UpdateContentCommand body.
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
      const result = await http.request<KeyResult<number>>({
        url,
        method: "GET",
        ...options
      });
      return result?.result ?? 0;
    },

    async create(type, payload, options) {
      const url = joinPath(restBaseUrl, `/contents/${encode(type)}`);
      // Swagger CreateContentCommand: { type, locale?, attributes? } (no `seo`).
      const body = {
        type,
        locale: payload.locale,
        attributes: payload.attributes
      };
      const result = await http.request<KeyResult<string>>({
        url,
        method: "POST",
        body,
        ...options
      });
      return { id: String(result?.result ?? "") };
    },

    async update(type, id, payload, options) {
      const url = joinPath(restBaseUrl, `/contents/${encode(type)}/${encode(id)}`);
      // Swagger UpdateContentCommand: { id, type, attributes?, seo? } (no `locale`).
      const body = {
        id,
        type,
        attributes: payload.attributes,
        seo: payload.seo
      };
      await http.request<void>({
        url,
        method: "PUT",
        body,
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
        // Swagger ChangeStatusCommand: { id, type, status }
        body: { id, type, status },
        ...options
      });
    },

    async createTranslation(type, id, locale, options) {
      const url = joinPath(restBaseUrl, `/contents/${encode(type)}/${encode(id)}/create-translation`);
      // Swagger CreateContentTranslationCommand: { id, type, locale? }
      const body = { id, type, locale };
      const result = await http.request<KeyResult<string>>({
        url,
        method: "POST",
        body,
        ...options
      });
      return { id: String(result?.result ?? "") };
    },

    async duplicate(type, id, locales, options) {
      const url = joinPath(restBaseUrl, `/contents/${encode(type)}/${encode(id)}/duplicate`);
      // Swagger DuplicateContentCommand: { id, type, locales? }
      const body = { id, type, locales };
      const result = await http.request<KeyResult<string>>({
        url,
        method: "POST",
        body,
        ...options
      });
      return { id: String(result?.result ?? "") };
    },

    async updateSeo(type, id, payload, options) {
      const url = joinPath(restBaseUrl, `/contents/${encode(type)}/${encode(id)}/seo`);
      // Swagger UpdateContentSeoCommand: { id, type, seo }
      await http.request<void>({
        url,
        method: "POST",
        body: { id, type, seo: payload.seo },
        ...options
      });
    }
  };
}

function encode(value: string): string {
  return encodeURIComponent(value);
}
