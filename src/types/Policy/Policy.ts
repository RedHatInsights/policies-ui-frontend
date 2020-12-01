import { Action } from './Actions';
import * as Generated from '../../generated/Openapi';

export type Uuid = Generated.Schemas.UUID;
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

export type ServerPolicyResponse = Generated.Schemas.Policy;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type PagedServerPolicyResponse = Generated.Schemas.PagedResponseOfPolicy;

type OptionalProperties = 'id' | 'mtime' | 'ctime' | 'lastTriggered';
type OutputOnlyProperties = 'mtime' | 'ctime' | 'lastTriggered';

export type NewPolicy = Partial<Pick<Policy, OptionalProperties>> & Omit<Policy, OptionalProperties>;
export type ServerPolicyRequest = Omit<ServerPolicyResponse, OutputOnlyProperties>;
