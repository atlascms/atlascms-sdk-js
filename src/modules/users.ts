import type { AtlasRequestOptions } from "../types/http";
import type { User } from "../types/entities";
import type { AtlasHttpClient } from "../http/httpClient";
import { appendQuery, joinPath, type QueryInput } from "./internal";

export interface UsersApi {
  list<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
    query?: QueryInput,
    options?: AtlasRequestOptions
  ): Promise<Array<User<TAttributes>>>;
}

export function createUsersApi(http: AtlasHttpClient, restBaseUrl: string, project: string): UsersApi {
  const encodedProject = encode(project);

  return {
    async list<TAttributes extends Record<string, unknown> = Record<string, unknown>>(
      query?: QueryInput,
      options?: AtlasRequestOptions
    ) {
      const path = `/${encodedProject}/admin/memberships`;
      const url = appendQuery(joinPath(restBaseUrl, path), query);
      return http.request<Array<User<TAttributes>>>({
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
