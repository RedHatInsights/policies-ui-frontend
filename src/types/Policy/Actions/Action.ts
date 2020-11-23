import { ActionEmail } from './ActionEmail';
import { ActionNotification } from './ActionNotification';
import { ActionType } from './ActionType';

export type Action = ActionEmail | ActionNotification;

export const isActionEmail = (action: Action): action is ActionEmail => {
    return action.type === ActionType.EMAIL;
};

export const isActionNotification = (action: Action): action is ActionNotification => {
    return action.type === ActionType.NOTIFICATION;
};

export const isAction = (maybeAction: any): maybeAction is Action => {
    return isActionEmail(maybeAction) || isActionNotification(maybeAction);
};
