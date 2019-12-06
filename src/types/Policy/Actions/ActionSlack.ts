import { ActionType } from './ActionType';

export interface ActionSlack {
    type: ActionType.SLACK;
    account: string;
    token: string;
    room?: string;
}
