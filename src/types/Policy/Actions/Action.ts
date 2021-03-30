import { ActionNotification } from './ActionNotification';
import { ActionType } from './ActionType';

export type Action = ActionNotification;

export const isActionNotification = (action: Action): action is ActionNotification => {
    return action.type === ActionType.NOTIFICATION;
};

export const isAction = (maybeAction: any): maybeAction is Action => {
    return isActionNotification(maybeAction);
};
