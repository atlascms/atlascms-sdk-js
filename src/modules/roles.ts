import type { AtlasRequestOptions } from "../types/http";
import type { Role, PermissionGroup } from "../types/entities";
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

export function createRolesApi(http: AtlasHttpClient, restBaseUrl: string, project: string): RolesApi {
  const encodedProject = encode(project);

  return {
    async list(options) {
      const path = `/${encodedProject}/users/roles`;
      const url = joinPath(restBaseUrl, path);
      return http.request<Role[]>({
        url,
        method: "GET",
        ...options
      });
    },

    async create(payload, options) {
      const path = `/${encodedProject}/users/roles`;
      const url = joinPath(restBaseUrl, path);
      const result = await http.request<{ value?: string; key?: string }>({
        url,
        method: "POST",
        body: payload,
        ...options
      });
      return { id: String(result?.value ?? result?.key ?? "") };
    },

    async update(id, payload, options) {
      const path = `/${encodedProject}/users/roles/${encode(id)}`;
      const url = joinPath(restBaseUrl, path);
      await http.request<void>({
        url,
        method: "PUT",
        body: payload,
        ...options
      });
    },

    async remove(id, options) {
      const path = `/${encodedProject}/users/roles/${encode(id)}`;
      const url = joinPath(restBaseUrl, path);
      await http.request<void>({
        url,
        method: "DELETE",
        ...options
      });
    },

    async getPermissions(options) {
      const path = `/${encodedProject}/users/roles/permissions`;
      const url = joinPath(restBaseUrl, path);
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
