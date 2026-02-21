import type { AtlasRequestOptions } from "../types/http";
import type { AtlasHttpClient } from "../http/httpClient";
import { joinPath } from "./internal";

export interface GraphqlRequest<TVariables = Record<string, unknown>> {
  query: string;
  variables?: TVariables;
  operationName?: string;
}

export interface GraphqlError {
  message: string;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
}

export interface GraphqlResponse<TData> {
  data?: TData;
  errors?: GraphqlError[];
}

export interface GraphqlApi {
  execute<TData, TVariables = Record<string, unknown>>(
    request: GraphqlRequest<TVariables>,
    options?: AtlasRequestOptions
  ): Promise<GraphqlResponse<TData>>;
}

export function createGraphqlApi(http: AtlasHttpClient, graphqlBaseUrl: string): GraphqlApi {
  return {
    async execute(request, options) {
      const url = isAbsoluteUrl(graphqlBaseUrl) ? graphqlBaseUrl : joinPath(graphqlBaseUrl, "/");
      return http.request<GraphqlResponse<unknown>>({
        url,
        method: "POST",
        body: request,
        ...options
      }) as Promise<GraphqlResponse<any>>;
    }
  };
}

function isAbsoluteUrl(value: string): boolean {
  return value.startsWith("http://") || value.startsWith("https://");
}
