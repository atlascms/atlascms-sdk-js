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

export function createModelsApi(http: AtlasHttpClient, restBaseUrl: string, project: string): ModelsApi {
  const encodedProject = encode(project);

  return {
    async list(query?, options) {
      const path = `/${encodedProject}/models`;
      const url = appendQuery(joinPath(restBaseUrl, path), query);
      return http.request<PagedResult<Component>>({
        url,
        method: "GET",
        ...options
      });
    },

    async getById(id, options) {
      const path = `/${encodedProject}/models/${encode(id)}`;
      const url = joinPath(restBaseUrl, path);
      return http.request<Component>({
        url,
        method: "GET",
        ...options
      });
    },

    async create(payload, options) {
      const path = `/${encodedProject}/models`;
      const url = joinPath(restBaseUrl, path);
      const result = await http.request<{ value?: string; key?: string }>({
        url,
        method: "POST",
        body: payload,
        ...options
      });
      return { id: String(result?.value ?? result?.key ?? "") };
    },

    async update(payload, options) {
      const path = `/${encodedProject}/models/${encode(payload.id)}`;
      const url = joinPath(restBaseUrl, path);
      await http.request<void>({
        url,
        method: "PUT",
        body: payload,
        ...options
      });
    },

    async remove(id, options) {
      const path = `/${encodedProject}/models/${encode(id)}`;
      const url = joinPath(restBaseUrl, path);
      await http.request<void>({
        url,
        method: "DELETE",
        ...options
      });
    },

    async publish(id, options) {
      const path = `/${encodedProject}/models/${encode(id)}/publish`;
      const url = joinPath(restBaseUrl, path);
      await http.request<void>({
        url,
        method: "POST",
        ...options
      });
    },

    async unpublish(id, options) {
      const path = `/${encodedProject}/models/${encode(id)}/unpublish`;
      const url = joinPath(restBaseUrl, path);
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
