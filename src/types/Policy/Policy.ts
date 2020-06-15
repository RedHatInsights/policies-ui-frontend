import { Action } from './Actions';
import * as Generated from '../../generated/Types';

export type Uuid = Generated.Uuid;
export const maxPolicyNameLength = 150;

export interface Policy {
    id: Uuid;
    actions: Action[];
    conditions: string;
    description: string;
    isEnabled: boolean;
    mtime: Date;
    ctime: Date;
    name: string;
    lastTriggered: Date | undefined;
}

export type ServerPolicyResponse = Generated.Policy;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PagedServerPolicyResponse extends Generated.PagedResponse {
    data: Array<ServerPolicyResponse>;
}

type OptionalProperties = 'id' | 'mtime' | 'ctime' | 'lastTriggered';
type OutputOnlyProperties = 'mtime' | 'ctime' | 'lastTriggered';

export type NewPolicy = Partial<Pick<Policy, OptionalProperties>> & Omit<Policy, OptionalProperties>;
export type ServerPolicyRequest = Omit<ServerPolicyResponse, OutputOnlyProperties>;
