import { ActionType } from './ActionType';

export interface ActionEmail {
    type: ActionType.EMAIL;
    to: string;
    subject: string;
    message: string;
}
