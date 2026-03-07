export type ContentStatus = "published" | "unpublished";

export interface Content<TAttributes extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  modelKey: string;
  locale: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
  hash: string;
  status: ContentStatus;
  attributes?: TAttributes;
  locales?: Array<{ locale: string; status: ContentStatus }>;
}

export interface Media {
  id: string;
  code: string;
  folder: string;
  type: string;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
  author: string;
  copyright: string;
  originalFileName: string;
  name: string;
  format: string;
  hash: string;
  mimeType: string;
  size: number;
  automaticTags: string[];
  tags: string[];
  url: string;
  provider: string;
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
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobilePhone: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  modifiedAt: string;
  modifiedBy: string;
  notes?: string;
  picture?: string;
  attributes?: TAttributes;
}

export interface Role {
  id: string;
  name: string;
  system: boolean;
  permissions: string[];
}

export interface PermissionSection {
  name?: string;
  feature?: string;
  permissions?: string[];
}

export interface PermissionGroup {
  group?: string;
  type?: string;
  key?: string;
  sections?: PermissionSection[];
}

export interface PagedMetadata {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PagedResult<T> {
  data: T[];
  metadata: PagedMetadata;
}
