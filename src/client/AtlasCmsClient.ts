import { AtlasHttpClient } from "../http/httpClient";
import { createContentsApi, type ContentsApi } from "../modules/contents";
import { createGraphqlApi, type GraphqlApi } from "../modules/graphql";
import { createMediaApi, type MediaApi } from "../modules/media";
import { createUsersApi, type UsersApi } from "../modules/users";
import { createRolesApi, type RolesApi } from "../modules/roles";
import { createModelsApi, type ModelsApi } from "../modules/models";
import { createComponentsApi, type ComponentsApi } from "../modules/components";
import type { AtlasClientConfig } from "../types/http";

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

  const http = new AtlasHttpClient(config);

  return {
    contents: createContentsApi(http, config.restBaseUrl, config.project),
    media: createMediaApi(http, config.restBaseUrl, config.project),
    users: createUsersApi(http, config.restBaseUrl, config.project),
    roles: createRolesApi(http, config.restBaseUrl, config.project),
    models: createModelsApi(http, config.restBaseUrl, config.project),
    components: createComponentsApi(http, config.restBaseUrl, config.project),
    graphql: createGraphqlApi(http, config.graphqlBaseUrl)
  };
}

function validateConfig(config: AtlasClientConfig): void {
  if (!config.project) {
    throw new Error("project is required");
  }
  if (!config.restBaseUrl) {
    throw new Error("restBaseUrl is required");
  }
  if (!config.graphqlBaseUrl) {
    throw new Error("graphqlBaseUrl is required");
  }
  if (!config.apiKey) {
    throw new Error("apiKey is required");
  }
}
