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

export type Uuid = string;

export interface Policy {
  actions?: string;
  conditions: string;
  description?: string;
  id?: Uuid;
  isEnabled?: boolean;
  mtime?: string;
  name: string;
}

export type ListPolicy = Array<Policy>;

export interface MapStringString {
  [key: string]: string;
}

export interface MapStringLong {
  [key: string]: number;
}

export interface PagedResponse {
  data?: ListPolicy;
  links?: MapStringString;
  meta?: MapStringLong;
}

export interface SettingsValues {
  dailyEmail?: boolean;
  immediateEmail?: boolean;
}

