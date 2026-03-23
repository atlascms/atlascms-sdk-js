import type { ContentSeo } from "./seo";

export type ContentStatus = "published" | "unpublished";

export interface Content<TAttributes extends Record<string, unknown> = Record<string, unknown>> {
  id?: string | null;
  modelKey?: string | null;
  locale?: string | null;
  createdAt: string;
  createdBy?: string | null;
  modifiedAt: string;
  modifiedBy?: string | null;
  hash?: string | null;
  status?: ContentStatus | null;
  attributes?: TAttributes;
  seo?: ContentSeo | null;
  locales?: Array<{ locale: string | null; id: string | null }>;
}

export interface Media {
  id?: string | null;
  code?: string | null;
  folder?: string | null;
  type?: string | null;
  createdAt: string;
  createdBy?: string | null;
  modifiedAt: string;
  modifiedBy?: string | null;
  author?: string | null;
  copyright?: string | null;
  originalFileName?: string | null;
  name?: string | null;
  format?: string | null;
  hash?: string | null;
  mimeType?: string | null;
  size: number;
  automaticTags?: string[] | null;
  tags?: string[] | null;
  url?: string | null;
  provider?: string | null;
  height: number | null;
  width: number | null;
  horizontalResolution: number | null;
  verticalResolution: number | null;
  duration: number | null;
  fps: number | null;
  codec: string | null;
  exif?: Record<string, unknown> | null;
}

export interface User<TAttributes extends Record<string, unknown> = Record<string, unknown>> {
  id?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  email?: string | null;
  mobilePhone?: string | null;
  roles?: string[] | null;
  isActive: boolean;
  createdAt: string;
  createdBy?: string | null;
  modifiedAt: string;
  modifiedBy?: string | null;
  notes?: string;
  picture?: string;
  attributes?: TAttributes;
}

export interface Role {
  id?: string | null;
  name?: string | null;
  system: boolean;
  permissions?: string[] | null;
}

export interface PermissionSection {
  name?: string;
  feature?: string;
  permissions?: string[] | null;
}

export interface PermissionGroup {
  group?: string;
  type?: string;
  key?: string;
  sections?: PermissionSection[] | null;
}

export interface PagedMetadata {
  // Matches swagger `metadata.count`.
  count: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PagedResult<T> {
  data?: T[] | null;
  metadata: PagedMetadata;
}

export interface KeyResult<T> {
  // Matches swagger `{ result: ... }` wrappers (StringKeyResult / Int32KeyResult).
  result?: T | null;
}
