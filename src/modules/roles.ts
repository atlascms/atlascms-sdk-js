import type { AtlasRequestOptions } from "../types/http";
import type { Role, PermissionGroup } from "../types/entities";
import type { KeyResult } from "../types/entities";
import type { AtlasHttpClient } from "../http/httpClient";
import { joinPath } from "./internal";

export interface CreateRoleInput {
  name: string;
  permissions?: string[];
}

export interface UpdateRoleInput {
  name: string;
  permissions?: string[];
}

export interface RolesApi {
  list(options?: AtlasRequestOptions): Promise<Role[]>;
  create(payload: CreateRoleInput, options?: AtlasRequestOptions): Promise<{ id: string }>;
  update(id: string, payload: UpdateRoleInput, options?: AtlasRequestOptions): Promise<void>;
  remove(id: string, options?: AtlasRequestOptions): Promise<void>;
  getPermissions(options?: AtlasRequestOptions): Promise<PermissionGroup[]>;
}

export function createRolesApi(http: AtlasHttpClient, restBaseUrl: string): RolesApi {
  return {
    async list(options) {
      const url = joinPath(restBaseUrl, "/users/roles");
      return http.request<Role[]>({
        url,
        method: "GET",
        ...options
      });
    },

    async create(payload, options) {
      const url = joinPath(restBaseUrl, "/users/roles");
      const result = await http.request<KeyResult<string>>({
        url,
        method: "POST",
        body: payload,
        ...options
      });
      return { id: String(result?.result ?? "") };
    },

    async update(id, payload, options) {
      const url = joinPath(restBaseUrl, `/users/roles/${encode(id)}`);
      const body = { id, ...payload };
      await http.request<void>({
        url,
        method: "PUT",
        body,
        ...options
      });
    },

    async remove(id, options) {
      const url = joinPath(restBaseUrl, `/users/roles/${encode(id)}`);
      await http.request<void>({
        url,
        method: "DELETE",
        ...options
      });
    },

    async getPermissions(options) {
      const url = joinPath(restBaseUrl, "/users/roles/permissions");
      return http.request<PermissionGroup[]>({
        url,
        method: "GET",
        ...options
      });
    }
  };
}

function encode(value: string): string {
  return encodeURIComponent(value);
}
