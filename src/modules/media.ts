import type { AtlasRequestOptions } from "../types/http";
import type { Media, PagedResult } from "../types/entities";
import type { AtlasHttpClient } from "../http/httpClient";
import { appendQuery, joinPath, type QueryInput } from "./internal";

export interface MediaUploadInput {
  file: Blob | File;
  folder?: string;
  fileName?: string;
  /** If supplied, replaces the existing media with this ID (folder is ignored). */
  id?: string;
}

export interface MediaApi {
  list(query?: QueryInput, options?: AtlasRequestOptions): Promise<PagedResult<Media>>;
  getById(id: string, options?: AtlasRequestOptions): Promise<Media>;
  remove(id: string, options?: AtlasRequestOptions): Promise<void>;
  setTags(id: string, tags: string[], options?: AtlasRequestOptions): Promise<void>;
  upload(input: MediaUploadInput, options?: AtlasRequestOptions): Promise<Media>;
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
    },

    async upload(input, options) {
      const path = `/${encodedProject}/media-library/media/upload`;
      const url = joinPath(restBaseUrl, path);
      const form = new FormData();
      const fileName = input.fileName ?? (input.file instanceof File ? input.file.name : undefined);
      form.append("file", input.file, fileName);
      if (input.folder !== undefined) form.append("folder", input.folder);
      if (fileName !== undefined) form.append("fileName", fileName);
      if (input.id !== undefined) form.append("id", input.id);
      return http.request<Media>({
        url,
        method: "POST",
        body: form,
        ...options
      });
    }
  };
}

function encode(value: string): string {
  return encodeURIComponent(value);
}
