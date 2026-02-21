import type { AtlasRequestOptions } from "../types/http";
import type { Media, PagedResult } from "../types/entities";
import type { AtlasHttpClient } from "../http/httpClient";
import { appendQuery, joinPath, type QueryInput } from "./internal";

export interface MediaApi {
  list(query?: QueryInput, options?: AtlasRequestOptions): Promise<PagedResult<Media>>;
  getById(id: string, options?: AtlasRequestOptions): Promise<Media>;
  remove(id: string, options?: AtlasRequestOptions): Promise<void>;
  setTags(id: string, tags: string[], options?: AtlasRequestOptions): Promise<void>;
}

export function createMediaApi(http: AtlasHttpClient, restBaseUrl: string, project: string): MediaApi {
  const encodedProject = encode(project);

  return {
    async list(query, options) {
      const path = `/${encodedProject}/media-library/media`;
      const url = appendQuery(joinPath(restBaseUrl, path), query);
      return http.request<PagedResult<Media>>({
        url,
        method: "GET",
        ...options
      });
    },

    async getById(id, options) {
      const path = `/${encodedProject}/media-library/media/${encode(id)}`;
      const url = joinPath(restBaseUrl, path);
      return http.request<Media>({
        url,
        method: "GET",
        ...options
      });
    },

    async remove(id, options) {
      const path = `/${encodedProject}/media-library/media/${encode(id)}`;
      const url = joinPath(restBaseUrl, path);
      await http.request<void>({
        url,
        method: "DELETE",
        ...options
      });
    },

    async setTags(id, tags, options) {
      const path = `/${encodedProject}/media-library/media/${encode(id)}/tags`;
      const url = joinPath(restBaseUrl, path);
      await http.request<void>({
        url,
        method: "POST",
        body: { tags },
        ...options
      });
    }
  };
}

function encode(value: string): string {
  return encodeURIComponent(value);
}
