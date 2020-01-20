import { Action } from './Actions';

export interface Policy {
    id?: string;
    actions?: Action[];
    conditions: string;
    customerid?: string;
    description?: string;
    isEnabled?: boolean;
    name: string;
}

export interface ServerPolicy {
    id?: string;
    actions?: string;
    conditions: string;
    customerid?: string;
    description?: string;
    is_enabled?: boolean; // eslint-disable-line @typescript-eslint/camelcase, camelcase
    name: string;
}
