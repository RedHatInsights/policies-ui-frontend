import { Action } from './Actions';
import { Severity } from './Severity';

export interface Policy {
    id?: string;
    actions?: Action[];
    conditions: string;
    customerid: string;
    description?: string;
    isEnabled?: boolean;
    name: string;
    severity?: Severity;
}
