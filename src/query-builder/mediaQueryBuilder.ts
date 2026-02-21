import { BaseQueryBuilder } from "./baseQueryBuilder";
import { MEDIA_FILTERS, MEDIA_SORT_FIELDS } from "../types/filters";

export type MediaFilterField = keyof typeof MEDIA_FILTERS;
export type MediaSortField = (typeof MEDIA_SORT_FIELDS)[number];

export class MediaQueryBuilder extends BaseQueryBuilder<MediaSortField> {
  public constructor() {
    super();
  }

  public folder(value: string): this {
    return this.extra("folder", value);
  }

  public searchSubdirectory(value: boolean): this {
    return this.extra("searchSubdirectory", value);
  }
}

export function mediaQuery(): MediaQueryBuilder {
  return new MediaQueryBuilder();
}
