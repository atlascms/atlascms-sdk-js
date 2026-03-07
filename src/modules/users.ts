import type { AtlasRequestOptions } from "../types/http";
import type { User, PagedResult } from "../types/entities";
import type { AtlasHttpClient } from "../http/httpClient";
import { appendQuery, joinPath, type QueryInput } from "./internal";

export interface CreateUserInput<TAttributes extends Record<string, unknown> = Record<string, unknown>> {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  mobilePhone?: string;
  roles?: string[];
  password?: string;
  isActive?: boolean;
  attributes?: TAttributes;
}

export interface UpdateUserInput<TAttributes extends Record<string, unknown> = Record<string, unknown>> {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  mobilePhone?: string;
  roles?: string[];
  notes?: string;
  attributes?: TAttributes;
}

export interface UsersApi {
  list<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
    query?: QueryInput,
    options?: AtlasRequestOptions
  ): Promise<PagedResult<User<TAttributes>>>;

  count(query?: QueryInput, options?: AtlasRequestOptions): Promise<number>;

  getById<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
    id: string,
    options?: AtlasRequestOptions
  ): Promise<User<TAttributes>>;

  create<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
    payload: CreateUserInput<TAttributes>,
    options?: AtlasRequestOptions
  ): Promise<{ id: string }>;

  update<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
    id: string,
    payload: UpdateUserInput<TAttributes>,
    options?: AtlasRequestOptions
  ): Promise<void>;

  remove(id: string, options?: AtlasRequestOptions): Promise<void>;

  changeStatus(id: string, isActive: boolean, options?: AtlasRequestOptions): Promise<void>;

  changePassword(id: string, password: string, options?: AtlasRequestOptions): Promise<void>;
}

export function createUsersApi(http: AtlasHttpClient, restBaseUrl: string, project: string): UsersApi {
  const encodedProject = encode(project);

  return {
    async list<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
      query?: QueryInput,
      options?: AtlasRequestOptions
    ) {
      const path = `/${encodedProject}/users`;
      const url = appendQuery(joinPath(restBaseUrl, path), query);
      return http.request<PagedResult<User<TAttributes>>>({
        url,
        method: "GET",
        ...options
      });
    },

    async count(query, options) {
      const path = `/${encodedProject}/users/count`;
      const url = appendQuery(joinPath(restBaseUrl, path), query);
      const result = await http.request<{ value?: number; key?: number }>({
        url,
        method: "GET",
        ...options
      });
      return typeof result?.value === "number" ? result.value : Number(result?.key ?? 0);
    },

    async getById<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
      id: string,
      options?: AtlasRequestOptions
    ) {
      const path = `/${encodedProject}/users/${encode(id)}`;
      const url = joinPath(restBaseUrl, path);
      return http.request<User<TAttributes>>({
        url,
        method: "GET",
        ...options
      });
    },

    async create(payload, options) {
      const path = `/${encodedProject}/users/register`;
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
      const path = `/${encodedProject}/users/${encode(id)}`;
      const url = joinPath(restBaseUrl, path);
      await http.request<void>({
        url,
        method: "PUT",
        body: payload,
        ...options
      });
    },

    async remove(id, options) {
      const path = `/${encodedProject}/users/${encode(id)}`;
      const url = joinPath(restBaseUrl, path);
      await http.request<void>({
        url,
        method: "DELETE",
        ...options
      });
    },

    async changeStatus(id, isActive, options) {
      const path = `/${encodedProject}/users/${encode(id)}/status`;
      const url = joinPath(restBaseUrl, path);
      await http.request<void>({
        url,
        method: "POST",
        body: { isActive },
        ...options
      });
    },

    async changePassword(id, password, options) {
      const path = `/${encodedProject}/users/${encode(id)}/change-password`;
      const url = joinPath(restBaseUrl, path);
      await http.request<void>({
        url,
        method: "POST",
        body: { password },
        ...options
      });
    }
  };
}

function encode(value: string): string {
  return encodeURIComponent(value);
}
