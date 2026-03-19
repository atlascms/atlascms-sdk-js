import { AtlasHttpClient } from "../http/httpClient";
import { createContentsApi, type ContentsApi } from "../modules/contents";
import { createGraphqlApi, type GraphqlApi } from "../modules/graphql";
import { createMediaApi, type MediaApi } from "../modules/media";
import { createUsersApi, type UsersApi } from "../modules/users";
import { createRolesApi, type RolesApi } from "../modules/roles";
import { createModelsApi, type ModelsApi } from "../modules/models";
import { createComponentsApi, type ComponentsApi } from "../modules/components";
import type { AtlasClientConfig } from "../types/http";

const DEFAULT_BASE_URL = "https://api.atlascms.io";

export interface AtlasCmsClient {
  contents: ContentsApi;
  media: MediaApi;
  users: UsersApi;
  roles: RolesApi;
  models: ModelsApi;
  components: ComponentsApi;
  graphql: GraphqlApi;
}

export function createAtlasCmsClient(config: AtlasClientConfig): AtlasCmsClient {
  validateConfig(config);

  const base = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
  const restBaseUrl = `${base}/${encodeURIComponent(config.projectId)}`;
  const graphqlUrl = `${restBaseUrl}/graphql`;

  const http = new AtlasHttpClient(config);

  return {
    contents: createContentsApi(http, restBaseUrl),
    media: createMediaApi(http, restBaseUrl),
    users: createUsersApi(http, restBaseUrl),
    roles: createRolesApi(http, restBaseUrl),
    models: createModelsApi(http, restBaseUrl),
    components: createComponentsApi(http, restBaseUrl),
    graphql: createGraphqlApi(http, graphqlUrl)
  };
}

function validateConfig(config: AtlasClientConfig): void {
  if (!config.projectId) {
    throw new Error("projectId is required");
  }
  if (!config.apiKey) {
    throw new Error("apiKey is required");
  }
}
