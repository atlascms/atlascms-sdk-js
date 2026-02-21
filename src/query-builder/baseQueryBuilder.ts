import type { FilterEntry, FilterOperator, FilterValue, QueryBuilderResult, SortDirection, SortEntry } from "../types/http";

interface BaseQueryBuilderState<TSortField extends string> {
  page?: number;
  size?: number;
  search?: string;
  filters: FilterEntry[];
  sorts: SortEntry<TSortField>[];
  extras: Record<string, string | number | boolean>;
}

export abstract class BaseQueryBuilder<TSortField extends string> {
  protected readonly state: BaseQueryBuilderState<TSortField>;

  protected constructor() {
    this.state = {
      filters: [],
      sorts: [],
      extras: {}
    };
  }

  public page(value: number): this {
    this.state.page = value;
    return this;
  }

  public size(value: number): this {
    this.state.size = value;
    return this;
  }

  public search(value: string): this {
    this.state.search = value;
    return this;
  }

  public filter(field: string, operator: FilterOperator | string, value: FilterValue): this {
    this.state.filters.push({
      path: field,
      operator,
      value
    });
    return this;
  }

  public filterRaw(path: string, operator: FilterOperator | string, value: FilterValue): this {
    this.state.filters.push({ path, operator, value });
    return this;
  }

  public sort(field: TSortField, direction: SortDirection = "asc"): this {
    this.state.sorts.push({ field, direction });
    return this;
  }

  public extra(key: string, value: string | number | boolean): this {
    this.state.extras[key] = value;
    return this;
  }

  public build(): QueryBuilderResult {
    const params = new URLSearchParams();

    if (typeof this.state.page === "number") {
      params.set("page", String(this.state.page));
    }
    if (typeof this.state.size === "number") {
      params.set("size", String(this.state.size));
    }
    if (this.state.search) {
      params.set("search", this.state.search);
    }

    for (const filter of this.state.filters) {
      const key = `filter[${filter.path}][${filter.operator}]`;
      if (Array.isArray(filter.value)) {
        for (const item of filter.value) {
          params.append(key, normalizeValue(item));
        }
      } else {
        params.append(key, normalizeValue(filter.value));
      }
    }

    if (this.state.sorts.length > 0) {
      params.set(
        "sort",
        this.state.sorts.map((entry) => `${entry.field}:${entry.direction}`).join(",")
      );
    }

    for (const [key, value] of Object.entries(this.state.extras)) {
      params.set(key, String(value));
    }

    return {
      queryString: params.toString(),
      searchParams: params
    };
  }
}

function normalizeValue(value: string | number | boolean | Date): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
}
