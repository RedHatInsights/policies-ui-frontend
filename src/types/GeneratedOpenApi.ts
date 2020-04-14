/**
* Generated code, DO NOT modify directly.
* Instead update the openapi in policies-ui-backend and run in policies-ui-frontend
*   `yarn generate-schema` to re-generate this file.
* Note: As the time of writing, the schema is taken from:
*   http://localhost:8080/api/policies/v1.0/openapi.json
*/
export enum FactType {
  BOOLEAN = 'BOOLEAN',
  INT = 'INT',
  LIST = 'LIST',
  STRING = 'STRING',
}

export interface Fact {
  id?: number;
  name?: string;
  type?: FactType;
}

export type ListUUID = Array<string>;

export type Uuid = string;

export type ListObject = Array<{
}>;

export interface MapStringString {
  [key: string]: string;
}

export interface MapStringLong {
  [key: string]: number;
}

export interface PagedResponse {
  data?: ListObject;
  links?: MapStringString;
  meta?: MapStringLong;
}

export interface Policy {
  actions?: string;
  conditions: string;
  ctime?: string;
  description?: string;
  id?: Uuid;
  isEnabled?: boolean;
  lastEvaluation?: string;
  mtime?: string;
  name: string;
}

export interface SettingsValues {
  dailyEmail?: boolean;
  immediateEmail?: boolean;
}

