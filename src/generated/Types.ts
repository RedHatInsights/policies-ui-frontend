/**
* Generated code, DO NOT modify directly.
* Instead update the openapi in policies-ui-backend and run in policies-ui-frontend
*   `yarn schema` to re-generate this file.
* Note: As the time of writing, the schema is taken from:
*   http://localhost:8080/api/policies/v1.0/openapi.json
*/
export interface Fact {
  id?: number;
  name?: string;
  type?: FactType;
}

export enum FactType {
  BOOLEAN = 'BOOLEAN',
  INT = 'INT',
  LIST = 'LIST',
  STRING = 'STRING',
}

export interface HistoryItem {
  ctime?: number;
  hostName?: string;
  id?: string;
}

export type List = Array<{
}>;

export type ListHistoryItem = Array<HistoryItem>;

export type ListPolicy = Array<Policy>;

export type ListUUID = Array<string>;

export interface MapStringString {
  [key: string]: string;
}

export interface Meta {
  count?: number;
}

export interface PagedResponseOfHistoryItem {
  data?: ListHistoryItem;
  links?: MapStringString;
  meta?: Meta;
}

export interface PagedResponseOfPolicy {
  data?: ListPolicy;
  links?: MapStringString;
  meta?: Meta;
}

export interface Policy {
  actions?: string;
  conditions: string;
  ctime?: string;
  description?: string;
  id?: Uuid;
  isEnabled?: boolean;
  lastTriggered?: number;
  mtime?: string;
  name: string;
}

export type Uuid = string;

