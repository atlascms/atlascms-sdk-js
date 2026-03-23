import type { AtlasRequestOptions } from "../types/http";
import type { KeyResult, User, PagedResult } from "../types/entities";
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

export function createUsersApi(http: AtlasHttpClient, restBaseUrl: string): UsersApi {
  return {
    async list<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
      query?: QueryInput,
      options?: AtlasRequestOptions
    ) {
      const url = appendQuery(joinPath(restBaseUrl, "/users"), query);
      return http.request<PagedResult<User<TAttributes>>>({
        url,
        method: "GET",
        ...options
      });
    },

    async count(query, options) {
      const url = appendQuery(joinPath(restBaseUrl, "/users/count"), query);
      const result = await http.request<KeyResult<number>>({
        url,
        method: "GET",
        ...options
      });
      return result?.result ?? 0;
    },

    async getById<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
      id: string,
      options?: AtlasRequestOptions
    ) {
      const url = joinPath(restBaseUrl, `/users/${encode(id)}`);
      return http.request<User<TAttributes>>({
        url,
        method: "GET",
        ...options
      });
    },

    async create(payload, options) {
      const url = joinPath(restBaseUrl, "/users/register");
      const result = await http.request<KeyResult<string>>({
        url,
        method: "POST",
        body: payload,
        ...options
      });
      return { id: String(result?.result ?? "") };
    },

    async update(id, payload, options) {
      const url = joinPath(restBaseUrl, `/users/${encode(id)}`);
      const body = { id, ...payload };
      await http.request<void>({
        url,
        method: "PUT",
        body,
        ...options
      });
    },

    async remove(id, options) {
      const url = joinPath(restBaseUrl, `/users/${encode(id)}`);
      await http.request<void>({
        url,
        method: "DELETE",
        ...options
      });
    },

    async changeStatus(id, isActive, options) {
      const url = joinPath(restBaseUrl, `/users/${encode(id)}/status`);
      await http.request<void>({
        url,
        method: "POST",
        body: { id, isActive },
        ...options
      });
    },

    async changePassword(id, password, options) {
      const url = joinPath(restBaseUrl, `/users/${encode(id)}/change-password`);
      await http.request<void>({
        url,
        method: "POST",
        body: { id, password },
        ...options
      });
    }
  };
}

function encode(value: string): string {
  return encodeURIComponent(value);
}
