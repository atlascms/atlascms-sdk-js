export type SchemaType = "model" | "component" | "user";

export interface IField {
  key?: string | null;
  name?: string | null;
  type?: string | null;
  isRequired?: boolean;
  isMultiple?: boolean;
  defaultValue?: unknown;
  validations?: Record<string, unknown>;
  helpText?: string | null;
  [key: string]: unknown;
}

export interface Component {
  id?: string | null;
  name?: string | null;
  key?: string | null;
  description?: string | null;
  type: SchemaType;
  attributes?: IField[] | null;
  createdAt?: string | null;
  createdBy?: string | null;
  modifiedAt?: string | null;
  modifiedBy?: string | null;
  projectId?: string | null;
}

export interface ComponentModel {
  id?: string | null;
  modelKey?: string | null;
  locale?: string | null;
  createdAt?: string;
  createdBy?: string | null;
  modifiedAt?: string;
  modifiedBy?: string | null;
  hash?: string | null;
  status?: "published" | "unpublished" | null;
  seo?: Record<string, unknown> | null;
  attributes?: Record<string, unknown> | null;
  locales?: Array<{ locale: string; status: "published" | "unpublished" }> | null;
}
