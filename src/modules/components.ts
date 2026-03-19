import type { AtlasRequestOptions } from "../types/http";
import type { Component, IField } from "../types/models";
import type { PagedResult } from "../types/entities";
import type { AtlasHttpClient } from "../http/httpClient";
import { appendQuery, joinPath, type QueryInput } from "./internal";

export interface CreateComponentInput {
  key: string;
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
  list(query?: QueryInput, options?: AtlasRequestOptions): Promise<PagedResult<Component>>;

  getById(id: string, options?: AtlasRequestOptions): Promise<Component>;

  create(payload: CreateComponentInput, options?: AtlasRequestOptions): Promise<{ id: string }>;

  update(payload: UpdateComponentInput, options?: AtlasRequestOptions): Promise<void>;

  remove(id: string, options?: AtlasRequestOptions): Promise<void>;
}

export function createComponentsApi(http: AtlasHttpClient, restBaseUrl: string, project: string): ComponentsApi {
  const encodedProject = encode(project);

  return {
    async list(query?, options) {
      const path = `/${encodedProject}/components`;
      const url = appendQuery(joinPath(restBaseUrl, path), query);
      return http.request<PagedResult<Component>>({
        url,
        method: "GET",
        ...options
      });
    },

    async getById(id, options) {
      const path = `/${encodedProject}/components/${encode(id)}`;
      const url = joinPath(restBaseUrl, path);
      return http.request<Component>({
        url,
        method: "GET",
        ...options
      });
    },

    async create(payload, options) {
      const path = `/${encodedProject}/components`;
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
      const path = `/${encodedProject}/components/${encode(payload.id)}`;
      const url = joinPath(restBaseUrl, path);
      await http.request<void>({
        url,
        method: "PUT",
        body: payload,
        ...options
      });
    },

    async remove(id, options) {
      const path = `/${encodedProject}/components/${encode(id)}`;
      const url = joinPath(restBaseUrl, path);
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
