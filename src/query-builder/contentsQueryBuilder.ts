import { BaseQueryBuilder } from "./baseQueryBuilder";
import { CONTENT_FILTERS, CONTENT_SORT_FIELDS } from "../types/filters";
import type { QueryStatus } from "../types/http";

export type ContentFilterField = keyof typeof CONTENT_FILTERS;
export type ContentSortField = (typeof CONTENT_SORT_FIELDS)[number];

export class ContentsQueryBuilder extends BaseQueryBuilder<ContentSortField> {
  public constructor() {
    super();
  }

  public status(value: QueryStatus): this {
    return this.extra("status", value);
  }

  public locale(value: string): this {
    return this.extra("locale", value);
  }

  public resolve(value: "media" | "mediagallery" | "relations" | Array<"media" | "mediagallery" | "relations">): this {
    const serialized = Array.isArray(value) ? value.join(",") : value;
    return this.extra("resolve", serialized);
  }
}

export function contentsQuery(): ContentsQueryBuilder {
  return new ContentsQueryBuilder();
}
