import type { FilterOperator } from "./http";

const TEXT_OPS = ["eq", "neq", "contains", "ncontains", "starts", "nstarts", "ends", "nends"] as const;
const DATE_OPS = ["eq", "neq", "gt", "gte", "lt", "lte"] as const;
const ID_OPS = ["eq", "neq", "any", "nany", "all"] as const;
const EQ_OPS = ["eq"] as const;

export const CONTENT_FILTERS = {
  id: ID_OPS,
  createdAt: DATE_OPS,
  createdBy: TEXT_OPS,
  modifiedAt: DATE_OPS,
  modifiedBy: TEXT_OPS,
  locale: EQ_OPS,
  status: EQ_OPS
} as const;

export const CONTENT_SORT_FIELDS = ["id", "createdAt", "createdBy", "modifiedAt", "modifiedBy", "status"] as const;

export const MEDIA_FILTERS = {
  author: TEXT_OPS,
  id: ["eq", "any"],
  code: [
    "eq",
    "neq",
    "contains",
    "ncontains",
    "starts",
    "nstarts",
    "ends",
    "nends",
    "any",
    "nany"
  ],
  createdAt: DATE_OPS,
  createdBy: TEXT_OPS,
  folderId: [
    "eq",
    "neq",
    "contains",
    "ncontains",
    "starts",
    "nstarts",
    "ends",
    "nends",
    "any",
    "nany"
  ],
  height: DATE_OPS,
  horizontalResolution: DATE_OPS,
  mimeType: ["eq", "any"],
  modifiedAt: DATE_OPS,
  modifiedBy: TEXT_OPS,
  name: TEXT_OPS,
  originalFileName: [
    "eq",
    "neq",
    "contains",
    "ncontains",
    "starts",
    "nstarts",
    "ends",
    "nends"
  ],
  size: DATE_OPS,
  tags: ["any", "nany", "all"],
  type: ["eq", "neq", "any", "nany"],
  format: [
    "eq",
    "neq",
    "contains",
    "ncontains",
    "starts",
    "nstarts",
    "ends",
    "nends",
    "any",
    "nany"
  ],
  verticalResolution: DATE_OPS,
  width: DATE_OPS
} as const;

export const MEDIA_SORT_FIELDS = [
  "author",
  "id",
  "code",
  "createdAt",
  "createdBy",
  "folderId",
  "height",
  "horizontalResolution",
  "mimeType",
  "modifiedAt",
  "modifiedBy",
  "name",
  "originalFileName",
  "size",
  "tags",
  "type",
  "format",
  "verticalResolution",
  "width"
] as const;

export const USER_FILTERS = {
  id: ID_OPS,
  firstName: TEXT_OPS,
  lastName: TEXT_OPS,
  username: TEXT_OPS,
  email: TEXT_OPS,
  mobilePhone: TEXT_OPS,
  roles: ["any", "nany", "all"],
  isActive: ["eq", "neq"],
  createdAt: DATE_OPS,
  createdBy: TEXT_OPS,
  modifiedAt: DATE_OPS,
  modifiedBy: TEXT_OPS
} as const;

export const USER_SORT_FIELDS = [
  "id",
  "firstName",
  "lastName",
  "username",
  "email",
  "mobilePhone",
  "isActive",
  "createdAt",
  "createdBy",
  "modifiedAt",
  "modifiedBy"
] as const;

export type AllowedOperatorFor<TFieldMap, TField extends keyof TFieldMap> = TFieldMap[TField] extends readonly string[]
  ? TFieldMap[TField][number]
  : FilterOperator;
