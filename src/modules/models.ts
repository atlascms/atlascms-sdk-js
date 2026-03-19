import type { AtlasRequestOptions } from "../types/http";
import type { Component, ComponentModel, IField } from "../types/models";
import type { PagedResult } from "../types/entities";
import type { AtlasHttpClient } from "../http/httpClient";
import { appendQuery, joinPath, type QueryInput } from "./internal";

export interface CreateModelInput {
  key: string;
  name?: string | null;
  description?: string | null;
  localizable?: boolean;
  enableStageMode?: boolean;
  enableSeo?: boolean;
  attributes?: IField[] | null;
}

export interface UpdateModelInput {
  id: string;
  name?: string | null;
  description?: string | null;
  localizable?: boolean;
  enableStageMode?: boolean;
  enableSeo?: boolean;
  attributes?: IField[] | null;
}

export interface ModelsApi {
  list(query?: QueryInput, options?: AtlasRequestOptions): Promise<PagedResult<Component>>;

  getById(id: string, options?: AtlasRequestOptions): Promise<Component>;

  create(payload: CreateModelInput, options?: AtlasRequestOptions): Promise<{ id: string }>;

  update(payload: UpdateModelInput, options?: AtlasRequestOptions): Promise<void>;

  remove(id: string, options?: AtlasRequestOptions): Promise<void>;

  publish(id: string, options?: AtlasRequestOptions): Promise<void>;

  unpublish(id: string, options?: AtlasRequestOptions): Promise<void>;
}

export function createModelsApi(http: AtlasHttpClient, restBaseUrl: string): ModelsApi {
  return {
    async list(query?, options?) {
      const url = appendQuery(joinPath(restBaseUrl, "/models"), query);
      return http.request<PagedResult<Component>>({
        url,
        method: "GET",
        ...options
      });
    },

    async getById(id, options) {
      const url = joinPath(restBaseUrl, `/models/${encode(id)}`);
      return http.request<Component>({
        url,
        method: "GET",
        ...options
      });
    },

    async create(payload, options) {
      const url = joinPath(restBaseUrl, "/models");
      const result = await http.request<{ value?: string; key?: string }>({
        url,
        method: "POST",
        body: payload,
        ...options
      });
      return { id: String(result?.value ?? result?.key ?? "") };
    },

    async update(payload, options) {
      const url = joinPath(restBaseUrl, `/models/${encode(payload.id)}`);
      await http.request<void>({
        url,
        method: "PUT",
        body: payload,
        ...options
      });
    },

    async remove(id, options) {
      const url = joinPath(restBaseUrl, `/models/${encode(id)}`);
      await http.request<void>({
        url,
        method: "DELETE",
        ...options
      });
    },

    async publish(id, options) {
      const url = joinPath(restBaseUrl, `/models/${encode(id)}/publish`);
      await http.request<void>({
        url,
        method: "POST",
        ...options
      });
    },

    async unpublish(id, options) {
      const url = joinPath(restBaseUrl, `/models/${encode(id)}/unpublish`);
      await http.request<void>({
        url,
        method: "POST",
        ...options
      });
    }
  };
}

function encode(value: string): string {
  return encodeURIComponent(value);
}
