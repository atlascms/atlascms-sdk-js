import type { AtlasRequestOptions } from "../types/http";
import type { Component, IField } from "../types/models";
import type { KeyResult } from "../types/entities";
import type { AtlasHttpClient } from "../http/httpClient";
import { joinPath } from "./internal";

export interface CreateModelInput {
  key?: string | null;
  name?: string | null;
  description?: string | null;
  isSingle?: boolean;
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
  list(system?: boolean, options?: AtlasRequestOptions): Promise<Component[]>;

  getById(id: string, options?: AtlasRequestOptions): Promise<Component>;

  create(payload: CreateModelInput, options?: AtlasRequestOptions): Promise<{ id: string }>;

  update(payload: UpdateModelInput, options?: AtlasRequestOptions): Promise<{ id: string }>;

  remove(id: string, options?: AtlasRequestOptions): Promise<void>;
}

export function createModelsApi(http: AtlasHttpClient, restBaseUrl: string): ModelsApi {
  return {
    async list(system, options) {
      const url = system === undefined ? joinPath(restBaseUrl, "/content-types/models")
        : joinPath(restBaseUrl, `/content-types/models?system=${system ? "true" : "false"}`);
      return http.request<Component[]>({
        url,
        method: "GET",
        ...options
      });
    },

    async getById(id, options) {
      const url = joinPath(restBaseUrl, `/content-types/models/${encode(id)}`);
      return http.request<Component>({
        url,
        method: "GET",
        ...options
      });
    },

    async create(payload, options) {
      const url = joinPath(restBaseUrl, "/content-types/models");
      const result = await http.request<KeyResult<string>>({
        url,
        method: "POST",
        body: payload,
        ...options
      });
      return { id: String(result?.result ?? "") };
    },

    async update(payload, options) {
      const url = joinPath(restBaseUrl, `/content-types/models/${encode(payload.id)}`);
      const result = await http.request<KeyResult<string>>({
        url,
        method: "PUT",
        body: payload,
        ...options
      });
      return { id: String(result?.result ?? "") };
    },

    async remove(id, options) {
      const url = joinPath(restBaseUrl, `/content-types/models/${encode(id)}`);
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
