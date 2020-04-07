import { Action } from './Actions';
import * as Generated from '../GeneratedOpenApi';

export type PolicyId = Generated.Uuid;

export interface Policy {
    id: PolicyId;
    actions: Action[];
    conditions: string;
    description: string;
    isEnabled: boolean;
    mtime: Date;
    ctime: Date;
    name: string;
    lastEvaluation: Date | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PagedServerPolicyResponse extends Generated.PagedResponse {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServerPolicyResponse extends Generated.Policy {}

type OptionalProperties = 'id' | 'mtime' | 'ctime' | 'lastEvaluation';
type OutputOnlyProperties = 'mtime' | 'ctime' | 'lastEvaluation';

export type NewPolicy = Partial<Pick<Policy, OptionalProperties>> & Omit<Policy, OptionalProperties>;
export type ServerPolicyRequest = Partial<Omit<ServerPolicyResponse, OutputOnlyProperties>>;
