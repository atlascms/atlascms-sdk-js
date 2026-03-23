import type { AtlasRequestOptions } from "../types/http";
import type { Component, IField } from "../types/models";
import type { KeyResult, PagedResult } from "../types/entities";
import type { AtlasHttpClient } from "../http/httpClient";
import { joinPath } from "./internal";

export interface CreateComponentInput {
  key?: string | null;
  name?: string | null;
  description?: string | null;
  attributes?: IField[] | null;
}

export interface UpdateComponentInput {
  id: string;
  name?: string | null;
  description?: string | null;
  attributes?: IField[] | null;
}

export interface ComponentsApi {
  list(options?: AtlasRequestOptions): Promise<Component[]>;

  getById(id: string, options?: AtlasRequestOptions): Promise<Component>;

  create(payload: CreateComponentInput, options?: AtlasRequestOptions): Promise<{ id: string }>;

  update(payload: UpdateComponentInput, options?: AtlasRequestOptions): Promise<{ id: string }>;

  remove(id: string, options?: AtlasRequestOptions): Promise<void>;
}

export function createComponentsApi(http: AtlasHttpClient, restBaseUrl: string): ComponentsApi {
  return {
    async list(options) {
      const url = joinPath(restBaseUrl, "/content-types/components");
      return http.request<Component[]>({
        url,
        method: "GET",
        ...options
      });
    },

    async getById(id, options) {
      const url = joinPath(restBaseUrl, `/content-types/components/${encode(id)}`);
      return http.request<Component>({
        url,
        method: "GET",
        ...options
      });
    },

    async create(payload, options) {
      const url = joinPath(restBaseUrl, "/content-types/components");
      const result = await http.request<KeyResult<string>>({
        url,
        method: "POST",
        body: payload,
        ...options
      });
      return { id: String(result?.result ?? "") };
    },

    async update(payload, options) {
      const url = joinPath(restBaseUrl, `/content-types/components/${encode(payload.id)}`);
      const result = await http.request<KeyResult<string>>({
        url,
        method: "PUT",
        body: payload,
        ...options
      });
      return { id: String(result?.result ?? "") };
    },

    async remove(id, options) {
      const url = joinPath(restBaseUrl, `/content-types/components/${encode(id)}`);
      await http.request<void>({
        url,
        method: "DELETE",
        ...options
      });
    }
  };
}

function encode(value: string): string {
  return encodeURIComponent(value);
}
