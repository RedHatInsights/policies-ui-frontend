import { Action } from './Actions';

export interface Policy {
    id: string;
    actions: Action[];
    conditions: string;
    customerid: string;
    description: string;
    isEnabled: boolean;
    mtime: Date;
    name: string;
}

export interface PagedServerPolicyResponse {
    data: ServerPolicyResponse[];
    meta: any;
    links: any;
}

export interface ServerPolicyResponse {
    id: string;
    actions: string;
    conditions: string;
    customerid: string;
    description: string;
    isEnabled: boolean;
    mtime: string;
    name: string;
}

type OptionalProperties = 'id' | 'mtime'  | 'customerid';

export type NewPolicy = Partial<Pick<Policy, OptionalProperties>> & Omit<Policy, OptionalProperties>;
export type ServerPolicyRequest = Partial<ServerPolicyResponse>;
