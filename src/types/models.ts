export type SchemaType = "model" | "component" | "user";

export interface IField {
  key?: string | null;
  label?: string | null;
  name?: string | null;
  hint?: string | null;
  order: number;
  type?: string | null;
  localizable?: boolean | null;
  hidden: boolean;
  readOnly: boolean;
  required: boolean;
}

export interface Component {
  id?: string | null;
  name?: string | null;
  key?: string | null;
  description?: string | null;
  type?: SchemaType | null;
  attributes?: IField[] | null;
  createdAt: string;
  createdBy?: string | null;
  modifiedAt: string;
  modifiedBy?: string | null;
  projectId?: string | null;
}

export interface Fieldset {
  key?: string | null;
  name?: string | null;
  description?: string | null;
  collapsed: boolean;
  fields?: string[] | null;
}

export interface StringStringKeyValue {
  key?: string | null;
  value?: string | null;
}

export interface ModelProperties {
  icon?: string | null;
  fieldsets?: Fieldset[] | null;
  links?: StringStringKeyValue[] | null;
}

export type ModelFilterFieldType =
  | "boolean" | "geoPoint" | "date" | "dateTime" | "timeOfTheDay"
  | "numberInt" | "numberFloat" | "string" | "stringArray" | "json"
  | "object" | "objectArray" | "component" | "componentArray";

export interface ModelFilterModel {
  name?: string | null;
  key?: string | null;
  operators?: string[] | null;
  defaultValue?: unknown;
  fieldType?: ModelFilterFieldType | null;
}

export interface Model {
  id?: string | null;
  name?: string | null;
  key?: string | null;
  description?: string | null;
  type?: SchemaType | null;
  attributes?: IField[] | null;
  createdAt: string;
  createdBy?: string | null;
  modifiedAt: string;
  modifiedBy?: string | null;
  enableStageMode: boolean;
  enableSeo: boolean;
  isSingle: boolean;
  system: boolean;
  localizable: boolean;
  properties?: ModelProperties | null;
  filters?: ModelFilterModel[] | null;
}
