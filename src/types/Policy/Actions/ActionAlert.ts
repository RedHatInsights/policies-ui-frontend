import { Severity } from '../Severity';
import { ActionType } from './ActionType';

export interface ActionAlert {
    type: ActionType.ALERT;
    severity: Severity;
    message: string;
}
