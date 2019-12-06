import { ActionType } from './ActionType';

export interface ActionSms {
    type: ActionType.SMS;
    number: string;
    message: string;
}
