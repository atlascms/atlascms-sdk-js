# Atlas CMS TypeScript SDK

Simple TypeScript SDK for Atlas CMS that works in browsers and server-side runtimes (Node/BFF).

## Features

- REST modules for `Contents`, `Media Library`, `Users`, `Roles`, `Models`, and `Components`
- GraphQL client helper
- Centralized HTTP client with consistent error handling
- Fluent query builders for query string DSL:
  - `filter[{path}][{operator}]={value}`
- Request-level API key override
- Fully typed APIs and test suite with Vitest

## Install

```bash
npm install atlascms-sdk-js
```

## Quick Start

```ts
import { createAtlasCmsClient, contentsQuery } from "atlascms-sdk-js";

const client = createAtlasCmsClient({
  projectId: "my-project-id",
  apiKey: "YOUR_BEARER_TOKEN"
});

const query = contentsQuery()
  .page(1)
  .size(20)
  .status("published")
  .locale("en-US")
  .filter("createdAt", "gte", "2026-01-01T00:00:00.000Z")
  .sort("createdAt", "desc")
  .build();

const result = await client.contents.list("pages", query);
```

The SDK uses `https://api.atlascms.io` as the default base URL. Derived endpoints:

| Type    | URL                                              |
|---------|--------------------------------------------------|
| REST    | `https://api.atlascms.io/{projectId}`            |
| GraphQL | `https://api.atlascms.io/{projectId}/graphql`    |

## API Overview

### `createAtlasCmsClient(config)`

```ts
type AtlasClientConfig = {
  projectId: string;
  apiKey: string;
  /** Defaults to "https://api.atlascms.io" */
  baseUrl?: string;
  fetchFn?: typeof fetch;
  defaultHeaders?: HeadersInit;
};
```

### Modules

#### `client.contents`

| Method | Description |
|---|---|
| `list(type, query?, options?)` | List contents of a given type |
| `getById(type, id, query?, options?)` | Get a single content by ID |
| `getSingle(type, query?, options?)` | Get a singleton content |
| `count(type, query?, options?)` | Count contents |
| `create(type, payload, options?)` | Create a new content |
| `update(type, id, payload, options?)` | Update an existing content |
| `remove(type, id, options?)` | Delete a content |
| `changeStatus(type, id, status, options?)` | Publish or unpublish a content |
| `createTranslation(type, id, locale?, options?)` | Create a translation copy |
| `duplicate(type, id, locales?, options?)` | Duplicate a content |
| `updateSeo(type, id, payload, options?)` | Update SEO metadata |

#### `client.media`

| Method | Description |
|---|---|
| `list(query?, options?)` | List media items |
| `getById(id, options?)` | Get a media item by ID |
| `upload(input, options?)` | Upload a file |
| `setTags(id, tags, options?)` | Set tags on a media item |
| `remove(id, options?)` | Delete a media item |

#### `client.users`

| Method | Description |
|---|---|
| `list(query?, options?)` | List users |
| `count(query?, options?)` | Count users |
| `getById(id, options?)` | Get a user by ID |
| `create(payload, options?)` | Register a new user |
| `update(id, payload, options?)` | Update a user |
| `remove(id, options?)` | Delete a user |
| `changeStatus(id, isActive, options?)` | Activate or deactivate a user |
| `changePassword(id, password, options?)` | Change a user's password |

#### `client.roles`

| Method | Description |
|---|---|
| `list(options?)` | List roles |
| `create(payload, options?)` | Create a role |
| `update(id, payload, options?)` | Update a role |
| `remove(id, options?)` | Delete a role |
| `getPermissions(options?)` | Get all available permissions |

#### `client.models`

| Method | Description |
|---|---|
| `list(query?, options?)` | List content models |
| `getById(id, options?)` | Get a model by ID |
| `create(payload, options?)` | Create a model |
| `update(payload, options?)` | Update a model |
| `remove(id, options?)` | Delete a model |
| `publish(id, options?)` | Publish a model |
| `unpublish(id, options?)` | Unpublish a model |

#### `client.components`

| Method | Description |
|---|---|
| `list(query?, options?)` | List components |
| `getById(id, options?)` | Get a component by ID |
| `create(payload, options?)` | Create a component |
| `update(payload, options?)` | Update a component |
| `remove(id, options?)` | Delete a component |

#### `client.graphql`

| Method | Description |
|---|---|
| `execute({ query, variables?, operationName? }, options?)` | Execute a GraphQL operation |

```ts
const response = await client.graphql.execute<{ pages: Page[] }>({
  query: `query GetPages { pages { id title } }`
});
```

### Query Builders

- `contentsQuery()`
- `mediaQuery()`
- `usersQuery()`

All builders support:

| Method | Description |
|---|---|
| `page(number)` | Set the page number |
| `size(number)` | Set the page size |
| `search(string)` | Full-text search |
| `filter(field, operator, value)` | Add a typed filter |
| `filterRaw(path, operator, value)` | Add a raw path filter |
| `sort(field, "asc" \| "desc")` | Set sort order |
| `build()` | Produce a `{ queryString, searchParams }` result |

Additional methods:

- `contentsQuery().status("published" | "unpublished" | "all").locale("en-US").resolve("media", "relations")`
- `mediaQuery().folder("images").searchSubdirectory(true)`
- `usersQuery().email("...").firstName("...").isActive(true).roles([...])`

### Per-request API key override

```ts
await client.media.list(undefined, {
  apiKey: "ANOTHER_BEARER_TOKEN"
});
```

### Error handling

```ts
import { AtlasHttpError, AtlasNetworkError, AtlasTimeoutError } from "atlascms-sdk-js";

try {
  await client.contents.list("pages");
} catch (error) {
  if (error instanceof AtlasHttpError) {
    console.log(error.status, error.code, error.message);
  } else if (error instanceof AtlasTimeoutError) {
    console.log("Request timed out");
  } else if (error instanceof AtlasNetworkError) {
    console.log("Network error");
  }
}
```

### Custom base URL

Useful for local development or self-hosted instances:

```ts
const client = createAtlasCmsClient({
  projectId: "my-project-id",
  apiKey: "YOUR_BEARER_TOKEN",
  baseUrl: "https://my-custom-instance.example.com"
});
```

### Custom fetch

Useful for server-side environments or testing:

```ts
const client = createAtlasCmsClient({
  projectId: "my-project-id",
  apiKey: "YOUR_BEARER_TOKEN",
  fetchFn: myCustomFetch
});
```

## Development

```bash
npm test
npm run build
```
