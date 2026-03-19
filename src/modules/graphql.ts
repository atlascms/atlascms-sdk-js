import type { AtlasRequestOptions } from "../types/http";
import type { AtlasHttpClient } from "../http/httpClient";

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

export function createGraphqlApi(http: AtlasHttpClient, graphqlUrl: string): GraphqlApi {
  return {
    async execute(request, options) {
      return http.request<GraphqlResponse<unknown>>({
        url: graphqlUrl,
        method: "POST",
        body: request,
        ...options
      }) as Promise<GraphqlResponse<any>>;
    }
  };
}
