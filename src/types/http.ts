export type QueryStatus = "all" | "published" | "unpublished";

export type FilterOperator =
  | "eq"
  | "neq"
  | "contains"
  | "ncontains"
  | "starts"
  | "nstarts"
  | "ends"
  | "nends"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "any"
  | "nany"
  | "all"
  | "near"
  | "within";

export type FilterValuePrimitive = string | number | boolean | Date;
export type FilterValue = FilterValuePrimitive | FilterValuePrimitive[];

export interface FilterEntry {
  path: string;
  operator: FilterOperator | string;
  value: FilterValue;
}

export type SortDirection = "asc" | "desc";

export interface SortEntry<TField extends string = string> {
  field: TField;
  direction: SortDirection;
}

export interface QueryBuilderResult {
  queryString: string;
  searchParams: URLSearchParams;
}

export interface AtlasRequestOptions {
  apiKey?: string;
  headers?: HeadersInit;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export interface AtlasClientConfig {
  projectId: string;
  apiKey: string;
  /** Defaults to "https://api.atlascms.io" */
  baseUrl?: string;
  fetchFn?: typeof fetch;
  defaultHeaders?: HeadersInit;
}
