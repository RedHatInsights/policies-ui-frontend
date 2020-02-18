import { Action } from './Actions';

export interface Policy {
    id: number;
    actions?: Action[];
    conditions: string;
    customerid?: string;
    description?: string;
    isEnabled?: boolean;
    mtime: Date;
    name: string;
}

export interface PagedServerPolicyResponse {
    data: ServerPolicyResponse[];
    meta: any;
    links: any;
}

export interface ServerPolicyResponse {
    id: number;
    actions?: string;
    conditions: string;
    customerid: string;
    description?: string;
    is_enabled: boolean; // eslint-disable-line @typescript-eslint/camelcase, camelcase
    mtime: string;
    name: string;
}

export type PolicyWithOptionalId = Partial<Pick<Policy, 'id'>> & Omit<Policy, 'id'>;
export type ServerPolicyRequest = Partial<ServerPolicyResponse>;
