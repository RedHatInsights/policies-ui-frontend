import { Action } from './Actions';

export interface Policy {
    id: number;
    actions: Action[];
    conditions: string;
    customerid: string;
    description: string;
    isEnabled: boolean;
    mtime: Date;
    name: string;
    triggerId: string;
}

export interface PagedServerPolicyResponse {
    data: ServerPolicyResponse[];
    meta: any;
    links: any;
}

export interface ServerPolicyResponse {
    id: number;
    actions: string;
    conditions: string;
    customerid: string;
    description: string;
    isEnabled: boolean;
    mtime: string;
    name: string;
    triggerId: string;
}

type OptionalProperties = 'id' | 'mtime' | 'triggerId' | 'customerid';

export type NewPolicy = Partial<Pick<Policy, OptionalProperties>> & Omit<Policy, OptionalProperties>;
export type ServerPolicyRequest = Partial<ServerPolicyResponse>;
