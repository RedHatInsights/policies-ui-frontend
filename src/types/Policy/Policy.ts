import { Action } from './Actions';
import * as Generated from '../GeneratedOpenApi';

export interface Policy {
    id: Generated.Uuid;
    actions: Action[];
    conditions: string;
    description: string;
    isEnabled: boolean;
    mtime: Date;
    name: string;
}

export type PagedServerPolicyResponse = Generated.PagedResponse;

export type ServerPolicyResponse = Generated.Policy;

type OptionalProperties = 'id' | 'mtime';

export type NewPolicy = Partial<Pick<Policy, OptionalProperties>> & Omit<Policy, OptionalProperties>;
export type ServerPolicyRequest = Partial<ServerPolicyResponse>;
