# Atlas CMS TypeScript SDK

Simple TypeScript SDK for Atlas CMS that works in browsers and server-side runtimes (Node/BFF).

## Features

- REST modules for `Contents`, `Media Library` (folders excluded), and `Users`
- GraphQL client helper
- Centralized HTTP client with consistent error handling
- Fluent query builders for query string DSL:
  - `filter[{path}][{operator}]={value}`
- Request-level API key override
- Fully typed APIs and test suite with Vitest

## Install

```bash
npm install @atlas/atlascms-sdk-js
```

## Quick Start

```ts
import { createAtlasCmsClient, contentsQuery } from "@atlas/atlascms-sdk-js";

const client = createAtlasCmsClient({
  project: "my-project",
  restBaseUrl: "https://api.atlas-cms.com",
  graphqlBaseUrl: "https://api.atlas-cms.com/graphql",
  apiKey: "YOUR_DEFAULT_BEARER_TOKEN"
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

## API Overview

### `createAtlasCmsClient(config)`

```ts
type AtlasClientConfig = {
  project: string;
  restBaseUrl: string;
  graphqlBaseUrl: string;
  apiKey: string;
  fetchFn?: typeof fetch;
  defaultHeaders?: HeadersInit;
};
```

### Modules

- `client.contents`
  - `list(type, query?, options?)`
  - `getById(type, id, query?, options?)`
  - `getSingle(type, query?, options?)`
  - `count(type, query?, options?)`
  - `create(type, payload, options?)`
  - `update(type, id, payload, options?)`
  - `remove(type, id, options?)`

- `client.media`
  - `list(query?, options?)`
  - `getById(id, options?)`
  - `setTags(id, tags, options?)`
  - `remove(id, options?)`

- `client.users`
  - `list(query?, options?)`

- `client.graphql`
  - `execute({ query, variables?, operationName? }, options?)`

### Query Builders

- `contentsQuery()`
- `mediaQuery()`
- `usersQuery()`

All builders support:

- `page(number)`
- `size(number)`
- `search(string)`
- `filter(field, operator, value)`
- `filterRaw(path, operator, value)`
- `sort(field, "asc" | "desc")`
- `build()`

Additional methods:

- `contentsQuery().status(...).locale(...).resolve(...)`
- `mediaQuery().folder(...).searchSubdirectory(...)`

### Per-request API key override

```ts
await client.media.list(undefined, {
  apiKey: "ANOTHER_BEARER_TOKEN"
});
```

### Error handling

```ts
import { AtlasHttpError } from "@atlas/atlascms-sdk-js";

try {
  await client.contents.list("pages");
} catch (error) {
  if (error instanceof AtlasHttpError) {
    console.log(error.status, error.code, error.message);
  }
}
```

## Development

```bash
npm test
npm run build
```